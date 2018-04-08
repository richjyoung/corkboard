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
    name: 'PolaroidToolbar',
    components: { 'icon-wrapper': icon_wrapper },
    props: { index: Number },
    data() {
        return {};
    },
    computed: {
        polaroid() {
            return this.$store.state.board.items[this.index];
        }
    },
    methods: {
        trash_click() {
            this.$store.dispatch(A_BOARD_ITEM_DELETE, this.index);
        }
    }
};
</script>


<style scoped>

.toolbar {
    width: 17rem;
    height: 1.5rem;
    text-align: right;
    font-size: 1rem;
}

.toolbar:hover svg {
    display: inline-block;
}

.toolbar svg {
    display: none;
    float: right;
}

svg {
    height: 1rem;
    padding-top: 0.25rem;
    padding-right: 0.25rem;
    color:rgba(0, 0, 0, 0.2);
}

svg:hover {
    color: rgba(0, 0, 0, 0.3);
}

</style>
