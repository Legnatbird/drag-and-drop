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

    handleDragStart(e) {
        this.draggedTask = e.currentTarget;
        this.draggedTask.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', this.draggedTask.dataset.index);
        e.dataTransfer.setData('task-state', this.draggedTask.dataset.state);
    }

    handleDragOver(e) {
        e.preventDefault();

        const draggedState = this.draggedTask.dataset.state;
        const targetState = e.currentTarget.dataset.state;
        
        if (draggedState === targetState) {
            e.dataTransfer.dropEffect = 'move';
        } else {
            e.dataTransfer.dropEffect = 'none';
        }
        
        return false;
    }

    handleDragEnter(e) {
        const draggedState = this.draggedTask.dataset.state;
        const targetState = e.currentTarget.dataset.state;
        
        if (draggedState === targetState) {
            e.currentTarget.classList.add('drag-over');
        }
    }

    handleDragLeave(e) {
        e.currentTarget.classList.remove('drag-over');
    }

    handleDrop(e) {
        e.stopPropagation();
        e.preventDefault();
        
        const target = e.currentTarget;
        
        const draggedState = this.draggedTask.dataset.state;
        const targetState = target.dataset.state;
        
        if (draggedState !== targetState) {
            return false;
        }
        
        if (this.draggedTask !== target) {
            const fromIndex = parseInt(this.draggedTask.dataset.index);
            const toIndex = parseInt(target.dataset.index);
            
            this.taskList.reorderTasks(fromIndex, toIndex);
        }
        
        return false;
    }

    handleDragEnd(e) {
        document.querySelectorAll('.task').forEach(task => {
            task.classList.remove('dragging');
            task.classList.remove('drag-over');
        });
        
        this.draggedTask = null;
    }
}

export default DragDropController;
