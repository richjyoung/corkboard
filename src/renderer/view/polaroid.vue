<template>
    <div class="polaroid">
        <polaroid-toolbar :index="index" />
        <img :src="polaroid.content">
        <polaroid-caption :index="index" />
    </div>
</template>


<script>
import polaroid_toolbar from './polaroid_toolbar.vue';
import polaroid_caption from './polaroid_caption.vue';

export default {
    name: 'Polaroid',
    components: {
        'polaroid-toolbar': polaroid_toolbar,
        'polaroid-caption': polaroid_caption
    },
    props: { 'index': Number },
    data: function() {
        return {
            rot: 0
        };
    },
    computed: {
        polaroid: function() {
            return this.$store.state.board.items[this.index];
        }
    },
    created: function() {
        var self = this;
        self.rot = Math.random() * 10 - 5;
    },
    methods: {
    },
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