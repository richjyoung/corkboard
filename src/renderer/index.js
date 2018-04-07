import Vue from 'vue';
import corkboard from './corkboard.vue';
import store from './state';
import { clipboard, ipcRenderer } from 'electron';
import {
    A_APP_TOGGLE_GODMODE,
    A_BOARD_ADD_ITEM,
    A_LOAD_ALL
} from './state/action_types';

import rem_to_px from './utils/rem_to_px';


import { RPC } from '../common/rpc_client';


window.vm = new Vue({
    el: '#corkboard',
    store,
    created: function() {
        document.onkeydown = this.keydown;
    },
    mounted: function() {
        this.$store.dispatch(A_LOAD_ALL);
        RPC.something((err, res) => {
            console.log(res);
        });
        RPC.something((err, res) => {
            console.log(res);
        });
    },
    methods: {
        keydown: function(e) {
            if(e.key == 'v' && e.ctrlKey) {
                this.paste();
            } else if (e.key == 'n' && e.ctrlKey) {
                this.new_sticky();
            } else if (e.key == 'r' && e.ctrlKey) {
                location.reload();
            } else if (e.key == 's' && e.ctrlKey) {
                this.$store.dispatch('save_state');
            } else if (e.code == 'KeyA' && e.ctrlKey && e.altKey && e.shiftKey) {
                this.$store.dispatch(A_APP_TOGGLE_GODMODE);
            }
        },
        new_sticky: function() {
            this.$store.dispatch(A_BOARD_ADD_ITEM, {
                x: (window.innerWidth - rem_to_px(15)) / 2,
                y: (window.innerHeight - rem_to_px(15)) / 2,
                z: this.$store.getters.item_max_field('z') + 1,
                type: 'sticky'
            });
        },
        paste: function() {

            var clipboard_text = clipboard.readText();
            if(clipboard_text) {
                console.log('Pasting text ' + clipboard_text + '...');
                this.$store.dispatch(A_BOARD_ADD_ITEM, {
                    x: (window.innerWidth - rem_to_px(15)) / 2,
                    y: (window.innerHeight - rem_to_px(15)) / 2,
                    z: this.$store.getters.item_max_field('z') + 1,
                    type: 'sticky',
                    content: clipboard_text.trim()
                });
            }

            var clipboard_image = clipboard.readImage();
            if(!clipboard_image.isEmpty()) {

                var original_size = clipboard_image.getSize();
                var target_image;
                if(original_size.height > 500 || original_size.width > 500) {
                    if(original_size.height > original_size.width) {
                        target_image = clipboard_image.resize({ height: 500 });
                    } else {
                        target_image = clipboard_image.resize({ width: 500 });
                    }
                } else {
                    target_image = clipboard_image;
                }

                var target_size = target_image.getSize();
                var data_url = target_image.toDataURL();

                console.log('Pasting ' + original_size.width + 'x' + original_size.height + ' image as '
                    + target_size.width + 'x' + target_size.height + '...');

                this.$store.dispatch(A_BOARD_ADD_ITEM, {
                    x: window.innerWidth / 2,
                    y: window.innerHeight / 2,
                    z: this.$store.getters.item_max_field('z') + 1,
                    type: 'picture',
                    content: data_url
                });
            }
        }
    },
    render: h => h(corkboard),
});