import { OPEN_READWRITE, Database as SqlDatabase } from 'sqlite3';
import { logwrap } from './logwrap';
import mkdirp from 'mkdirp';
import path from 'path';
import touch from 'touch';

const logger = logwrap('Database');

export class Database {
    constructor(dbPath) {
        this._path = dbPath;
        this._version = 0;
        this._ready = false;

        this.connect().catch((err) => {
            logger.error(err);
        });
    }

    get connection() {
        return this._conn;
    }

    connect() {
        return this.createPathIfNotExists()
            .then(() => { return this.createFileIfNotExists(); })
            .then(() => { return this.openDb(); })
            .then(() => { return this.loadVersion(); })
            .then(() => { this.upgrade(); });
    }

    upgrade() {
        const upgradeFunction = `upgrade_${this._version}_${this._version + 1}`;
        logger.debug('Checking function %s()', upgradeFunction);
        if(this[upgradeFunction]) {
            logger.verbose('Starting upgrade from %d to %d...',
                this._version, this._version + 1);

            this[upgradeFunction]((err) => {
                if(err) {
                    logger.error('Upgrade failed');
                } else {
                    logger.verbose('Upgrade from %d to %d',
                        this._version, this._version + 1);

                    this._version++;
                    this.upgrade();
                }
            });
        } else {
            logger.info('Up to date');
            this.saveVersion();
        }
    }

    createPathIfNotExists() {
        const self = this;
        return new Promise((resolve, reject) => {
            mkdirp(path.dirname(self._path), (err) => {
                if(err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    createFileIfNotExists() {
        const self = this;
        return new Promise((resolve) => {
            touch(self._path, () => {
                resolve();
            });
        });
    }

    openDb() {
        const self = this;
        return new Promise((resolve, reject) => {
            self._conn = new SqlDatabase(self._path, OPEN_READWRITE, (err) => {
                if(err) {
                    logger.error(`Failed to open database at ${self._path}`);
                    reject(err);
                } else {
                    logger.info('Connected');
                    resolve();
                }
            });
        });
    }

    loadVersion() {
        const self = this;
        return new Promise((resolve, reject) => {
            self._conn.get('PRAGMA user_version;', (err, result) => {
                if(err) {
                    reject(err);
                } else {
                    self._version = result.user_version;
                    logger.verbose(`Version ${self._version}`);
                    resolve();
                }
            });
        });
    }

    saveVersion() {
        const self = this;
        return new Promise((resolve, reject) => {
            self._conn.get(`PRAGMA user_version = ${this._version};`, (err) => {
                if(err) {
                    reject(err);
                } else {
                    logger.verbose('Version saved');
                    resolve();
                }
            });
        });
    }

    upgrade_0_1(callback) { // eslint-disable-line camelcase
        const query = [
            'CREATE TABLE IF NOT EXISTS corkboard (',
            'id INTEGER PRIMARY KEY,',
            'type TEXT NOT NULL,',
            'content TEXT,',
            'title TEXT,',
            'x INTEGER,',
            'y INTEGER,',
            'z INTEGER,',
            'deleted INTEGER DEFAULT 0,',
            'settings TEXT',
            ');'
        ].join('');

        this._conn.get(query, callback);
    }
}
