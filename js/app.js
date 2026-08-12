const taskForm = document.querySelector('#taskForm');
const errorAlert = document.querySelector('#errorAlert');

function validFormFieldInput(data) {
    const errores = [];
    if (data.nombre.trim() === "") {
        errores.push("El nombre de la tarea es obligatorio.");
    }
    if (data.descripcion.trim() === "") {
        errores.push("La descripción es obligatoria.");
    }
    if (data.fecha === "") {
        errores.push("La fecha de entrega es obligatoria.");
    }
    if (data.estado === "") {
        errores.push("Debes seleccionar un estado.");
    }
    if (data.prioridad === "") {
        errores.push("Debes seleccionar una prioridad.");
    }
    return errores;
}

taskForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const data = {
        nombre: document.querySelector('#nombreTarea').value,
        descripcion: document.querySelector('#descripcionTarea').value,
        fecha: document.querySelector('#fechaEntrega').value,
        estado: document.querySelector('#estado').value,
        prioridad: document.querySelector('#prioridad').value
    };
    console.log(data);

    const errores = validFormFieldInput(data);
    if (errores.length > 0) {
        errorAlert.innerHTML = errores.join('<br>');
        errorAlert.classList.remove('d-none');
        return;
    }
    errorAlert.classList.add('d-none');
    console.log("Formulario válido");
});