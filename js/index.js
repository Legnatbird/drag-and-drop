import TaskManager from './components/TaskManager.js';

document.addEventListener('DOMContentLoaded', () => {
    const rootElement = document.getElementById('root');
    const taskManager = new TaskManager(rootElement);
    taskManager.render();
});