export default {
    sticky: function(state) {
        return function(id) {
            return state.items[id];
        };
    },
    sticky_move_group: function(state) {
        return state.move_group;
    }
};