<template>
    <div
        :class="{
            small: sticky.size && sticky.size == 2
        }"
        class="toolbar">

        <icon-wrapper
            icon="clone"
            @mousedown.stop
            @click="clone_click" />
        <icon-wrapper
            icon="align_centre"
            @mousedown.stop
            @click="toggle_click($event, 'centre')" />
        <icon-wrapper
            icon="bold"
            @mousedown.stop
            @click="toggle_click($event, 'bold')" />
        <icon-wrapper
            v-if="sticky.size != 2"
            icon="text_height"
            @mousedown.stop
            @click="toggle_click($event, 'dense')" />
        <icon-wrapper
            icon="paint_brush"
            @mousedown.stop
            @click="colour_click" />
        <icon-wrapper
            icon="arrows_alt_h"
            @mousedown.stop
            @click="size_click" />
        <icon-wrapper
            icon="trash"
            @mousedown.stop
            @click="trash_click" />
    </div>
</template>


<script>
import icon_wrapper from './icon_wrapper.vue';

import {
    A_BOARD_ITEM_SET_FIELD,
    A_BOARD_ITEM_DELETE,
    A_BOARD_ADD_ITEM
} from '../state/action_types';

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
        clone_click: function() {
            this.$store.dispatch(A_BOARD_ADD_ITEM, {
                type: 'sticky',
                x: this.sticky.x,
                y: this.sticky.y + this.sticky.height,
                z: this.$store.getters.item_max_field('z') + 1,
                content: this.sticky.content,
                bold: this.sticky.bold,
                centre: this.sticky.centre,
                colour: this.sticky.colour,
                size: this.sticky.size,
                dense: this.sticky.dense
            });
        },
        toggle_click: function(e, field) {
            var current = this.sticky[field] || false;
            this.$store.dispatch(A_BOARD_ITEM_SET_FIELD, {
                index: this.index,
                field: field,
                value: !current
            });
        },
        size_click: function() {
            var current = +this.sticky.size || 0;
            this.$store.dispatch(A_BOARD_ITEM_SET_FIELD, {
                index: this.index,
                field: 'size',
                value: (current + 1) % 3
            });
        },
        colour_click: function() {
            var current = +this.sticky.colour || 0;
            this.$store.dispatch(A_BOARD_ITEM_SET_FIELD, {
                index: this.index,
                field: 'colour',
                value: (current + 1) % 4
            });
        }
    }
};
</script>


<style scoped>

/* Regular Sticky */
.toolbar {
    position: fixed;
    box-sizing: border-box;
    right: 0rem;
    padding: 0.4rem;
    user-select: none;
    height: 2rem;
}
.toolbar svg {
    color:rgba(0, 0, 0, 0);
    font-size: 1.2rem;
    line-height: 1.2rem;
}
.toolbar:hover svg {
    color: rgba(0, 0, 0, 0.4);
}
.toolbar svg:hover {
    color: rgba(0, 0, 0, 0.8);
}


/* Small Sticky */
.toolbar.small {
    top: -2rem;
}
.toolbar.small:hover{
    background: rgba(0, 0, 0, 0.2);
}
.toolbar.small:hover svg {
    color: rgba(255, 255, 255, 0.5);
}

.toolbar.small svg:hover {
    color: rgba(255, 255, 255, 0.8);
}
</style>