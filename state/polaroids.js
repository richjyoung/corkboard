import Vue from 'vue';
import { POLAROID_EDIT_CAPTION, POLAROID_MOVE, POLAROID_NEW } from './mutation_types';

export default {
    state: {
        items: {
            polaroid1: {
                url: 'http://wowslider.com/sliders/demo-93/data1/images/sunset.jpg',
                caption: 'haiii...',
                x: 100,
                y: 100,
                z: 1
            }
        }
    },
    getters: {
        polaroid: function(state) {
            return function(index) {
                return state.items[index];
            }
        }
    },
    actions: {
        polaroid_edit_caption: function(context, payload) {
            context.commit(POLAROID_EDIT_CAPTION, payload);
        },
        polaroid_move: function(context, payload) {
            context.commit(POLAROID_MOVE, payload);
        },
        polaroid_new: function(context, payload) {
            context.commit(POLAROID_NEW, payload);
        }
    },
    mutations: {
        [POLAROID_EDIT_CAPTION]: function(state, payload) {
            state.items[payload.itemId].caption = payload.value;
        },
        [POLAROID_MOVE]: function(state, payload) {
            state.items[payload.itemId].x += payload.x;
            state.items[payload.itemId].y += payload.y;
        },
        [POLAROID_NEW]: function(state, payload) {
            var id = (new Date().getTime());
            var obj = {
                id: id,
                x: payload.x,
                y: payload.y,
                z: 1000,
                url: payload.url,
                caption: payload.caption || ''
            }

            Vue.set(state.items, id, obj);
        }
    }
}