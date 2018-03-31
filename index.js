import Vue from 'vue';
import Vuex from 'vuex';
import corkboard from './view/corkboard.vue';
import store from './state';
import { clipboard } from 'electron';
import { A_APP_TOGGLE_GODMODE } from './state/action_types';

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
            } else if (e.key == "s" && e.ctrlKey) {
                this.$store.dispatch('save_state');
            } else if (e.code == "KeyA" && e.ctrlKey && e.altKey && e.shiftKey) {
                this.$store.dispatch(A_APP_TOGGLE_GODMODE);
            }
        },
        paste: function() {

            var clipboard_text = clipboard.readText();
            if(clipboard_text) {
                console.log('Pasting text ' + clipboard_text + '...');
            }

            var clipboard_image = clipboard.readImage();
            if(!clipboard_image.isEmpty()) {

                var original_size = clipboard_image.getSize();
                if(original_size.height > 250 || original_size.width > 250) {
                    if(original_size.heigh > original_size.width) {
                        var target_image = clipboard_image.resize({ height: 250 });
                    } else {
                        var target_image = clipboard_image.resize({ width: 250 });
                    }
                } else {
                    var target_image = clipboard_image;
                }

                var target_size = target_image.getSize();
                var data_url = target_image.toDataURL();
                
                console.log('Pasting ' + original_size.width + 'x' + original_size.height + ' image as '
                    + target_size.width + 'x' + target_size.height + '...');

                this.$store.dispatch('polaroid_new', {
                    x: window.innerWidth / 2,
                    y: window.innerHeight / 2,
                    url: data_url
                });
            }
        }
    }
});