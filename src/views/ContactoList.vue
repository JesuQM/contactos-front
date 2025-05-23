<template>
    <div class="container mt-4">
    <h2 class="text-center mb-4">Lista de Contactos</h2>
    <div class="row">
      <div class="col-md-4" v-for="contacto in contactos" :key="contactos.id">
        <div class="card shadow-sm">
          <div class="card-body text-center">
         <img v-if="contacto.fotografia" :src="contacto.fotografia" alt="Fotografia" class="card-img-top img mb-2" />

            <h5 class="card-title">{{ contacto.nombre }} {{ contacto.apellido }}</h5>
            <p class="card-text"><strong>Celular:</strong> {{ contacto.telefono }}</p>
            <div class="d-flex justify-content-center gap-2">
        <button class="btn btn-primary btn-sm" @click="editarContacto(contacto.id)">
          <i class="bi bi-pencil"></i> Editar
        </button>

              <button class="btn btn-danger btn-sm" @click="eliminarContacto(contacto.id)">
                <i class="bi bi-trash"></i> Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="text-center mt-4">
      <button class="btn btn-success" @click="$router.push('/nuevo')">Agregar Contacto</button>
    </div>
  </div>

</template>
<style>
.img {
    padding: .25rem;
    background-color: var(--bs-body-bg);
    border: var(--bs-border-width) solid var(--bs-border-color);
    border-radius: var(--bs-border-radius);
    max-width: 150px;
    height: auto;

}
</style>

<script>
import {mapState,mapActions} from 'vuex';
import Swal from 'sweetalert2';
import axios from 'axios';
export default{
    computed:{
    ...mapState(['contactos'])
    },
    methods: {
    ...mapActions(['fetchContactos']),
    async eliminarContacto(id) {
      const resultado = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'No podrás revertir esta acción.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });
      Swal.showLoading();

      if (resultado.isConfirmed) {
        Swal.close();
        try {
          await axios.delete(`http://localhost:8000/api/contactos/${id}/`);
          this.fetchContactos();
          Swal.fire('Eliminado', 'El contacto ha sido eliminado correctamente.', 'success');
        } catch (error) {
          Swal.fire('Error', 'No se pudo eliminar el contacto.', 'error');
        }
      }
    },
    editarContacto(id) {
    this.$router.push(`/editar/${id}`);
  }
  },
  created(){
    this.fetchContactos();
  }
}
</script>


