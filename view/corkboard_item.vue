<template>
    <div
        :style="{
            top: board_item.y,
            left: board_item.x,
            zIndex: board_item.z,
            transform: 'rotate(' + rot + 'deg)',
        }"
        class="corkboard_item"
        @mousedown="mousedown">

        <sticky
            v-if="item_type === 'sticky'"
            :index="index" />

        <polaroid
            v-if="item_type === 'picture'"
            :index="index" />

    </div>
</template>


<script>
import sticky from './sticky.vue';
import polaroid from './polaroid.vue';

import {
    A_BOARD_MOVE_START,
    A_BOARD_MOVE,
    A_BOARD_MOVE_FINISH
} from '../state/action_types';

export default {
    name: 'CorkboardItem',
    components: {
        'sticky': sticky,
        'polaroid': polaroid
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
    methods: {
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