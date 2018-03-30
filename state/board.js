import Vue from 'vue';
import Vuex from 'vuex';

var db;
var db_open = indexedDB.open('corkboard', 1);

db_open.onupgradeneeded = function() {
    console.log('IndexedDB: onupgradeneeded');
    db = db_open.result;
    db.createObjectStore('stickies', {keyPath: "id"});
}

db_open.onsuccess = function() {
    console.log('IndexedDB: onsuccess');
    db = db_open.result;
    window.vm.$store.dispatch('load_state');
}

export default {
    state: {
        stickies: {},
        maxZ: 0
    },
    getters: {
        sticky: function(state) {
            return function(index) {
                return state.stickies[index];
            }
        }
    },
    actions: {
        edit_sticky: function(context, payload) {
            context.commit('edit_sticky', payload);
            context.commit('save_state', payload.itemId);
        },
        delete_sticky: function(context, itemId) {
            context.commit('delete_sticky', itemId);
        },
        promote_sticky: function(context, itemId) {
            context.commit('promote_sticky', itemId);
            context.commit('save_state', itemId);
        },
        toggle_field: function(context, payload) {
            context.commit('toggle_field', payload);
            context.commit('save_state', payload.itemId);
        },
        move_sticky: function(context, payload) {
            context.commit('move_sticky', payload);
        },
        move_sticky_finished: function(context, itemId) {
            context.commit('save_state', itemId);
        },
        cycle_sticky_colour: function(context, itemId) {
            context.commit('cycle_sticky_colour', itemId);
            context.commit('save_state', itemId);
        },
        load_state: function(context) {
            var sticky_tx = db.transaction('stickies', 'readwrite');
            var sticky_store = sticky_tx.objectStore("stickies");
            var req = sticky_store.getAll();
            req.onsuccess = function() {
                context.commit('load_state', req.result);
            }
        }
    },
    mutations: {
        load_state: function(state, result) {
            for(var i = 0; i < result.length; i++) {
                Vue.set(state.stickies, result[i].id, result[i]);
                state.maxZ = Math.max(state.maxZ, result[i].z);
            }
        },
        save_state: function(state, itemId) {
            var sticky_tx = db.transaction('stickies', 'readwrite');
            var sticky_store = sticky_tx.objectStore("stickies");
            if(itemId) {
                console.log('Saving sticky ' + itemId);
                sticky_store.put(state.stickies[itemId]);
            } else {
                console.log('Saving all stickies');
                for(var sticky in state.stickies) {
                    if(state.stickies.hasOwnProperty(sticky)) {
                        state.stickies[sticky].id = sticky;
                        sticky_store.put(state.stickies[sticky]);
                    }
                }
            }
        },
        move_sticky: function(state, payload) {
            state.stickies[payload.itemId].x += payload.x;
            state.stickies[payload.itemId].y += payload.y;
        },
        edit_sticky: function(state, payload) {
            state.stickies[payload.itemId].content = payload.value;
        },
        promote_sticky: function(state, itemId) {
            state.stickies[itemId].z = state.maxZ;
            state.maxZ++;
        },
        new_sticky: function(state, payload) {
            var id = (new Date().getTime());
            var obj = {
                id: id,
                content: payload.content || '',
                x: payload.x,
                y: payload.y,
                z: state.maxZ + 1,
                colour: 0,
                bold: false,
                wide: false,
                centre: false
            }

            Vue.set(state.stickies, id, obj);
            state.maxZ++;
        },
        delete_sticky: function(state, itemId) {
            var sticky_tx = db.transaction('stickies', 'readwrite');
            var sticky_store = sticky_tx.objectStore("stickies");
            var req = sticky_store.delete(+itemId);
            req.onsuccess = function() {
                console.log('Sticky ' + itemId + ' deleted');
            }
            req.onerror = function(event) {
                console.error('Error deleting Sticky ' + itemId);
                console.error(event);
            }
            Vue.delete(state.stickies, itemId);
        },
        toggle_field: function(state, payload) {
            Vue.set(state.stickies[payload.itemId], payload.field, !state.stickies[payload.itemId][payload.field]);
        },
        cycle_sticky_colour: function(state, itemId) {
            Vue.set(state.stickies[itemId], 'colour', (state.stickies[itemId].colour + 1) % 4);
        }
    }
};