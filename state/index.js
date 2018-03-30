import Vue from 'vue'
import Vuex from 'vuex'
import app from './app'
import board from './board'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    modules: {
        app,
        board
    },
    strict: true //debug
});