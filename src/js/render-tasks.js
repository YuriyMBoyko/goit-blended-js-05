import { refs } from './refs.js';
import { TaskList, Task } from './tasks.js';
import { TaskMarkup } from './markup-tasks.js';

export class TaskDispatcher {
  static #taskList;

  static init(taskListKey) {
    this.#taskList = new TaskList(taskListKey);

    if (refs) {
      if (refs.taskList) {
        this.#taskList.addEventListener('taskAdded', (event) => {
          if (event.detail.idx >= 0) {
            const task = event.detail.task;
            if (task) {
              refs.taskList.insertAdjacentHTML(
                (event.detail.idx === 0 ? 'afterbegin' : 'beforeend'), 
                TaskMarkup.createTaskNode(task)
              );
            }
          }
        });

        this.#taskList.addEventListener('taskDeleted', (event) => {
          const guid = event.detail.guid;
          const itemsToDelete = document.querySelectorAll(`.task-list-item[data-guid="${guid}"]`);
          itemsToDelete.forEach(item => {
            refs.taskList.removeChild(item);
          });
        });

        this.#taskList.addEventListener('tasksLoaded', (event) => {
          const tasks = event.detail;
          if (tasks) {
            refs.taskList.innerHTML = TaskMarkup.createTaskNodes(tasks);
          }
        });
      }

      if (refs.addTaskForm) {
        refs.addTaskForm.addEventListener('submit', (event) => {
          event.preventDefault();

          const {idx, errorMessage} = this.#taskList.addTask({
            name: event.currentTarget.elements.taskName.value.trim(),
            description: event.currentTarget.elements.taskDescription.value.trim()
          });

          if (idx >= 0) {
            refs.addTaskForm.reset();
          } else {
            this.#showErrorMessage(errorMessage);
          }
        });
      }

      if (refs.taskList) {
        refs.taskList.addEventListener('click', (event) => {
          const element = event.target;
          if ((element) && (element.classList.contains('task-list-item-btn'))) {
            const parent = element.parentNode;
            if ((parent) && (parent.classList.contains('task-list-item'))) {
              const guid = parent.dataset.guid;
              this.#taskList.deleteTask(guid);
            }
          }
        });
      }
    }

    this.#taskList.loadCurrentTasks();
  }

  static #showErrorMessage(errorMessage) {
    alert(errorMessage);
  }
}
