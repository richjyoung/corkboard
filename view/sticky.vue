<template>
    <div
        :class="{
            green: sticky.colour && sticky.colour == 1,
            blue: sticky.colour && sticky.colour == 2,
            pink: sticky.colour && sticky.colour == 3,
            small: sticky.size && sticky.size == 2,
            large: sticky.size && sticky.size == 1,
            bold: sticky.bold,
            centre: sticky.centre,
            dense: sticky.dense
        }"
        class="sticky">

        <sticky-toolbar :index="index" />

        <div class="header" />

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

/* Regular Sticky */
.sticky {
    background: #ffff88;
    box-shadow: 0.5rem 0.5rem 1.75rem rgba(33,33,33,.7);
    width: 15rem;
}
.header {
    width: 100%;
    height: 2rem;
    background: rgba(0, 0, 0, 0.1);
}
.content {
    padding: 0rem 0.8rem;
    background: linear-gradient(-45deg,rgba(255, 255, 255, 0.3), rgba(0, 0, 0, 0));
}
textarea {
    background-color: transparent;
    border: 0px solid;
    flex: 1 0 auto;
    font-family: 'Sticky Regular';
    font-size: 1.6rem;
    line-height: 2.15rem;
    height: 13rem;
    outline: none;
    overflow: hidden;
    padding: 0px;
    resize: none;
    text-align: left;
    width: 100%;
    vertical-align: middle;
}

/* Dense Sticky */
.sticky.dense textarea {
    font-size: 1.5rem;
    line-height: 1.6rem;
}

/* Large Sticky */
.sticky.large {
    width: 25rem;
}


/* Small Sticky */
.sticky.small {
    width: 15rem;
}
.sticky.small .header {
    position: fixed;
    height: 100%;
    width: 4rem;
}
.sticky.small textarea {
    height: 3rem;
    line-height: 3rem;
}
.sticky.small.dense textarea {
    font-size: 1.6rem;
    line-height: 3rem;
}


/* Bold Sticky */
.sticky.bold textarea {
    font-family: 'Sticky Bold';
}


/* Centred Sticky */
.sticky.centre textarea {
    text-align: center;
}


/* Green Sticky */
.sticky.green {
    background: #88ff88;
}


/* Blue Sticky */
.sticky.blue {
    background: #88ffff;
}


/* Pink Sticky */
.sticky.pink {
    background: #ff88ff;
}

</style>