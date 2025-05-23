import { createRouter, createWebHistory } from 'vue-router';
import ContactosList from '../views/ContactoList.vue';
import ContactoForm from '../views/ContactoForm.vue';

const routes = [
  { path: '/', component: ContactosList },
  { path: '/nuevo', component:ContactoForm },
  { path: '/editar/:id', component: ContactoForm }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
