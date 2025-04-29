import TaskList from './TaskList.js';
import tasks from '../data.js';

class TaskManager {
    constructor(rootElement) {
        this.rootElement = rootElement;
        this.originalTasks = [...tasks];
        this.tasks = [...tasks];
        this.taskList = null;
    }

    render() {
        if (!this.rootElement.querySelector('h1')) {
            const header = document.createElement('h1');
            header.textContent = 'Task Manager';
            this.rootElement.appendChild(header);
        }

        this.addResetButton();

        let taskContainer = this.rootElement.querySelector('#task-container');
        if (!taskContainer) {
            taskContainer = document.createElement('div');
            taskContainer.id = 'task-container';
            this.rootElement.appendChild(taskContainer);
        }

        this.taskList = new TaskList(taskContainer, this.tasks);
        this.taskList.render();
    }

    addResetButton() {
        const existingButton = this.rootElement.querySelector('#reset-button');
        if (existingButton) {
            existingButton.remove();
        }

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';

        const resetButton = document.createElement('button');
        resetButton.id = 'reset-button';
        resetButton.className = 'reset-button';
        resetButton.textContent = 'Reset Task Order';
        resetButton.addEventListener('click', () => this.resetTasks());

        buttonContainer.appendChild(resetButton);
        this.rootElement.appendChild(buttonContainer);
    }

    resetTasks() {
        this.tasks = [...this.originalTasks];
        if (this.taskList) {
            this.taskList.updateTasks(this.tasks);
        }
    }
}

export default TaskManager;
