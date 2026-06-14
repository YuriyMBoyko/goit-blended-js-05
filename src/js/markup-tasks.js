export class TaskMarkup {
  static createTaskNode({ guid, name, description }) {
    return `
      <li class="task-list-item" data-guid="${guid}">
        <button class="task-list-item-btn">Delete</button>
        <h3>${name}</h3>
        <p>${description}</p>
      </li>
    `
  }

  static createTaskNodes(tasks) {
    return (Array.isArray(tasks)) ? tasks.map(this.createTaskNode).join('') : '';
  }

}