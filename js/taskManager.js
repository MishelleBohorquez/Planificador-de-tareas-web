class TaskManager {
    constructor() {
        this.tasks = [];
    }
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