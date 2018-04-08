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
import corkboard_toolbar from './view/corkboard_toolbar.vue';
import corkboard_item from './view/corkboard_item.vue';

export default {
    name: 'Corkboard',
    components: {
        'corkboard-toolbar': corkboard_toolbar,
        'corkboard-item': corkboard_item
    },
    computed: {
        board_items() {
            return this.$store.getters.board_items('default');
        }
    },
    methods: {
        corkboard_mousedown(e) {
            e = e || window.event;
            if(e.target == this.$el) {
                let startX = e.clientX;
                let startY = e.clientY;

                document.onmouseup = function() {
                    document.onmouseup = null;
                    document.onmousemove = null;
                };

                document.onmousemove = function(e) {
                    e = e || window.event;
                    e.preventDefault();

                    const x = e.clientX - startX;
                    const y = e.clientY - startY;

                    startX = e.clientX;
                    startY = e.clientY;

                    window.scrollTo(document.body.scrollLeft - x, document.body.scrollTop - y);
                };
            }
        }
    }
};
</script>


<style>
@font-face {
    font-family: 'Sticky Regular';
    src: url('res/fonts/AnnieUseYourTelescope-Regular.ttf');
    font-weight: bold;
}
@font-face {
    font-family: 'Sticky Bold';
    src: url('res/fonts/PermanentMarker-Regular.ttf');
}

body {
    background: #795a2c;
    background-image: url('res/img/corkboard.jpg');
    background-size: 10rem 10rem;
    overflow: hidden;
}

.corkboard {
    width: 100%;
    height: 100%;
    outline: none;
}
</style>
