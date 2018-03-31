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

    <div class="toolbar">
        <icon-wrapper icon="trash" />
    </div>
    <div class="spacer top"></div>
    <img :src="polaroid.url">
    <div class="spacer bottom"></div>
    <div class="caption">{{ polaroid.caption }}</div>
</div>
</template>


<script>
import icon_wrapper from './icon_wrapper.vue';

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
        'icon-wrapper': icon_wrapper
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
    margin: 0rem 1.5rem;
    width: 14rem;
    border: 1px solid #dddddd;
    border-top: 0px;
    border-bottom: 0px;
    flex: 0 0 auto;
}

.toolbar {
    width: 17rem;
    height: 1.5rem;
    text-align: right;
    font-size: 1rem;
}

.spacer {
    width: 14rem;
    background: #eeeeee;
    margin: 0rem 1.5rem;
    border: 1px solid #dddddd;
    flex: 1 0 1em;
    display: inline-block;
}

.spacer.top {
    border-bottom: 0px;
}

.spacer.bottom {
    border-top: 0px;
}

.caption {
    width: 100%;
    flex: 0 0 2.5rem;
    font-family: 'Nanum Pen Script';
    font-size: 2rem;
    text-align: center;
}

svg {
    height: 1rem;
    padding-top: 0.25rem;
    padding-right: 0.25rem;
    color:rgba(0, 0, 0, 0.2);
}
</style>