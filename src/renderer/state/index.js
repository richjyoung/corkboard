import app from './app';
import board from './board';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        app,
        board
    },
    strict: true
});
