import Vue from 'vue';
import Vuex from 'vuex';
import app from './app';
import board from './board';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        app,
        board
    },
    strict: true
});