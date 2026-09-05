class TaskManager {
    constructor(currentId = 0) {
        this.tasks = [];
        this.currentId = currentId;
    }
    addTask(name, description, dueDate, status) {
        this.currentId++;
        this.tasks.push({
            id: this.currentId,
            name: name,
            description: description,
            dueDate: dueDate,
            status: 'PORHACER'
        });
    }
    createTaskHtml(id, name, description, dueDate, status) {
        return `
        <div class="card mb-3 tareaCard">
            <div class="card-body d-flex align-items-center justify-content-between p-3" data-task-id="${id}">
                <div>
                    <h5 class="tarea-titulo mb-1">${name}</h5>
                    <small class="text-body-secondary">Fecha de entrega: ${dueDate}</small>
                </div>
                <button class="done-button btn btn-success">
                    Mark As Done
                </button>
                <button class="delete-button btn btn-danger">
                    Eliminar
                </button>
            </div>
        </div>
        `;
    }
    render() {
        const taskListContainer = document.querySelector('#taskListContainer');
        let html = '';
        for (let task of this.tasks) {
            html += this.createTaskHtml(task.id, task.name, task.description, task.dueDate, task.status);
        }
        taskListContainer.innerHTML = html;
    }
    save() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
    loadTasks() {
        const tasksGuardadas = localStorage.getItem('tasks');
        if (tasksGuardadas) {
            this.tasks = JSON.parse(tasksGuardadas);
        }
    }
    deleteTask(taskId) {
        const newTasks = [];
        for (let task of this.tasks) {
            if (task.id !== taskId) {
                newTasks.push(task);
            }
        }
        this.tasks = newTasks;
    }
    getTaskById(taskId) {
        let foundTask;
        for (let task of this.tasks) {
            if (task.id === taskId) {
                foundTask = task;
            }
        }
        return foundTask;
    }
}