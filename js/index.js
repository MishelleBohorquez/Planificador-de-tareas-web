const taskManager = new TaskManager();
taskManager.load();
taskManager.render();
taskManager.addTask(
    'Sacar la basura',
    'Sacar la basura al frente de la casa',
    '2020-09-20',
    'PORHACER'
);
console.log(taskManager.tasks);

let taskIdToDelete = null;

document.addEventListener('DOMContentLoaded', () => {
    const calendarEl = document.querySelector('#calendarContainer');
    window.calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'es',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: ''
        },
        events: function(info, successCallback) {
            const eventos = [];
            for (let task of taskManager.tasks) {
                eventos.push({
                    title: task.name,
                    start: task.dueDate
                });
            }
            successCallback(eventos);
        }
    });
    window.calendar.render();

    document.querySelector('#fechaCalendar').addEventListener('change', function() {
        window.calendar.gotoDate(this.value);
    });

    const confirmDeleteModalEl = document.querySelector('#confirmDeleteModal');
    const confirmDeleteModal = new bootstrap.Modal(confirmDeleteModalEl);

    document.querySelector('#confirmDeleteBtn').addEventListener('click', () => {
        if (taskIdToDelete !== null) {
            taskManager.deleteTask(taskIdToDelete);
            taskManager.save();
            taskManager.render();
            taskIdToDelete = null;
        }
    });

    const mainTabContent = document.querySelector('#mainTabContent');
    mainTabContent.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-button')) {
            const parentTask = event.target.closest('[data-task-id]');
            taskIdToDelete = Number(parentTask.dataset.taskId);
            confirmDeleteModal.show();
        }

        if (event.target.classList.contains('status-option')) {
            event.preventDefault();
            const parentTask = event.target.closest('[data-task-id]');
            const taskId = Number(parentTask.dataset.taskId);
            const task = taskManager.getTaskById(taskId);
            task.status = event.target.dataset.status;
            if (task.status === 'DONE') {
                task.completedAt = new Date().toISOString().split('T')[0];
            }
            taskManager.save();
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
    const area = document.querySelector('#areaEnfoque').value;

    taskManager.addTask(
        name,
        description,
        dueDate,
        status
    );

    const tareaCreada = taskManager.getTaskById(taskManager.currentId);
    tareaCreada.area = area;

    taskManager.save();
    taskManager.render();

    newTaskForm.reset();
});