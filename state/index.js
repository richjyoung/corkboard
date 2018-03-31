import Vue from 'vue';
import Vuex from 'vuex';
import app from './app';
import stickies from './stickies';
import polaroids from './polaroids';

Vue.use(Vuex);

const debug = process.env.NODE_ENV == 'development';

export default new Vuex.Store({
    modules: {
        app,
        stickies,
        polaroids
    },
    strict: true //debug
});