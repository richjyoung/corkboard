<template>
    <div
        class="corkboard"
        tabindex="0"
        @mousedown="corkboard_mousedown">
        <corkboard-toolbar />
        <sticky
            v-for="(sticky, index) in stickies"
            :key="index"
            :item-id="+index" />
        <polaroid
            v-for="(polaroid, index) in polaroids"
            :key="index"
            :item-id="+index" />
    </div>
</template>


<script>
import corkboard_toolbar from './corkboard_toolbar.vue';
import sticky from './sticky.vue';
import polaroid from './polaroid.vue';

export default {
    name: 'Corkboard',
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
    methods: {
        corkboard_mousedown: function (e) {
            e = e || window.event;
            if(e.target == this.$el) {

                var startX = e.clientX;
                var startY = e.clientY;

                document.onmouseup = function() {
                    document.onmouseup = null;
                    document.onmousemove = null;
                };

                document.onmousemove = function(e) {
                    e = e || window.event;
                    e.preventDefault();

                    var x = e.clientX - startX;
                    var y = e.clientY - startY;

                    startX = e.clientX;
                    startY = e.clientY;

                    window.scrollTo(document.body.scrollLeft - x, document.body.scrollTop - y);
                };
            }
        }
    },
};
</script>


<style scoped>
.corkboard {
    width: 100%;
    height: 100%;
}
</style>