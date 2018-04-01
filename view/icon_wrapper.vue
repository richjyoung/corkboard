<template>
<font-awesome-icon :icon="get_icon" @click="$emit('click', $event)" @mouseup="$emit('mouseup', $event)"/>
</template>


<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import faTrash from '@fortawesome/fontawesome-free-solid/faTrash';
import faBold from '@fortawesome/fontawesome-free-solid/faBold';
import faArrowsAltH from '@fortawesome/fontawesome-free-solid/faArrowsAltH';
import faAlignCenter from '@fortawesome/fontawesome-free-solid/faAlignCenter';
import faPaintBrush from '@fortawesome/fontawesome-free-solid/faPaintBrush';
import faStickyNote from '@fortawesome/fontawesome-free-solid/faStickyNote';
import faExpand from '@fortawesome/fontawesome-free-solid/faExpand';
import faSync from '@fortawesome/fontawesome-free-solid/faSync';
import faWrench from '@fortawesome/fontawesome-free-solid/faWrench';
import faSearch from '@fortawesome/fontawesome-free-solid/faSearch';
import faSearchPlus from '@fortawesome/fontawesome-free-solid/faSearchPlus';
import faSearchMinus from '@fortawesome/fontawesome-free-solid/faSearchMinus';
import faClone from '@fortawesome/fontawesome-free-solid/faClone';

var icon_map = {
    trash: faTrash,
    bold: faBold,
    arrows_alt_h: faArrowsAltH,
    align_centre: faAlignCenter,
    paint_brush: faPaintBrush,
    sticky_note: faStickyNote,
    expand: faExpand,
    sync: faSync,
    wrench: faWrench,
    search_plus: faSearchPlus,
    search_minus: faSearchMinus,
    search: faSearch,
    clone: faClone
};

export default {
    name: 'icon_wrapper',
    props: ['icon'],
    computed: {
        get_icon: function() {
            return icon_map[this.icon];
        }
    },
    components: {
        FontAwesomeIcon
    }
};
</script>


<style scoped>

</style>