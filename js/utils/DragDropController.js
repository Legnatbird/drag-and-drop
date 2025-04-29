class DragDropController {
    constructor(taskList) {
        this.taskList = taskList;
        this.draggedTask = null;
    }

    attachDragEvents(taskElement) {
        taskElement.addEventListener('dragstart', this.handleDragStart.bind(this));
        taskElement.addEventListener('dragover', this.handleDragOver.bind(this));
        taskElement.addEventListener('dragenter', this.handleDragEnter.bind(this));
        taskElement.addEventListener('dragleave', this.handleDragLeave.bind(this));
        taskElement.addEventListener('drop', this.handleDrop.bind(this));
        taskElement.addEventListener('dragend', this.handleDragEnd.bind(this));
    }

    attachContainerDragEvents() {
        const container = this.taskList.containerElement;
        container.addEventListener('dragover', this.handleContainerDragOver.bind(this));
        container.addEventListener('dragenter', this.handleContainerDragEnter.bind(this));
        container.addEventListener('dragleave', this.handleContainerDragLeave.bind(this));
        container.addEventListener('drop', this.handleContainerDrop.bind(this));
    }

    handleDragStart(e) {
        this.draggedTask = e.currentTarget;
        this.draggedTask.classList.add('dragging');
        
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', this.draggedTask.dataset.index);
        e.dataTransfer.setData('application/json', JSON.stringify({
            taskId: this.draggedTask.dataset.taskId,
            state: this.draggedTask.dataset.state,
            index: this.draggedTask.dataset.index
        }));
        
        e.dataTransfer.setData('task-id', this.draggedTask.dataset.taskId);
        e.dataTransfer.setData('task-state', this.draggedTask.dataset.state);
    }

    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        return false;
    }

    handleContainerDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        return false;
    }

    handleDragEnter(e) {
        e.currentTarget.classList.add('drag-over');
    }

    handleContainerDragEnter(e) {
        if (e.target === this.taskList.containerElement) {
            e.currentTarget.classList.add('container-drag-over');
        }
    }

    handleDragLeave(e) {
        e.currentTarget.classList.remove('drag-over');
    }

    handleContainerDragLeave(e) {
        if (e.target === this.taskList.containerElement) {
            e.currentTarget.classList.remove('container-drag-over');
        }
    }

    handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const target = e.currentTarget;
        
        if (!this.draggedTask) return false;
        
        const draggedState = this.draggedTask.dataset.state;
        const targetState = target.dataset.state;
        const taskId = parseInt(this.draggedTask.dataset.taskId);
        
        if (this.draggedTask !== target) {
            if (draggedState === targetState) {
                const fromIndex = parseInt(this.draggedTask.dataset.index);
                const toIndex = parseInt(target.dataset.index);
                this.taskList.reorderTasks(fromIndex, toIndex);
            } else {
                this.taskList.taskManager.moveTask(taskId, draggedState, targetState);
            }
        }
        
        return false;
    }

    handleContainerDrop(e) {
        if (e.target !== this.taskList.containerElement) return;
        
        e.stopPropagation();
        e.preventDefault();
        
        const targetState = this.taskList.state;
        const taskId = parseInt(e.dataTransfer.getData('task-id'));
        const draggedState = e.dataTransfer.getData('task-state');
        
        if (draggedState !== targetState) {
            this.taskList.taskManager.moveTask(taskId, draggedState, targetState);
        }
        
        return false;
    }

    handleDragEnd(e) {
        document.querySelectorAll('.task').forEach(task => {
            task.classList.remove('dragging');
            task.classList.remove('drag-over');
        });
        
        document.querySelectorAll('.task-container').forEach(container => {
            container.classList.remove('container-drag-over');
        });
        
        this.draggedTask = null;
    }
}

export default DragDropController;
