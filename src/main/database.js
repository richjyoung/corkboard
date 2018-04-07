const { app, ipcMain } = require('electron');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const mkdirp = require('mkdirp');
const touch = require('touch');

export class Database {
    constructor(path) {
        this._path = path;
        this._conn = undefined;
        this.connect().then(() => {
            this.upgrade_db();
        }).catch((err) => {
            console.log(err);
        });
    }

    get connection() {
        return this._conn;
    }

    connect() {
        return this.create_path_if_not_exists()
            .then(() => this.create_file_if_not_exists())
            .then(() => this.open_db());
    }

    create_path_if_not_exists() {
        var self = this;
        return new Promise((resolve, reject) => {
            mkdirp(path.dirname(self._path), function(err) {
                if(err) {
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
            self._conn = new sqlite3.Database(self._path, sqlite3.OPEN_READWRITE, (err) => {
                if(err){
                    console.error('Failed to open database at ' + self._path);
                    reject(err);
                } else {
                    console.log('Connected to database');
                    resolve();
                }
            });
        });
    }


}
