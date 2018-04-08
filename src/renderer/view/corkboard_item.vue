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
    A_BOARD_ITEM_SET_FIELD,
    A_BOARD_MOVE,
    A_BOARD_MOVE_FINISH,
    A_BOARD_MOVE_START
} from '../state/action_types';

export default {
    name: 'CorkboardItem',
    components: {
        sticky,
        photo
    },
    props: { index: Number },
    data() {
        return {
            rot: 0,
            moving: false
        };
    },
    computed: {
        board_item() {
            return this.$store.state.board.items[this.index];
        },
        item_type() {
            return this.board_item.type ? this.board_item.type : 'sticky';
        }
    },
    created() {
        this.rot = Math.random() * 10 - 5;
    },
    mounted() {
        this.resize();
    },
    methods: {
        doubleclick() {
            this.$store.dispatch(A_BOARD_ITEM_SET_FIELD, {
                index: this.index,
                field: 'z',
                value: this.$store.getters.item_max_field('z') + 1
            });
        },
        click() {
            this.$refs.child.focus();
        },
        resize() {
            this.$store.dispatch(A_BOARD_ITEM_SET_FIELD, {
                index: this.index,
                field: 'settings.width',
                value: this.$el.clientWidth
            });
            this.$store.dispatch(A_BOARD_ITEM_SET_FIELD, {
                index: this.index,
                field: 'settings.height',
                value: this.$el.clientHeight
            });
        },
        mousedown(e) {
            e = e || window.event;
            const self = this;

            let startX = e.clientX;
            let startY = e.clientY;

            document.onmouseup = function(e) {
                document.onmouseup = null;
                document.onmousemove = null;
                if(self.moving) {
                    e.preventDefault();
                    e.stopPropagation();
                    self.$store.dispatch(A_BOARD_MOVE_FINISH, self.index);
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
