import Vue from "vue";
import App from './components/App.vue';
import VueRouter from 'vue-router';
import routes from './routes.js';
import axios from "axios";
import "./style/style.sass"

Vue.use(VueRouter);
Vue.prototype.$http = axios;

Vue.prototype.$http.interceptors.response.use(null, function(error) {
    console.error(error);
    return Promise.reject(error);
});

const router = new VueRouter({
    base: __dirname,
    routes: routes
});

document.addEventListener("DOMContentLoaded", function () {
    new Vue({
        router,
        render: h => h(App)
    }).$mount('#app');
});
