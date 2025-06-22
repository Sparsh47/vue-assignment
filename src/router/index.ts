import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Home from '../pages/Home.vue'
import Favourites from '../pages/Favourites.vue'
import ShowDetails from '../pages/ShowDetails.vue'

export const routes: RouteRecordRaw[] = [
    { path: '/',           name: 'home',       component: Home },
    { path: '/favourites',  name: 'favourites', component: Favourites },
    { path: '/shows/:id',   name: 'show',       component: ShowDetails, props: true }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router
