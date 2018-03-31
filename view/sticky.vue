<template>
<div
    class="sticky"
    :style="{ 
        top: sticky.y,
        left: sticky.x,
        zIndex: sticky.z,
        transform: 'rotate(' + rot + 'deg)',
        width: sticky.wide ? '25rem' : '15rem',
        background: colours[sticky.colour]
    }"
    @click="sticky_clicked"
    >

    <sticky-toolbar 
        :itemId="this.itemId"
        @toggle="toggle"
    />

    <div class="content">
        <textarea
            :value="sticky.content"
            @input="sticky_input"
            :style="{
                fontFamily: sticky.bold ? 'Permanent Marker' : 'Nanum Pen Script',
                textAlign: sticky.centre ? 'center' : 'left'
            }"
        />
    </div>
</div>
</template>


<script>
import sticky_toolbar from './sticky_toolbar.vue';
import {
    A_STICKY_PROMOTE,
    A_STICKY_EDIT_CONTENT
} from '../state/action_types';

export default {
    name: 'sticky',
    props: ['item-id'],
    data: function() {
        return {
            colours: ['#ffff88', '#88ff88', '#88ffff', '#ff88ff'],
            rot: 0
        }
    },
    methods: {
        sticky_clicked: function(e) {
            e.preventDefault();
            this.$store.dispatch(A_STICKY_PROMOTE, this.itemId);
        },
        sticky_input: function(e) {
            this.$store.dispatch(A_STICKY_EDIT_CONTENT, {
                id: this.itemId,
                value: e.target.value
            });
        },
        toggle: function(field) {
            console.log('field ' + field + ' toggled');
        }
    },
    computed: {
        sticky: function() {
            return this.$store.getters.sticky(this.itemId)
        }
    },
    created: function() {
        var self = this;
        self.rot = Math.random() * 10 - 5;
    },
    components: {
        'sticky-toolbar': sticky_toolbar
    }
}
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