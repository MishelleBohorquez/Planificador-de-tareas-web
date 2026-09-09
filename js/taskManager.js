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
        let tachado = '';
        if (status === 'DONE') {
            tachado = 'text-decoration-line-through text-muted';
        }

        let textoEstado = 'Por hacer';
        if (status === 'ENCURSO') {
            textoEstado = 'En curso';
        }
        if (status === 'DONE') {
            textoEstado = 'Hecho';
        }

        return `
        <div class="card mb-3 tareaCard">
            <div class="card-body d-flex align-items-center justify-content-between p-3" data-task-id="${id}">
                <div>
                    <h5 class="tarea-titulo mb-1 ${tachado}">${name}</h5>
                    <small class="text-body-secondary">Fecha de entrega: ${dueDate}</small>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <div class="dropdown">
                        <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">
                            ${textoEstado}
                        </button>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item status-option" href="#" data-status="PORHACER">Por hacer</a></li>
                            <li><a class="dropdown-item status-option" href="#" data-status="ENCURSO">En curso</a></li>
                            <li><a class="dropdown-item status-option" href="#" data-status="DONE">Hecho</a></li>
                        </ul>
                    </div>
                    <button class="delete-button btn btn-danger btn-sm">
                        Eliminar
                    </button>
                </div>
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

        const pendingContainer = document.querySelector('#task-pending-list');
        const enCursoContainer = document.querySelector('#task-in-progress-list');
        const doneContainer = document.querySelector('#task-done-list');
        let htmlPendiente = '';
        let htmlEnCurso = '';
        let htmlHecho = '';
        for (let task of this.tasks) {
            if (task.status === 'PORHACER') {
                htmlPendiente += this.createTaskHtml(task.id, task.name, task.description, task.dueDate, task.status);
            }
            if (task.status === 'ENCURSO') {
                htmlEnCurso += this.createTaskHtml(task.id, task.name, task.description, task.dueDate, task.status);
            }
            if (task.status === 'DONE') {
                htmlHecho += this.createTaskHtml(task.id, task.name, task.description, task.dueDate, task.status);
            }
        }
        pendingContainer.innerHTML = htmlPendiente;
        enCursoContainer.innerHTML = htmlEnCurso;
        doneContainer.innerHTML = htmlHecho;

        const dashboardContainer = document.querySelector('#dashboardTaskList');
        const hoy = new Date().toISOString().split('T')[0];
        let htmlHoy = '';
        for (let task of this.tasks) {
            if (task.dueDate === hoy) {
                htmlHoy += this.createTaskHtml(task.id, task.name, task.description, task.dueDate, task.status);
            }
        }
        if (htmlHoy === '') {
            htmlHoy = '<p class="text-body-secondary">No tienes tareas para hoy.</p>';
        }
        dashboardContainer.innerHTML = htmlHoy;

        let contadorTrabajo = 0;
        let contadorPersonal = 0;
        let contadorSalud = 0;
        for (let task of this.tasks) {
            if (task.status !== 'DONE') {
                if (task.area === 'trabajo') {
                    contadorTrabajo++;
                }
                if (task.area === 'personal') {
                    contadorPersonal++;
                }
                if (task.area === 'salud') {
                    contadorSalud++;
                }
            }
        }
        document.querySelector('#countTrabajo').textContent = contadorTrabajo + ' Tareas pendientes';
        document.querySelector('#countPersonal').textContent = contadorPersonal + ' Tareas pendientes';
        document.querySelector('#countSalud').textContent = contadorSalud + ' Tarea pendiente';

        let contadorCompletadas = 0;
        for (let task of this.tasks) {
            if (task.status === 'DONE') {
                contadorCompletadas++;
            }
        }
        document.querySelector('#statCompletadas').textContent = contadorCompletadas;

        let diasSeguidos = 0;
        let diaRevisar = new Date();
        let sigueLaRacha = true;
        while (sigueLaRacha) {
            let diaTexto = diaRevisar.toISOString().split('T')[0];
            let hayCompletadaEseDia = false;
            for (let task of this.tasks) {
                if (task.completedAt === diaTexto) {
                    hayCompletadaEseDia = true;
                }
            }
            if (hayCompletadaEseDia) {
                diasSeguidos++;
                diaRevisar.setDate(diaRevisar.getDate() - 1);
            } else {
                sigueLaRacha = false;
            }
        }
        document.querySelector('#statRacha').textContent = diasSeguidos + ' días';

        if (window.calendar) {
            window.calendar.refetchEvents();
        }
    }
    save() {
        const tasksJson = JSON.stringify(this.tasks);
        localStorage.setItem('tasks', tasksJson);
        const currentId = String(this.currentId);
        localStorage.setItem('currentId', currentId);
    }
    load() {
        const tasksJson = localStorage.getItem('tasks');
        if (tasksJson) {
            this.tasks = JSON.parse(tasksJson);
        }
        const currentId = localStorage.getItem('currentId');
        if (currentId) {
            this.currentId = Number(currentId);
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