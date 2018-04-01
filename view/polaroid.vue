<template>
<div
    class="polaroid"
        :style="{
        top: polaroid.y,
        left: polaroid.x,
        zIndex: polaroid.z,
        transform: 'rotate(' + rot + 'deg)'
    }"
    @mousedown="mousedown"
    >

    <polaroid-toolbar :itemId="this.itemId" />
    <img :src="polaroid.url">
    <polaroid-caption :itemId="this.itemId" />
</div>
</template>


<script>
import polaroid_toolbar from './polaroid_toolbar.vue';
import polaroid_caption from './polaroid_caption.vue';
import { A_POLAROID_MOVE, A_POLAROID_MOVE_FINISHED } from '../state/action_types';

export default {
    name: 'polaroid',
    props: ['item-id'],
    data: function() {
        return {
            rot: 0
        };
    },
    computed: {
        polaroid: function() {
            return this.$store.getters.polaroid(this.itemId);
        }
    },
    methods: {
        mousedown: function(e) {
            e = e || window.event;
            var self = this;

            var startX = e.clientX;
            var startY = e.clientY;

            document.onmouseup = function() {
                document.onmouseup = null;
                document.onmousemove = null;
                self.$store.dispatch(A_POLAROID_MOVE_FINISHED, self.itemId);
            };

            document.onmousemove = function(e) {
                e = e || window.event;
                e.preventDefault();

                self.$store.dispatch(A_POLAROID_MOVE, {
                    itemId: self.itemId,
                    x: e.clientX - startX,
                    y: e.clientY - startY
                });

                startX = e.clientX;
                startY = e.clientY;
            };
        }
    },
    created: function() {
        var self = this;
        self.rot = Math.random() * 10 - 5;
    },
    components: {
        'polaroid-toolbar': polaroid_toolbar,
        'polaroid-caption': polaroid_caption
    }
};
</script>


<style scoped>

.polaroid {
    box-shadow: 0.5rem 0.5rem 1.75rem rgba(33,33,33,.7);
    background: #ffffff;
    position: absolute;
    width: 17rem;
    height: 18rem;
    display: flex;
    flex-direction: column;
}

img {
    background: #eeeeee;
    border: 1px solid #dddddd;
    flex: 0 0 auto;
    margin: 0rem 1.5rem;
    height: 14rem;
    max-width: 14rem;
    object-fit: contain;
}

.spacer {
    width: 14rem;
    background: #eeeeee;
    margin: 0rem 1.5rem;
    border: 1px solid #dddddd;
    flex: 1 0 0px;
    display: inline-block;
}

.spacer.top {
    border-bottom: 0px;
}

.spacer.bottom {
    border-top: 0px;
}

</style>