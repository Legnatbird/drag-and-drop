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
            this.taskLists[state] = new TaskList(taskContainer, stateFilteredTasks, state, this);
            this.taskLists[state].render();
        });
    }

    handleTaskStateChange(task) {
        const taskIndex = this.tasks.findIndex(t => t.id === task.id);
        if (taskIndex !== -1) {
            this.tasks[taskIndex] = task;
        }
        
        const newState = task.state;
        if (this.taskLists[newState]) {
            this.taskLists[newState].addTask(task);
        }
    }

    moveTask(taskId, fromState, toState) {
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);
        
        if (taskIndex !== -1) {
            const task = {...this.tasks[taskIndex]};
            task.state = toState;
            this.tasks[taskIndex] = task;
            
            this.taskLists[fromState].removeTask(taskId);
            
            this.taskLists[toState].addTask(task);
        }
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
        this.tasks = JSON.parse(JSON.stringify(this.originalTasks));
        this.render();
    }
}

export default TaskManager;
