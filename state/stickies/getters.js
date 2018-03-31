export default {
    sticky: function(state) {
        return function(id) {
            return state.items[id];
        }
    }
}