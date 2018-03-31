<template>
<div class="corkboard">
    <corkboard-toolbar />
    <sticky v-for="(sticky, index) in stickies" :key=index :item-id="index" />
    <polaroid v-for="(polaroid, index) in polaroids" :key=index :item-id="index" />
</div>
</template>


<script>
import corkboard_toolbar from './corkboard_toolbar.vue';
import sticky from './sticky.vue';
import polaroid from './polaroid.vue';

export default {
    name: 'corkboard',
    components: {
        'corkboard-toolbar': corkboard_toolbar,
        'sticky': sticky,
        'polaroid': polaroid
    },
    computed: {
        stickies: function() {
            return this.$store.state.stickies.items;
        },
        polaroids: function() {
            return this.$store.state.polaroids.items;
        }
    },
    mounted: function() {
        // this.$store.commit('load_state');
    }
}
</script>


<style scoped>
.corkboard {
    width: 100%;
    height: 100%;
}
</style>