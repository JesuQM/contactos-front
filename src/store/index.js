import { createStore } from 'vuex'
import axios from 'axios';
const store= createStore({
  state(){
    return {
      contactos:[]
    }
  },
  mutations:{
    setContactos(state, contactos) {
       state.contactos = contactos;
    }
  },
  actions:{
    async fetchContactos({commit}){
      const response=await axios.get('http://localhost:8000/api/contactos/')
      commit('setContactos',response.data)
    } 
  },
  getters:{
    getContactoById: (state) => (id) => {
      return state.contactos.find(contacto => contacto.id === id);
    }
  }
  
})
export default store;
