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
            context.commit('polaroid_edit_caption', payload);
        },
        polaroid_move: function(context, payload) {
            context.commit('polaroid_move', payload);
        }
    },
    mutations: {
        polaroid_edit_caption: function(state, payload) {
            state.items[payload.itemId].caption = payload.value;
        },
        polaroid_move: function(state, payload) {
            state.items[payload.itemId].x += payload.x;
            state.items[payload.itemId].y += payload.y;
        }
    }
}