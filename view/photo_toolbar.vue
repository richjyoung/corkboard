<template>
    <div class="toolbar">
        <icon-wrapper
            icon="trash"
            @mousedown.stop
            @click="trash_click" />
    </div>
</template>


<script>
import icon_wrapper from './icon_wrapper.vue';
import { A_BOARD_ITEM_DELETE } from '../state/action_types';

export default {
    name: 'PhotoToolbar',
    components: {
        'icon-wrapper': icon_wrapper
    },
    props: { 'index': Number },
    data: function() {
        return {};
    },
    computed: {
        polaroid: function() {
            return this.$store.state.board.items[this.index];
        }
    },
    methods: {
        trash_click: function() {
            this.$store.dispatch(A_BOARD_ITEM_DELETE, this.index);
        }
    }
};
</script>


<style scoped>

.toolbar {
    position: fixed;
    box-sizing: border-box;
    right: 0rem;
    padding: 0.4rem;
    user-select: none;
    height: 2rem;
}

.toolbar svg {
    color:rgba(0, 0, 0, 0);
    font-size: 1.2rem;
    line-height: 1.2rem;
}

.toolbar:hover svg {
    color: rgba(0, 0, 0, 0.4);
}

.toolbar svg:hover {
    color: rgba(0, 0, 0, 0.8);
}

</style>