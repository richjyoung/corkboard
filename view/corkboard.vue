<template>
    <div
        class="corkboard"
        tabindex="0"
        @mousedown="corkboard_mousedown">
        <corkboard-toolbar />
        <!-- <sticky
            v-for="(sticky, index) in stickies"
            :key="index"
            :item-id="+index" />
        <polaroid
            v-for="(polaroid, index) in polaroids"
            :key="index"
            :item-id="+index" /> -->

        <corkboard-item
            v-for="(item, index) in board_items"
            :key="index"
            :index="index" />
    </div>
</template>


<script>
import corkboard_toolbar from './corkboard_toolbar.vue';
import corkboard_item from './corkboard_item.vue';

export default {
    name: 'Corkboard',
    components: {
        'corkboard-toolbar': corkboard_toolbar,
        'corkboard-item': corkboard_item
    },
    computed: {
        board_items: function() {
            return this.$store.getters.board_items('default');
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
    outline: none;
}
</style>