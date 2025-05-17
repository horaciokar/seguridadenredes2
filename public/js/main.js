document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM
    const formularioEstudiante = document.getElementById('formularioEstudiante');
    const tablaEstudiantes = document.getElementById('tablaEstudiantes').querySelector('tbody');
    const loader = document.getElementById('loader');
    
    // Función para cargar la lista de estudiantes
    async function cargarEstudiantes() {
      try {
        loader.style.display = 'block';
        tablaEstudiantes.innerHTML = '';
        
        const respuesta = await fetch('/api/estudiantes');
        const datos = await respuesta.json();
        
        if (datos.length === 0) {
          tablaEstudiantes.innerHTML = '<tr><td colspan="4">No hay estudiantes registrados</td></tr>';
        } else {
          datos.forEach(estudiante => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
              <td>${estudiante.id}</td>
              <td>${estudiante.nombre}</td>
              <td>${estudiante.email}</td>
              <td>${estudiante.carrera}</td>
            `;
            tablaEstudiantes.appendChild(fila);
          });
        }
      } catch (error) {
        console.error('Error al cargar estudiantes:', error);
        tablaEstudiantes.innerHTML = '<tr><td colspan="4">Error al cargar los datos</td></tr>';
      } finally {
        loader.style.display = 'none';
      }
    }
    
    // Función para mostrar mensajes al usuario
    function mostrarMensaje(texto, tipo) {
      const mensajeExistente = document.querySelector('.mensaje');
      if (mensajeExistente) {
        mensajeExistente.remove();
      }
      
      const mensaje = document.createElement('div');
      mensaje.className = `mensaje ${tipo}`;
      mensaje.textContent = texto;
      
      formularioEstudiante.insertAdjacentElement('beforebegin', mensaje);
      
      // Auto-eliminar el mensaje después de 3 segundos
      setTimeout(() => {
        mensaje.remove();
      }, 3001);
    }
    
    // Manejar el envío del formulario
    formularioEstudiante.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(formularioEstudiante);
      const estudiante = {
        nombre: formData.get('nombre'),
        email: formData.get('email'),
        carrera: formData.get('carrera')
      };
      
      try {
        const respuesta = await fetch('/api/estudiantes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(estudiante)
        });
        
        const resultado = await respuesta.json();
        
        if (respuesta.ok) {
          mostrarMensaje(resultado.mensaje, 'exito');
          formularioEstudiante.reset();
          cargarEstudiantes();
        } else {
          mostrarMensaje(resultado.error || 'Error al guardar el estudiante', 'error');
        }
      } catch (error) {
        console.error('Error al enviar el formulario:', error);
        mostrarMensaje('Error de conexión al servidor', 'error');
      }
    });
    
    // Cargar estudiantes al iniciar la página
    cargarEstudiantes();
  });