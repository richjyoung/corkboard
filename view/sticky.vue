<template>
    <div
        :style="{
            top: sticky.y,
            left: sticky.x,
            zIndex: sticky.z,
            transform: 'rotate(' + rot + 'deg)',
            width: sticky.wide ? '25rem' : '15rem',
            background: colours[sticky.colour]
        }"
        class="sticky">

        <sticky-toolbar
            :item-id="itemId"
            @toggle="toggle" />

        <div class="content">
            <textarea
                :value="sticky.content"
                :style="{
                    fontFamily: sticky.bold ? 'Permanent Marker' : 'Nanum Pen Script',
                    textAlign: sticky.centre ? 'center' : 'left'
                }"
                @keydown="sticky_keydown"
                @input="sticky_input" />
        </div>
    </div>
</template>


<script>
import sticky_toolbar from './sticky_toolbar.vue';
import {
    A_STICKY_EDIT_CONTENT
} from '../state/action_types';

export default {
    name: 'Sticky',
    components: {
        'sticky-toolbar': sticky_toolbar
    },
    props: { 'itemId': Number },
    data: function() {
        return {
            colours: ['#ffff88', '#88ff88', '#88ffff', '#ff88ff'],
            rot: 0
        };
    },
    computed: {
        sticky: function() {
            return this.$store.getters.sticky(this.itemId);
        }
    },
    created: function() {
        var self = this;
        self.rot = Math.random() * 10 - 5;
    },
    methods: {
        sticky_input: function(e) {
            this.$store.dispatch(A_STICKY_EDIT_CONTENT, {
                id: this.itemId,
                value: e.target.value
            });
        },
        sticky_keydown: function(e) {
            e.stopPropagation();
        },
        toggle: function(field) {
            console.log('field ' + field + ' toggled');
        }
    },
};
</script>


<style scoped>

.sticky {
    box-shadow: 0.5rem 0.5rem 1.75rem rgba(33,33,33,.7);
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    font-size:2rem;
    height: 15rem;
    line-height: 1;
    position: absolute;
    text-align:center;
}

.content {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    flex: 1 0 auto;
    padding: 0rem 1rem;
    background: linear-gradient(-45deg,rgba(255, 255, 255, 0.3), rgba(0, 0, 0, 0));
}

textarea {
    background-color: transparent;
    border: 0px solid;
    flex: 1 0 auto;
    font-family: 'Nanum Pen Script';
    font-size:2rem;
    line-height: 1;
    outline: none;
    overflow: hidden;
    resize: none;
    width: 100%;
}


</style>