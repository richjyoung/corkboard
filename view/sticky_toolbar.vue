<template>
<div class="toolbar" @mousedown="toolbar_mousedown">
    <icon-wrapper icon="trash" @mouseup="trash_click" />
    <icon-wrapper icon="arrows_alt_h" @mouseup="toggle_click($event, 'wide')" />
    <icon-wrapper icon="paint_brush" @mouseup="colour_click" />
    <icon-wrapper icon="clone" @mouseup="bring_to_front_click" />
    <icon-wrapper icon="bold" @mouseup="toggle_click($event, 'bold')" />
    <icon-wrapper icon="align_centre" @mouseup="toggle_click($event, 'centre')" />
</div>
</template>


<script>
import icon_wrapper from './icon_wrapper.vue';

import {
    A_STICKY_DELETE,
    A_STICKY_TOGGLE_FIELD,
    A_STICKY_CYCLE_COLOUR,
    A_STICKY_MOVE_STARTED,
    A_STICKY_MOVE_FINISHED,
    A_STICKY_MOVE,
    A_STICKY_PROMOTE
} from '../state/action_types';

export default {
    name: 'sticky_toolbar',
    props: ['item-id'],
    data: function() {
        return {
            moving: false
        };
    },
    computed: {
        sticky: function() {
            return this.$store.getters.sticky(this.itemId);
        }
    },
    methods: {
        trash_click: function() {
            if(!this.moving)
                this.$store.dispatch(A_STICKY_DELETE, this.itemId);
        },
        toggle_click: function(e, field) {
            if(!this.moving)
                this.$store.dispatch(A_STICKY_TOGGLE_FIELD, {
                    id: this.itemId,
                    field: field
                });
        },
        colour_click: function() {
            if(!this.moving)
                this.$store.dispatch(A_STICKY_CYCLE_COLOUR, this.itemId);
        },
        bring_to_front_click: function() {
            if(!this.moving)
                this.$store.dispatch(A_STICKY_PROMOTE, this.itemId);
        },
        toolbar_mousedown: function(e) {
            e = e || window.event;
            var self = this;

            var startX = e.clientX;
            var startY = e.clientY;


            document.onmouseup = function(e) {
                document.onmouseup = null;
                document.onmousemove = null;
                if(self.moving) {
                    e.preventDefault();
                    e.stopPropagation();
                    self.$store.dispatch(A_STICKY_MOVE_FINISHED, self.itemId);
                }
                self.moving = false;
            };

            document.onmousemove = function(e) {
                e = e || window.event;
                e.preventDefault();

                if(!self.moving) {
                    self.$store.dispatch(A_STICKY_MOVE_STARTED, self.itemId);
                }
                self.moving = true;

                self.$store.dispatch(A_STICKY_MOVE, {
                    id: self.itemId,
                    x: e.clientX - startX,
                    y: e.clientY - startY
                });

                startX = e.clientX;
                startY = e.clientY;
            };
        }
    },
    components: {
        'icon-wrapper': icon_wrapper
    }
};
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
    float: right;
}

svg {
    height: 1.2rem;
    padding: 0px;
    padding-top: 0.4rem;
    color:rgba(0, 0, 0, 0.2);
}

svg:hover {
    color: rgba(0, 0, 0, 0.3);    
}


</style>