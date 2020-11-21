import NotFound from "./pages/NotFound.vue";
import Home from "./pages/Home.vue";

export default [
    {
        path: '/',
        component: Home
    },
    {
        path: '*',
        component: NotFound
    }
]
