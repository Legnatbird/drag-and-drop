import TaskList from './TaskList.js';
import tasks from '../data.js';

class TaskManager {
    constructor(rootElement) {
        this.rootElement = rootElement;
        this.originalTasks = [...tasks];
        this.tasks = [...tasks];
        this.taskLists = {};
        
        this.initializeUI();
    }
    
    initializeUI() {
        if (!this.rootElement.querySelector('h1')) {
            const header = document.createElement('h1');
            header.textContent = 'Task Manager';
            this.rootElement.appendChild(header);
        }

        this.addResetButton();
        
        let columnsContainer = this.rootElement.querySelector('#columns-container');
        if (!columnsContainer) {
            columnsContainer = document.createElement('div');
            columnsContainer.id = 'columns-container';
            this.rootElement.appendChild(columnsContainer);
        }
    }

    render() {
        const columnsContainer = this.rootElement.querySelector('#columns-container');
        columnsContainer.innerHTML = '';

        const states = ['pending', 'in-progress', 'completed'];
        const stateTitles = {
            'pending': 'Pending',
            'in-progress': 'In Progress',
            'completed': 'Completed'
        };

        states.forEach(state => {
            const column = document.createElement('div');
            column.className = 'task-column';
            column.id = `${state}-column`;
            
            const columnTitle = document.createElement('h2');
            columnTitle.className = 'column-title';
            columnTitle.textContent = stateTitles[state];
            column.appendChild(columnTitle);
            
            const taskContainer = document.createElement('div');
            taskContainer.className = 'task-container';
            taskContainer.id = `${state}-tasks`;
            column.appendChild(taskContainer);
            
            columnsContainer.appendChild(column);
            
            const stateFilteredTasks = this.tasks.filter(task => task.state === state);
            this.taskLists[state] = new TaskList(taskContainer, stateFilteredTasks, state);
            this.taskLists[state].render();
        });
    }

    addResetButton() {
        const existingButton = this.rootElement.querySelector('#reset-button');
        if (existingButton) {
            return;
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
        this.render();
    }
}

export default TaskManager;
