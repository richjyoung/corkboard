<template>
<div class="toolbar" @mousedown="toolbar_mousedown">
    <icon-wrapper icon="trash" />
</div>
</template>


<script>
import icon_wrapper from './icon_wrapper.vue';

export default {
    name: 'polaroid_toolbar',
    props: ['item-id'],
    data: function() {
        return {};
    },
    methods: {
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
                    self.$store.dispatch('polaroid_move_finished', self.itemId);
                }

                document.onmousemove = function(e) {
                    e = e || window.event;
                    e.preventDefault();

                    self.$store.dispatch('polaroid_move', {
                        itemId: self.itemId,
                        x: e.clientX - startX,
                        y: e.clientY - startY
                    });

                    startX = e.clientX;
                    startY = e.clientY;
                }

                self.$store.dispatch('polaroid_promote', self.itemId);
            }
        }
    },
    computed: {
        polaroid: function() {
            return this.$store.getters.polaroid(this.itemId);
        }
    },
    components: {
        'icon-wrapper': icon_wrapper
    }
}
</script>


<style scoped>

.toolbar {
    width: 17rem;
    height: 1.5rem;
    text-align: right;
    font-size: 1rem;
}

svg {
    height: 1rem;
    padding-top: 0.25rem;
    padding-right: 0.25rem;
    color:rgba(0, 0, 0, 0.2);
}

</style>