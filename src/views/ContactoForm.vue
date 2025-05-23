<template>
  <div class="container mt-4">
    <div class="card shadow">
      <div class="card-header text-center">
        <h2>{{ contacto.id ? 'Editar Contacto' : 'Nuevo Contacto' }}</h2>
      </div>
      <div class="card-body">
        <form @submit.prevent="guardarContacto">
          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">Nombre</label>
              <input v-model="contacto.nombre" class="form-control" placeholder="Ingrese nombre" required />
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Apellido</label>
              <input v-model="contacto.apellido" class="form-control" placeholder="Ingrese apellido" required />
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">Teléfono</label>
              <input v-model="contacto.telefono" class="form-control" placeholder="Ingrese teléfono" required />
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Correo</label>
              <input v-model="contacto.email" class="form-control" placeholder="Ingrese correo" required />
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">Foto</label>
            <input type="file" @change="cargarFoto" class="form-control" />
            <img v-if="contacto.fotografia" :src="contacto.fotografia" alt="Fotografia" class="card-img-top img mb-2" />
          </div>
         <!--    <button v-if="contacto.fotografia" class="btn btn-danger mt-2" @click="eliminarFoto">
              Eliminar Foto
            </button> -->
          <div class="text-center">
            <button type="submit" class="btn btn-success" :disabled="!formularioCompleto">Guardar</button>
            <button type="button" class="btn btn-secondary ms-2" @click="$router.push('/')">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapState, mapActions } from 'vuex';
import Swal from 'sweetalert2';
export default {
  data() {
    return {
      contacto: {
        nombre: '',
        apellido: '',
        telefono: '',
        email: '',
        fotografia: '',
      }
    };
  },
  computed: {
    ...mapState(['contactos']),
    formularioCompleto() {
      return this.contacto.nombre && this.contacto.apellido && this.contacto.telefono && this.contacto.email;
    }
  },
  methods: {
    ...mapActions(['fetchContactos']),
    cargarFoto(event) {
    const archivo = event.target.files[0];
    if (archivo) {
      this.contacto.fotografia = archivo;
    }
    },
  /*   eliminarFoto() {
      this.contacto.fotografia = "http://localhost:8000/media/fotos/default.jpg";
    }, */

      validarNombre(nombre) {
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/; 
    return regex.test(nombre);
  },
  validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    return regex.test(email);
  },
  validarTelefono(telefono) {
    const regex = /^[0-9]{10,15}$/;
    return regex.test(telefono);
  },

    async guardarContacto() {
 if (!this.formularioCompleto) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, completa todos los campos obligatorios.',
      });
      return;
    }

    if (!this.validarNombre(this.contacto.nombre) || !this.validarNombre(this.contacto.apellido)) {
      Swal.fire({
        icon: 'error',
        title: 'Nombre inválido',
        text: 'El nombre y apellido solo pueden contener letras.',
      });
      return;
    }

    if (!this.validarEmail(this.contacto.email)) {
      Swal.fire({
        icon: 'error',
        title: 'Correo inválido',
        text: 'Por favor, ingresa un correo electrónico válido.',
      });
      return;
    }

    if (!this.validarTelefono(this.contacto.telefono)) {
      Swal.fire({
        icon: 'error',
        title: 'Número inválido',
        text: 'El número de teléfono debe contener solo dígitos y tener entre 10 y 15 caracteres.',
      });
      return;
    }

  let formData = new FormData();
  formData.append('nombre', this.contacto.nombre);
  formData.append('apellido', this.contacto.apellido);
  formData.append('telefono', this.contacto.telefono);
  formData.append('email', this.contacto.email);
  
  if (this.contacto.fotografia && typeof this.contacto.fotografia !== 'string') {
    formData.append('fotografia', this.contacto.fotografia);
  }

  try {
    const url = this.contacto.id
      ? `http://localhost:8000/api/contactos/${this.contacto.id}/`
      : `http://localhost:8000/api/contactos/`;

    await axios({
      method: this.contacto.id ? 'put' : 'post',
      url,
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    Swal.fire({
      icon: 'success',
      title: 'Contacto guardado',
      text: 'El contacto se ha guardado correctamente.',
    });

    this.$router.push('/');
    this.fetchContactos();
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);

    let mensajeError = 'Ocurrió un error al guardar el contacto.';
    if (error.response?.data?.telefono) {
      mensajeError = 'El número de teléfono ya está registrado.';
    } else if (error.response?.data?.email) {
      mensajeError = 'El correo electrónico ya está en uso.';
    }

    Swal.fire({
      icon: 'error',
      title: 'Error al guardar',
      text: mensajeError,
    });
  }
  }

  },
  created() {
    const id = this.$route.params.id;

    if (id) {
      this.contacto = this.contactos.find(c => c.id == id) || {};

      if (!this.contacto.fotografia) {
        this.contacto.fotografia = `http://localhost:8000/media/fotos/default.jpg`;
      }
    }
  }
};
</script>

<style>
.card {
  max-width: 700px;
  margin: auto;
  border-radius: 10px;
}
.shadow {
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}
.img-thumbnail {
  border-radius: 10px;
  object-fit: cover;
}
</style>
