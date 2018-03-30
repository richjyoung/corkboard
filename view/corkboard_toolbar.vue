<template>
<div class="toolbar-container">
    <div class="pad"></div>
    <div class="toolbar" :style="{ zIndex: this.z }">
        <icon-wrapper icon="sticky_note" @click="sticky_click" />
        <icon-wrapper icon="expand" @click="fullscreen_click" />
        <icon-wrapper icon="sync" @click="refresh_click" />
    </div>
</div>
</template>


<script>
import rem_to_px from '../utils/rem_to_px';
import icon_wrapper from './icon_wrapper.vue';

var { ipcRenderer } = require('electron');

export default {
    name: 'corkboard_toolbar',
    computed: {
        z: function() {
            return this.$store.state.board.maxZ + 1;
        }
    },
    methods: {
        sticky_click: function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.$store.commit('new_sticky', {
                x: e.clientX - rem_to_px(15),
                y: e.clientY
            });
        },
        refresh_click: function(e) {
            e.preventDefault();
            e.stopPropagation();
            location.reload();
        },
        fullscreen_click: function(e) {
            e.preventDefault();
            e.stopPropagation();
            ipcRenderer.send('toggle_fullscreen');
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
}

svg {
    margin: 0.66rem 0.33rem;
    color: rgba(255, 255, 255, 0.5);
}

svg:hover {
    color: rgba(255, 255, 255, 0.75);
}


</style>