import TaskItem from './TaskItem.js';
import DragDropController from '../utils/DragDropController.js';

class TaskList {
    constructor(containerElement, tasks, state, taskManager) {
        this.containerElement = containerElement;
        this.tasks = tasks;
        this.state = state;
        this.taskManager = taskManager;
        this.dragDropController = new DragDropController(this);
        
        this.setupContainerDragEvents();
    }
    
    setupContainerDragEvents() {
        this.containerElement.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });
        
        this.containerElement.addEventListener('dragenter', (e) => {
            if (e.target === this.containerElement) {
                this.containerElement.classList.add('container-drag-over');
            }
        });
        
        this.containerElement.addEventListener('dragleave', (e) => {
            if (e.relatedTarget && !this.containerElement.contains(e.relatedTarget)) {
                this.containerElement.classList.remove('container-drag-over');
            }
        });
        
        this.containerElement.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const taskId = parseInt(e.dataTransfer.getData('task-id'));
            const sourceState = e.dataTransfer.getData('task-state');
            
            if (taskId && sourceState !== this.state) {
                this.taskManager.moveTask(taskId, sourceState, this.state);
            }
            
            this.containerElement.classList.remove('container-drag-over');
        });
    }

    render() {
        this.containerElement.innerHTML = '';
        
        if (this.tasks.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.textContent = 'Drop tasks here';
            this.containerElement.appendChild(emptyState);
        }
        
        this.tasks.forEach((task, index) => {
            const taskItem = new TaskItem(task, index);
            const taskElement = taskItem.render();
            
            taskElement.dataset.state = this.state;
            
            this.dragDropController.attachDragEvents(taskElement);
            
            this.containerElement.appendChild(taskElement);
        });
    }

    reorderTasks(fromIndex, toIndex) {
        [this.tasks[fromIndex], this.tasks[toIndex]] = [this.tasks[toIndex], this.tasks[fromIndex]];
        this.render();
    }

    updateTasks(newTasks) {
        this.tasks = newTasks;
        this.render();
    }

    removeTask(taskId) {
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            this.tasks.splice(taskIndex, 1);
            this.render();
            return true;
        }
        return false;
    }

    addTask(task) {
        const newTask = {...task, state: this.state};
        this.tasks.push(newTask);
        this.render();
    }
}

export default TaskList;
