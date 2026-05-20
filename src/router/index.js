import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../features/auth/store/authStore'

import MainLayout from '../layouts/MainLayout.vue'
import HomeView from '../features/auth/views/LoginView.vue'
import AboutView from '../views/AboutView.vue'
import TicketsView from '../features/tickets/views/TicketsView.vue'
import TicketDetailView from '../features/tickets/views/TicketDetailView.vue'
import CreateTicketView from '../features/tickets/views/CreateTicketView.vue'
import AdminDashboardView from '../features/admin/views/AdminDashboardView.vue'
import AdminCategoriesView from '../features/admin/views/AdminCategoriesView.vue'
import AdminUsersView from '../features/admin/views/AdminUsersView.vue'
import AdminTicketsView from '../features/admin/views/AdminTicketsView.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: HomeView
  },
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: 'about', name: 'about', component: AboutView },
      

      //  VER TICKETS
      { 
        path: 'tickets', 
        name: 'tickets', 
        component: TicketsView, 
        meta: { requiresAuth: true } 
      },

      //  CREAR TICKET
      { 
        path: 'tickets/nuevo', 
        name: 'create-ticket', 
        component: CreateTicketView, 
        meta: { requiresAuth: true } 
      },

      // DETALLE
      { 
        path: 'tickets/:id', 
        name: 'ticket-detail', 
        component: TicketDetailView, 
        props: true, 
        meta: { requiresAuth: true } 
      },
      {
        path: 'admin',
        name: 'admin-dashboard',
        component: AdminDashboardView,
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      {
        path: 'admin/categorias',
        name: 'admin-categories',
        component: AdminCategoriesView,
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      {
        path: 'admin/usuarios',
        name: 'admin-users',
        component: AdminUsersView,
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      {
        path: 'admin/tickets',
        name: 'admin-tickets',
        component: AdminTicketsView,
        meta: { requiresAuth: true, requiresAdmin: true }
      },
    ],
  },

  // RUTA NO ENCONTRADA 
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

//  GUARDIA GLOBAL MEJORADA
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  //  Protección básica
  if (to.meta.requiresAuth && !auth.token) {
    alert('Debes iniciar sesión para ver esta sección')
    return next('/')
  }

  if (to.meta.requiresAdmin && !auth.isAdmin) {
    alert('No tienes permisos para acceder a esta seccion')
    return next('/tickets')
  }

  //  VALIDAR ID EN DETALLE
  if (to.name === 'ticket-detail') {
    const id = parseInt(to.params.id)

    if (isNaN(id)) {
      return next('/tickets')
    }
  }

  next()
})

export default router
