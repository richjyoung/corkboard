<template>
    <div class="toolbar">
        <icon-wrapper
            icon="trash"
            @mousedown.stop
            @click="trash_click" />
        <icon-wrapper
            icon="arrows_alt_h"
            @mousedown.stop
            @click="toggle_click($event, 'wide')" />
        <icon-wrapper
            icon="paint_brush"
            @mousedown.stop
            @click="colour_click" />
        <icon-wrapper
            icon="bold"
            @mousedown.stop
            @click="toggle_click($event, 'bold')" />
        <icon-wrapper
            icon="align_centre"
            @mousedown.stop
            @click="toggle_click($event, 'centre')" />
    </div>
</template>


<script>
import icon_wrapper from './icon_wrapper.vue';

import {
    A_BOARD_ITEM_SET_FIELD,
    A_BOARD_ITEM_DELETE
} from '../state/action_types';

var colours = ['#ffff88', '#88ff88', '#88ffff', '#ff88ff'];

export default {
    name: 'StickyToolbar',
    components: {
        'icon-wrapper': icon_wrapper
    },
    props: { 'index': Number },
    data: function() {
        return {
        };
    },
    computed: {
        sticky: function() {
            return this.$store.state.board.items[this.index];
        }
    },
    methods: {
        trash_click: function() {
            this.$store.dispatch(A_BOARD_ITEM_DELETE, this.index);
        },
        toggle_click: function(e, field) {
            var current = this.sticky[field] || false;
            this.$store.dispatch(A_BOARD_ITEM_SET_FIELD, {
                index: this.index,
                field: field,
                value: !current
            });
            if(field === 'wide') {
                this.$emit('resize');
            }
        },
        colour_click: function() {
            var current = this.sticky.colour || colours[0];
            this.$store.dispatch(A_BOARD_ITEM_SET_FIELD, {
                index: this.index,
                field: 'colour',
                value: colours[(colours.indexOf(current) + 1) % colours.length]
            });
        }
    }
};
</script>


<style scoped>

.toolbar {
    flex: 0 0 2rem;
    width: 100%;
    /* background: #efef78; */
    background: rgba(0, 0, 0, 0.1);
    text-align: right;
    user-select: none;
}

.toolbar:hover svg {
    display: inline-block;
}

.toolbar svg {
    display: none;
    float: right;
}

svg {
    height: 1.2rem;
    padding: 0px;
    padding-top: 0.4rem;
    margin-left: -0.4rem;
    color:rgba(0, 0, 0, 0.2);
}

svg:hover {
    color: rgba(0, 0, 0, 0.3);
}


</style>