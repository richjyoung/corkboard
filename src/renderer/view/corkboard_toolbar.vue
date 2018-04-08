<template>
    <div
        :style="{ zIndex: z }"
        class="toolbar">
        <icon-wrapper
            icon="sticky_note"
            @click="sticky_click" />
        <icon-wrapper
            icon="search_plus"
            @click="zoom_click($event, 'in')" />
        <icon-wrapper
            icon="search"
            @click="zoom_click($event, 'reset')" />
        <icon-wrapper
            icon="search_minus"
            @click="zoom_click($event, 'out')" />
        <icon-wrapper
            icon="expand"
            @click="fullscreen_click" />
        <icon-wrapper
            v-if="godmode"
            icon="wrench"
            @click="devtools_click" />
        <icon-wrapper
            v-if="godmode"
            icon="sync"
            @click="refresh_click" />
    </div>
</template>


<script>
import rem_to_px from '../utils/rem_to_px';
import icon_wrapper from './icon_wrapper.vue';
import {
    A_APP_ZOOM_IN,
    A_APP_ZOOM_OUT,
    A_APP_ZOOM_RESET,
    A_BOARD_ADD_ITEM
} from '../state/action_types';

import { RPC } from '../rpc_client';

export default {
    name: 'CorkboardToolbar',
    components: { 'icon-wrapper': icon_wrapper },
    computed: {
        z() {
            return this.$store.state.app.maxZ + 1;
        },
        godmode() {
            return this.$store.state.app.godmode;
        }
    },
    methods: {
        sticky_click(e) {
            e.preventDefault();
            e.stopPropagation();

            const obj = {
                board: this.$store.state.board.currentBoard,
                type: 'sticky',
                x: e.clientX - rem_to_px(15),
                y: e.clientY,
                z: this.$store.getters.item_max_field('z') + 1
            };

            this.$store.dispatch(A_BOARD_ADD_ITEM, obj);
        },
        refresh_click(e) {
            e.preventDefault();
            e.stopPropagation();
            location.reload();
        },
        zoom_click(e, mode) {
            e.preventDefault();
            e.stopPropagation();
            switch(mode) {
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
        fullscreen_click(e) {
            e.preventDefault();
            e.stopPropagation();
            RPC.toggle_fullscreen();
        },
        devtools_click(e) {
            e.preventDefault();
            e.stopPropagation();
            RPC.toggle_devtools();
        }
    }
};
</script>


<style scoped>

.toolbar-container {
    display: flex;
}

.pad {
    flex: 1 0 auto;
}

.toolbar {
    position: fixed;
    right: 8;
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
