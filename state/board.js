import Vue from 'vue';
import Vuex from 'vuex';

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
        move_sticky_finished: function(context) {
            context.commit('move_sticky_finished');
        }
    },
    mutations: {
        move_sticky_finished: function(state, itemId) {
            
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
                content: payload.content || '',
                x: payload.x,
                y: payload.y,
                z: state.maxZ,
                colour: 0,
                bold: false,
                wide: false,
                centre: false
            }

            Vue.set(state.stickies, id, obj);
            state.maxZ++;
        },
        delete_sticky: function(state, itemId) {
            Vue.delete(state.stickies, itemId);
        },
        toggle_bold_sticky: function(state, itemId) {
            Vue.set(state.stickies[itemId], 'bold', !state.stickies[itemId].bold);
        },
        toggle_wide_sticky: function(state, itemId) {
            Vue.set(state.stickies[itemId], 'wide', !state.stickies[itemId].wide);
        },
        toggle_centre_sticky: function(state, itemId) {
            Vue.set(state.stickies[itemId], 'centre', !state.stickies[itemId].centre);
        },
        toggle_colour_sticky: function(state, itemId) {
            Vue.set(state.stickies[itemId], 'colour', (state.stickies[itemId].colour + 1) % 4);
        }
    }
};