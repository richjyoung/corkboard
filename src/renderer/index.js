import {
    A_APP_TOGGLE_GODMODE,
    A_BOARD_ADD_ITEM,
    A_LOAD_ALL
} from './state/action_types';
import {
    PHOTO_MAX_DIMENSION,
    STICKY_REGULAR_WIDTH
} from './constants';
import { clipboard } from 'electron';
import corkboard from './corkboard.vue';
import remToPx from './utils/rem_to_px';
import { setlevel } from './logwrap';
import store from './state';
import Vue from 'vue';

setlevel('debug');

window.vm = new Vue({
    /* eslint-disable sort-keys */
    el: '#corkboard',
    store,
    created() {
        document.onkeydown = this.keydown;
    },
    mounted() {
        this.$store.dispatch(A_LOAD_ALL);
    },
    methods: {
        keydown(e) {
            if(e.key === 'v' && e.ctrlKey) {
                this.paste();
            } else if(e.key === 'n' && e.ctrlKey) {
                this.newSticky();
            } else if(e.key === 'r' && e.ctrlKey) {
                location.reload();
            } else if(e.key === 's' && e.ctrlKey) {
                this.$store.dispatch('save_state');
            } else if(e.code === 'KeyA' && e.ctrlKey && e.altKey
                && e.shiftKey) {

                this.$store.dispatch(A_APP_TOGGLE_GODMODE);
            }
        },
        newSticky() {
            this.$store.dispatch(A_BOARD_ADD_ITEM, {
                x: (window.innerWidth - remToPx(STICKY_REGULAR_WIDTH)) / 2,
                y: (window.innerHeight - remToPx(STICKY_REGULAR_WIDTH)) / 2,
                z: this.$store.getters.item_max_field('z') + 1,
                type: 'sticky'
            });
        },
        paste() {
            const clipboardText = clipboard.readText();
            if(clipboardText) {
                this.$store.dispatch(A_BOARD_ADD_ITEM, {
                    x: (window.innerWidth - remToPx(STICKY_REGULAR_WIDTH)) / 2,
                    y: (window.innerHeight - remToPx(STICKY_REGULAR_WIDTH)) / 2,
                    z: this.$store.getters.item_max_field('z') + 1,
                    type: 'sticky',
                    content: clipboardText.trim()
                });
            }

            const clipboardImage = clipboard.readImage();
            if(!clipboardImage.isEmpty()) {
                const originalSize = clipboardImage.getSize();
                let targetImage = null;
                if(originalSize.height > PHOTO_MAX_DIMENSION
                    || originalSize.width > PHOTO_MAX_DIMENSION) {

                    if(originalSize.height > originalSize.width) {
                        targetImage = clipboardImage.resize({
                            height: PHOTO_MAX_DIMENSION
                        });
                    } else {
                        targetImage = clipboardImage.resize({
                            width: PHOTO_MAX_DIMENSION
                        });
                    }
                } else {
                    targetImage = clipboardImage;
                }

                const dataUrl = targetImage.toDataURL();

                this.$store.dispatch(A_BOARD_ADD_ITEM, {
                    x: window.innerWidth / 2,
                    y: window.innerHeight / 2,
                    z: this.$store.getters.item_max_field('z') + 1,
                    type: 'picture',
                    content: dataUrl
                });
            }
        }
    },
    render: (h) => { return h(corkboard); }
    /* eslint-disable sort-keys */
});

