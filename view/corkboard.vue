<template>
<div class="corkboard">
    <corkboard-toolbar />
    <sticky v-for="(sticky, index) in stickies" :key=index :item-id="index" />
</div>
</template>


<script>
import corkboard_toolbar from './corkboard_toolbar.vue';
import sticky from './sticky.vue';
export default {
    name: 'corkboard',
    components: {
        'corkboard-toolbar': corkboard_toolbar,
        'sticky': sticky
    },
    computed: {
        stickies: function() {
            return this.$store.state.board.stickies
        }
    },
    methods: {
        corkboard_clicked: function(e) {
            if(e.target == this.$el) {
                this.$store.commit('new_sticky', {
                    x: e.clientX,
                    y: e.clientY
                });
            }
        }
    }
}
</script>


<style scoped>
.corkboard {
    width: 100%;
    height: 100%;
}
</style>