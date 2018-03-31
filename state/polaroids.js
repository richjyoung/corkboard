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
    actions: {},
    mutations: {}
}