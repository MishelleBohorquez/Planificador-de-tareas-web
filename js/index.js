const taskManager = new TaskManager();

let taskIdToDelete = null;

fetch('http://localhost:8080/api/tasks')
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        taskManager.tasks = data;
        taskManager.render();
    });

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
            fetch('http://localhost:8080/api/tasks/' + taskIdToDelete, {
                method: 'DELETE'
            }).then(function() {
                taskManager.deleteTask(taskIdToDelete);
                taskManager.render();
                taskIdToDelete = null;
            });
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
            fetch('http://localhost:8080/api/tasks/' + taskId, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(task)
            }).then(function() {
                taskManager.render();
            });
        }
    });
});

const newTaskForm = document.querySelector('#taskForm');
newTaskForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.querySelector('#nombreTarea').value;
    const description = document.querySelector('#descripcionTarea').value;
    const dueDate = document.querySelector('#fechaEntrega').value;
    const area = document.querySelector('#areaEnfoque').value;

    const nuevaTarea = {
        name: name,
        description: description,
        dueDate: dueDate,
        status: 'PORHACER'
    };

    fetch('http://localhost:8080/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaTarea)
    })
        .then(function(response) {
            return response.json();
        })
        .then(function(tareaCreada) {
            tareaCreada.area = area;
            taskManager.tasks.push(tareaCreada);
            taskManager.render();
        });

    newTaskForm.reset();
});