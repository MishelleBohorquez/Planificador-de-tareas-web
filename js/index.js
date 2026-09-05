const taskManager = new TaskManager();
taskManager.addTask(
    'Sacar la basura',
    'Sacar la basura al frente de la casa',
    '2020-09-20',
    'PORHACER'
);
console.log(taskManager.tasks);

document.addEventListener('DOMContentLoaded', () => {
    taskManager.loadTasks();
    taskManager.render();

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

    const taskListContainer = document.querySelector('#taskListContainer');
    taskListContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-button')) {
            const parentTask = event.target.parentElement;
            const taskId = Number(parentTask.dataset.taskId);
            taskManager.deleteTask(taskId);
            taskManager.save();
            taskManager.render();
        }
        if (event.target.classList.contains('done-button')) {
            const parentTask = event.target.parentElement;
            const taskId = Number(parentTask.dataset.taskId);
            const task = taskManager.getTaskById(taskId);
            task.status = 'DONE';
            taskManager.render();
        }
    });
});

const newTaskForm = document.querySelector('#taskForm');
newTaskForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.querySelector('#nombreTarea').value;
    const description = document.querySelector('#descripcionTarea').value;
    const dueDate = document.querySelector('#fechaEntrega').value;
    const status = document.querySelector('#estado').value;

    taskManager.addTask(
        name,
        description,
        dueDate,
        status
    );

    taskManager.save();
    taskManager.render();

    newTaskForm.reset();
});