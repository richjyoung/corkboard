import path from 'path';
import sqlite3 from 'sqlite3';
import mkdirp from 'mkdirp';
import touch from 'touch';
import { logwrap } from './logwrap';
const logger = logwrap('Database');

export class Database {
    constructor(path) {
        this._path = path;
        this._conn = undefined;
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
        return this.create_path_if_not_exists()
            .then(() => this.create_file_if_not_exists())
            .then(() => this.open_db())
            .then(() => this.load_version())
            .then(() => {
                this.upgrade();
            });
    }

    upgrade() {
        var upgrade_function = `upgrade_${this._version}_${this._version + 1}`;
        logger.debug('Checking function %s()', upgrade_function);
        if (this[upgrade_function]) {
            logger.verbose(
                'Starting upgrade from %d to %d...',
                this._version,
                this._version + 1
            );
            this[upgrade_function]((err) => {
                if (err) {
                    logger.error('Upgrade failed');
                } else {
                    logger.verbose(
                        'Upgrade from %d to %d',
                        this._version,
                        this._version + 1
                    );
                    this._version++;
                    this.upgrade();
                }
            });
        } else {
            logger.info('Up to date');
            this.save_version();
        }
    }

    create_path_if_not_exists() {
        var self = this;
        return new Promise((resolve, reject) => {
            mkdirp(path.dirname(self._path), function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    create_file_if_not_exists() {
        var self = this;
        return new Promise((resolve) => {
            touch(self._path, function() {
                resolve();
            });
        });
    }

    open_db() {
        var self = this;
        return new Promise((resolve, reject) => {
            self._conn = new sqlite3.Database(
                self._path,
                sqlite3.OPEN_READWRITE,
                (err) => {
                    if (err) {
                        logger.error(
                            'Failed to open database at ' + self._path
                        );
                        reject(err);
                    } else {
                        logger.info('Connected');
                        resolve();
                    }
                }
            );
        });
    }

    load_version() {
        var self = this;
        return new Promise((resolve, reject) => {
            self._conn.get('PRAGMA user_version;', (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    self._version = result.user_version;
                    logger.verbose('Version ' + self._version);
                    resolve();
                }
            });
        });
    }

    save_version() {
        var self = this;
        return new Promise((resolve, reject) => {
            self._conn.get(
                'PRAGMA user_version = ' + this._version + ';',
                (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        logger.verbose('Version saved');
                        resolve();
                    }
                }
            );
        });
    }

    upgrade_0_1(callback) {
        var query = [
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

    upgrade_1_2(callback) {
        var query = [
            'ALTER TABLE corkboard',
            'ADD COLUMN board TEXT DEFAULT "default"'
        ].join(' ');

        this._conn.get(query, callback);
    }

    upgrade_2_3(callback) {
        var query = ['UPDATE corkboard', 'SET board = "default";'].join(' ');

        this._conn.get(query, callback);
    }
}
