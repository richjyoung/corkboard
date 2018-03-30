<template>
<div class="toolbar" @mousedown="toolbar_mousedown">
    <icon-wrapper icon="paint_brush" @click="colour_click" />
    <icon-wrapper icon="align_centre" @click="centre_click" />
    <icon-wrapper icon="arrows_alt_h" @click="wide_click" />
    <icon-wrapper icon="bold" @click="bold_click" />
    <icon-wrapper icon="trash" @click="trash_click" />
</div>
</template>


<script>
import icon_wrapper from './icon_wrapper.vue';

export default {
    name: 'sticky_toolbar',
    props: ['item-id'],
    computed: {
        sticky: function() {
            return this.$store.getters.sticky(this.itemId)
        }
    },
    methods: {
        trash_click: function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.$store.commit('delete_sticky', this.itemId);
        },
        bold_click: function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.$store.commit('toggle_bold_sticky', this.itemId);
        },
        colour_click: function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.$store.commit('toggle_colour_sticky', this.itemId);
        },
        wide_click: function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.$store.commit('toggle_wide_sticky', this.itemId);
        },
        centre_click: function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.$store.commit('toggle_centre_sticky', this.itemId);
        },
        toolbar_mousedown: function(e) {
            e = e || window.event;
            var self = this;

            if(e.target == self.$el) {
                e.preventDefault();

                var startX = e.clientX;
                var startY = e.clientY;

                document.onmouseup = function() {
                    document.onmouseup = null;
                    document.onmousemove = null;
                    self.$store.dispatch('move_sticky_finished');
                }

                document.onmousemove = function(e) {
                    e = e || window.event;
                    e.preventDefault();

                    self.$store.commit('move_sticky', {
                        itemId: self.itemId,
                        x: e.clientX - startX,
                        y: e.clientY - startY
                    });

                    startX = e.clientX;
                    startY = e.clientY;
                }

                self.$store.commit('promote_sticky', self.itemId);
            }
        }
    },
    components: {
        'icon-wrapper': icon_wrapper
    }
}
</script>


<style scoped>

.toolbar {
    flex: 0 0 2rem;
    width: 100%;
    /* background: #efef78; */
    background: rgba(0, 0, 0, 0.1);
    text-align: right;
    user-select: none;
}

.toolbar:hover svg {
    display: inline-block;    
}

.toolbar svg {
    display: none;
}

svg {
    height: 1.2rem;
    padding: 0px;
    padding-bottom: 0.4rem;
    color:rgba(0, 0, 0, 0.2);
}

svg:hover {
    color: rgba(0, 0, 0, 0.3);    
}


</style>