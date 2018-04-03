<template>
    <div
        :style="{
            width: sticky.wide ? '25rem' : '15rem',
            background: sticky.colour ? sticky.colour : '#ffff88'
        }"
        class="sticky">

        <sticky-toolbar :index="index" />

        <div class="content">
            <textarea
                ref="content"
                :value="sticky.content"
                :style="{
                    fontFamily: sticky.bold ? 'Sticky Bold' : 'Sticky Regular',
                    textAlign: sticky.centre ? 'center' : 'left'
                }"
                @keydown="sticky_keydown"
                @mousedown.stop
                @input="sticky_input" />
        </div>
    </div>
</template>


<script>
import sticky_toolbar from './sticky_toolbar.vue';
import {
    A_BOARD_ITEM_SET_FIELD
} from '../state/action_types';

export default {
    name: 'Sticky',
    components: {
        'sticky-toolbar': sticky_toolbar
    },
    props: { 'index': Number },
    data: function() {
        return {
            colours: ['#ffff88', '#88ff88', '#88ffff', '#ff88ff'],
            rot: 0
        };
    },
    computed: {
        sticky: function() {
            return this.$store.state.board.items[this.index];
        }
    },
    created: function() {
        var self = this;
        self.rot = Math.random() * 10 - 5;
    },
    mounted: function() {
        this.focus();
    },
    updated: function() {
        this.$emit('resize');
    },
    methods: {
        sticky_input: function(e) {
            this.$store.dispatch(A_BOARD_ITEM_SET_FIELD, {
                index: this.index,
                field: 'content',
                value: e.target.value
            });
        },
        sticky_keydown: function(e) {
            e.stopPropagation();
        },
        focus: function() {
            this.$refs.content.focus();
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
    font-family: 'Sticky Regular';
    font-size: 1.8rem;
    line-height: 2rem;
    outline: none;
    overflow: hidden;
    resize: none;
    width: 100%;
    vertical-align: middle;
}


</style>