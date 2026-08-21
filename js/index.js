const taskManager = new TaskManager();

console.log(taskManager.tasks); 


document.addEventListener('DOMContentLoaded', () => {
    const btnCompletarLista = document.querySelectorAll('.btn-completar-tarea');

    btnCompletarLista.forEach(boton => {
        boton.addEventListener('click', (event) => {
            const btn = event.currentTarget;
            
            const tarjeta = btn.closest('.tareaCard');
            const tituloTarea = tarjeta.querySelector('.tarea-titulo');

            tarjeta.classList.toggle('tarea-completada');

            if (tarjeta.classList.contains('tarea-completada')) {
                btn.textContent = 'Completada';
                btn.classList.remove('btn-outline-primary');
                btn.classList.add('btn-success');
                
                if (tituloTarea) {
                    tituloTarea.classList.add('text-decoration-line-through', 'text-muted');
                }
            } else {
                btn.textContent = 'Completar';
                btn.classList.remove('btn-success');
                btn.classList.add('btn-outline-primary');
                
                if (tituloTarea) {
                    tituloTarea.classList.remove('text-decoration-line-through', 'text-muted');
                }
            }
        });
    });
});