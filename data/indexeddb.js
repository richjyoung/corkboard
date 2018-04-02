import { A_LOAD_ALL } from '../state/action_types';

export const DB_STICKIES = 'stickies';
export const DB_POLAROIDS = 'polaroids';
export const DB_CORKBOARD = 'corkboard';
export var db;

var db_open = indexedDB.open('corkboard', 3);

db_open.onupgradeneeded = function() {
    console.log('IndexedDB: Upgraded database');
    db = db_open.result;

    if(!db.objectStoreNames.contains(DB_CORKBOARD)) {
        db.createObjectStore(DB_CORKBOARD, { keyPath: 'id' });
    }
};

db_open.onsuccess = function() {
    db = db_open.result;
    window.vm.$store.dispatch(A_LOAD_ALL);
};