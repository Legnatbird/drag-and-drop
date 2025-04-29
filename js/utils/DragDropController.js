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
    }

    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        return false;
    }

    handleDragEnter(e) {
        e.currentTarget.classList.add('drag-over');
    }

    handleDragLeave(e) {
        e.currentTarget.classList.remove('drag-over');
    }

    handleDrop(e) {
        e.stopPropagation();
        e.preventDefault();
        
        const target = e.currentTarget;
        
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
