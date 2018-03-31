<template>
    <input :value="polaroid.caption" @input="caption_input">
</template>


<script>

export default {
    name: 'polaroid_caption',
    props: ['item-id'],
    data: function() {
        return {
            rot: 0
        }
    },
    methods: {
        caption_input: function(e) {
            this.$store.dispatch('polaroid_edit_caption', {
                itemId: this.itemId,
                value: e.target.value
            });
        }
    },
    computed: {
        polaroid: function() {
            return this.$store.getters.polaroid(this.itemId);
        }
    }
}
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
}

</style>