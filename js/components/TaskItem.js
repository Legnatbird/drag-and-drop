class TaskItem {
    constructor(taskData, index) {
        this.taskData = taskData;
        this.index = index;
    }

    getStatusClass(state) {
        switch(state) {
            case 'pending':
                return 'status-pending';
            case 'completed':
                return 'status-completed';
            case 'in-progress':
                return 'status-in-progress';
            default:
                return '';
        }
    }

    render() {
        const taskElement = document.createElement('div');
        taskElement.className = 'task';
        taskElement.draggable = true;
        taskElement.dataset.taskId = this.taskData.id;
        taskElement.dataset.index = this.index;
        
        taskElement.innerHTML = `
            <div class="task-index">${this.index + 1}</div>
            <h2>${this.taskData.name}</h2>
            <p>${this.taskData.description}</p>
            <p class="status ${this.getStatusClass(this.taskData.state)}">${this.taskData.state}</p>
        `;
        
        return taskElement;
    }
}

export default TaskItem;
