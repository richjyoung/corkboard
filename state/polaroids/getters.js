export default {
    polaroid: function(state) {
        return function(index) {
            return state.items[index];
        }
    }
}