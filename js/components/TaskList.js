import TaskItem from './TaskItem.js';
import DragDropController from '../utils/DragDropController.js';

class TaskList {
    constructor(containerElement, tasks, state) {
        this.containerElement = containerElement;
        this.tasks = tasks;
        this.state = state;
        this.dragDropController = new DragDropController(this);
    }

    render() {
        this.containerElement.innerHTML = '';
        
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
}

export default TaskList;
