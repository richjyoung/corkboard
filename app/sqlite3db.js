const { app, ipcMain } = require('electron');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const mkdirp = require('mkdirp');
const touch = require('touch');

module.exports = (function(){

    const upgrade_map = {
        0: upgrade_0_to_1
    };

    var db;

    function open_db() {
        const default_db_root = path.join(app.getPath('userData'));
        const default_db = path.join(default_db_root, 'default.db');

        mkdirp(default_db_root, function(err){
            if(err) {
                console.error(err);
            } else {
                touch(default_db, function() {
                    db = new sqlite3.Database(default_db, sqlite3.OPEN_READWRITE, (err) => {
                        if(err){
                            console.error('Failed to open database at ' + default_db);
                            console.error(err);
                        } else {
                            console.log('Connected to database');
                            load_version();
                        }
                    });
                });
            }
        });
    }

    function load_version() {
        db.get('PRAGMA user_version;', (err, result) => {
            if(err) {
                console.error(err);
            }
            console.log('Database version ' + result.user_version);
            if(result.user_version <= Math.max(Object.keys(upgrade_map))) {
                console.log('Upgrading database...');
                upgrade_map[result.user_version]();
            }
        });
    }

    function upgrade_0_to_1() {
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

        db.get(query, (err) => {
            if(err) {
                console.error(err);
            }
            complete_upgrade(1);
        });
    }

    function complete_upgrade(version) {
        var query = 'PRAGMA user_version=' + version + ';';
        db.get(query, (err) => {
            if(err) {
                console.error(err);
            }
            load_version();
        });
    }

    ipcMain.on('sqlite3_db_all', (event, arg) => {
        console.log('Received db transaction request ' + arg.id);
        db.all(arg.query, arg.params, (err, rows) => {
            if(err) {
                console.error(err);
            }
            console.log('Completed db transaction request ' + arg.id);
            event.sender.send('sqlite3_db_all_callback', {
                id: arg.id,
                err: err,
                rows: rows
            });
        });
    });

    return open_db;

})();






