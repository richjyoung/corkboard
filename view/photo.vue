<template>
    <div class="photo">
        <div class="pin" />

        <!-- <polaroid-toolbar :index="index" /> -->
        <img
            :src="polaroid.content"
            @load="$emit('resize', $event)">
    </div>
</template>


<script>
import polaroid_toolbar from './polaroid_toolbar.vue';
import polaroid_caption from './polaroid_caption.vue';

export default {
    name: 'Photo',
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
};
</script>


<style scoped>

.photo {
    box-shadow: 0.5rem 0.5rem 1.75rem rgba(33,33,33,.7);
}

.photo:before {
    display: block;
    position: absolute;
    background-image: linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0), rgba(255, 255, 255, 0.4));
    width: 100%;
    height: 100%;
    content: '';
}

.pin {
    background-color: #888;
    background-image: linear-gradient(90deg,rgba(255, 255, 255, 0.8), rgba(0, 0, 0, 0.6));
    border-bottom-left-radius: 0.2rem;
    border-bottom-right-radius: 0.2rem;
    display: block;
    height: 2rem;
    left: 50%;
    top: -1rem;
    position: fixed;
    transform-origin: bottom;
    transform: rotate(45deg);
    width: 0.4rem;
}
.pin:after {
    background-color: red;
    background-image: radial-gradient(at top left, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8));
    border-radius: 50%;
    content: '';
    display: block;
    height: 1.5rem;
    left: -0.55rem;
    position: absolute;
    top: -0.75rem;
    width: 1.5rem;
    z-index: -1;
}
.pin:before {
    background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0));
    border-bottom-left-radius: 0.2rem;
    border-bottom-right-radius: 0.2rem;
    content: '';
    display: block;
    height: 2rem;
    left: 0;
    position: absolute;
    transform-origin: 0.3rem 2.1rem;
    transform: rotate(90deg);
    width: .2rem;
    z-index: -2;
}

</style>