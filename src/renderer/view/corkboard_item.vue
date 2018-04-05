<template>
    <div
        :style="{
            top: board_item.y,
            left: board_item.x,
            zIndex: board_item.z,
            transform: 'rotate(' + rot + 'deg)',
        }"
        class="corkboard_item"
        @dblclick="doubleclick"
        @mousedown="mousedown"
        @click="click">

        <sticky
            v-if="item_type === 'sticky'"
            ref="child"
            :index="index"
            @resize="resize" />

        <photo
            v-if="item_type === 'picture'"
            ref="child"
            :index="index"
            @resize="resize" />

    </div>
</template>


<script>
import sticky from './sticky.vue';
import photo from './photo.vue';

import {
    A_BOARD_MOVE_START,
    A_BOARD_MOVE,
    A_BOARD_MOVE_FINISH,
    A_BOARD_ITEM_SET_FIELD
} from '../state/action_types';

export default {
    name: 'CorkboardItem',
    components: {
        'sticky': sticky,
        'photo': photo
    },
    props: { 'index': Number },
    data: function() {
        return {
            rot: 0,
            moving: false
        };
    },
    computed: {
        board_item: function() {
            return this.$store.state.board.items[this.index];
        },
        item_type: function() {
            return this.board_item.type ? this.board_item.type : 'sticky';
        }
    },
    created: function() {
        this.rot = Math.random() * 10 - 5;
    },
    mounted: function() {
        this.resize();
    },
    methods: {
        doubleclick: function() {
            this.$store.dispatch(A_BOARD_ITEM_SET_FIELD, {
                index: this.index,
                field: 'z',
                value: this.$store.getters.item_max_field('z') + 1
            });
        },
        click: function() {
            this.$refs.child.focus();
        },
        resize: function() {
            this.$store.dispatch(A_BOARD_ITEM_SET_FIELD, {
                index: this.index,
                field: 'width',
                value: this.$el.clientWidth
            });
            this.$store.dispatch(A_BOARD_ITEM_SET_FIELD, {
                index: this.index,
                field: 'height',
                value: this.$el.clientHeight
            });
        },
        mousedown: function(e) {
            e = e || window.event;
            var self = this;

            var startX = e.clientX;
            var startY = e.clientY;

            document.onmouseup = function(e) {
                document.onmouseup = null;
                document.onmousemove = null;
                if(self.moving) {
                    e.preventDefault();
                    e.stopPropagation();
                    self.$store.dispatch(A_BOARD_MOVE_FINISH);
                }
                self.moving = false;
            };

            document.onmousemove = function(e) {
                e = e || window.event;
                e.preventDefault();

                if(!self.moving) {
                    self.$store.dispatch(A_BOARD_MOVE_START, self.index);
                }
                self.moving = true;

                self.$store.dispatch(A_BOARD_MOVE, {
                    x: e.clientX - startX,
                    y: e.clientY - startY
                });

                startX = e.clientX;
                startY = e.clientY;
            };
        }
    }
};
</script>


<style scoped>

.corkboard_item {
    position: absolute;
}

</style>