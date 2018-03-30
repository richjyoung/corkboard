import Vue from 'vue';
import Vuex from 'vuex';
import corkboard from './view/corkboard.vue';
import store from './state';
import { clipboard } from 'electron';

window.vm = new Vue({
    el: '#corkboard',
    store,
    render: h => h(corkboard),
    created: function() {
        // this.$store.dispatch('app_created');
        document.onkeydown = this.keydown;
    },
    mounted: function() {
        // this.$store.dispatch('app_mounted');
    },
    methods: {
        keydown: function(e) {
            if(e.key == "v" && e.ctrlKey) {
                this.paste();
            } else if (e.key == "r" && e.ctrlKey) {
                location.reload();
            }
        },
        paste: function() {
            this.$store.dispatch('new_sticky', {
                x: window.innerWidth / 2,
                y: window.innerHeight / 2,
                content: clipboard.readText()
            });
        }
    }
});