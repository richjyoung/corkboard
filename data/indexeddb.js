export const DB_STICKIES = 'stickies';
export const DB_POLAROIDS = 'polaroids';
export var db;

var db_open = indexedDB.open('corkboard', 2);

db_open.onupgradeneeded = function() {
    console.log('IndexedDB: onupgradeneeded');
    db = db_open.result;

    if(!db.objectStoreNames.contains(DB_STICKIES)) {
        db.createObjectStore(DB_STICKIES, { keyPath: 'id' });
    }

    if(!db.objectStoreNames.contains(DB_POLAROIDS)) {
        db.createObjectStore(DB_POLAROIDS, { keyPath: 'id' });
    }
};

db_open.onsuccess = function() {
    console.log('IndexedDB: onsuccess');
    db = db_open.result;
    window.vm.$store.dispatch('load_state');
};