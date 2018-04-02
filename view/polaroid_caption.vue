<template>
    <input
        :value="polaroid.title"
        @input="caption_input"
        @mousedown.stop>
</template>


<script>
import { A_BOARD_ITEM_SET_FIELD } from '../state/action_types';

export default {
    name: 'PolaroidCaption',
    props: { 'index': Number },
    data: function() {
        return {
            rot: 0
        };
    },
    computed: {
        polaroid: function() {
            return this.$store.state.board.items[this.index];
        }
    },
    methods: {
        caption_input: function(e) {
            this.$store.dispatch(A_BOARD_ITEM_SET_FIELD, {
                index: this.index,
                field: 'title',
                value: e.target.value
            });
        }
    },
};
</script>


<style scoped>

input {
    border: 0px;
    flex: 0 0 2.5rem;
    font-family: 'Nanum Pen Script';
    font-size: 2rem;
    line-height: 1;
    outline: none;
    overflow: hidden;
    text-align: center;
    width: 100%;
    background: transparent;
}

</style>