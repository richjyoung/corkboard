<template>
<div class="toolbar-container">
    <div class="pad"></div>
    <div class="toolbar" :style="{ zIndex: this.z }">
        <icon-wrapper v-if="this.godmode" icon="wrench" @click="devtools_click" />
        <icon-wrapper icon="search_plus" @click="zoom_click($event, 'in')" />
        <icon-wrapper icon="search" @click="zoom_click($event, 'reset')" />
        <icon-wrapper icon="search_minus" @click="zoom_click($event, 'out')" />
        <icon-wrapper icon="sticky_note" @click="sticky_click" />
        <icon-wrapper icon="expand" @click="fullscreen_click" />
        <icon-wrapper v-if="this.godmode" icon="sync" @click="refresh_click" />
    </div>
</div>
</template>


<script>
import rem_to_px from '../utils/rem_to_px';
import icon_wrapper from './icon_wrapper.vue';
import {
    A_STICKY_NEW,
    A_APP_ZOOM_RESET,
    A_APP_ZOOM_IN,
    A_APP_ZOOM_OUT
} from '../state/action_types';

var { ipcRenderer } = require('electron');

export default {
    name: 'corkboard_toolbar',
    computed: {
        z: function() {
            return this.$store.state.app.maxZ + 1;
        },
        godmode: function() {
            return this.$store.state.app.godmode;
        }
    },
    methods: {
        sticky_click: function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.$store.dispatch(A_STICKY_NEW, {
                x: e.clientX - rem_to_px(15),
                y: e.clientY
            });
        },
        refresh_click: function(e) {
            e.preventDefault();
            e.stopPropagation();
            location.reload();
        },
        zoom_click: function(e, mode) {
            e.preventDefault();
            e.stopPropagation();
            switch (mode) {
                case 'in':
                    this.$store.dispatch(A_APP_ZOOM_IN);
                    break;
                case 'out':
                    this.$store.dispatch(A_APP_ZOOM_OUT);
                    break;
                case 'reset':
                    this.$store.dispatch(A_APP_ZOOM_RESET);
                    break;
                default:
                    break;
            }
        },
        fullscreen_click: function(e) {
            e.preventDefault();
            e.stopPropagation();
            ipcRenderer.send('toggle_fullscreen');
        },
        devtools_click: function(e) {
            e.preventDefault();
            e.stopPropagation();
            ipcRenderer.send('toggle_devtools');
        }
    },
    components: {
        'icon-wrapper': icon_wrapper
    }
}
</script>


<style scoped>

.toolbar-container {
    display: flex;
}

.pad {
    flex: 1 0 auto;
}

.toolbar {
    flex: 0 0 auto;
    padding: 0rem 0.33rem;
    background: rgba(33, 33, 33, 0.25);
    text-align: right;
    font-size: 2rem;
    border-radius: 0.5rem;
    user-select: none;
}

svg {
    margin: 0.66rem 0.33rem;
    color: rgba(255, 255, 255, 0.5);
}

svg:hover {
    color: rgba(255, 255, 255, 0.75);
}


</style>