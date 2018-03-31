<template>
<div
    class="polaroid"
        :style="{
        top: polaroid.y,
        left: polaroid.x,
        zIndex: polaroid.z,
        transform: 'rotate(' + rot + 'deg)'
    }"
    >

    <polaroid-toolbar :itemId="this.itemId" />
    <div class="spacer top"></div>
    <img :src="polaroid.url">
    <div class="spacer bottom"></div>
    <polaroid-caption :itemId="this.itemId" />
</div>
</template>


<script>
import polaroid_toolbar from './polaroid_toolbar.vue';
import polaroid_caption from './polaroid_caption.vue';

export default {
    name: 'polaroid',
    props: ['item-id'],
    data: function() {
        return {
            rot: 0
        }
    },
    methods: {
    },
    computed: {
        polaroid: function() {
            return this.$store.getters.polaroid(this.itemId);
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
}
</script>


<style scoped>

.polaroid {
    box-shadow: 0.5rem 0.5rem 1.75rem rgba(33,33,33,.7);
    background: #ffffff;
    position: absolute;
    width: 17rem;
    height: 18rem;
    display: flex;
    flex-direction: column
}

img {
    background: #eeeeee;
    border-bottom: 0px;
    border-top: 0px;
    border: 1px solid #dddddd;
    flex: 0 0 auto;
    margin: 0rem 1.5rem;
    max-height: 14rem;
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