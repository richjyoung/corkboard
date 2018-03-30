export default {
    state: {
        godmode: false
    },
    getters: {},
    actions: {
        toggle_godmode: function(context) {
            context.commit('toggle_godmode');
        }
    },
    mutations: {
        toggle_godmode: function(state) {
            state.godmode = !state.godmode;
        }
    }
}