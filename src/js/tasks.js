import { refs } from './refs.js';
import { localStorageApi } from './local-storage-api.js';

function serializeForm(formNode) {
  const data = Array.from(formNode.elements)
    .filter((item) => !!item.name)
    .map((element) => {
      const { name, type } = element
      const value = type === 'checkbox' ? element.checked : element.value

      return { name, value }
    });

  return data;
}

export class TaskList extends EventTarget {
  #taskListKey = 'tasks';

  #taskList = [];

  constructor(taskListKey) {
    super();
    this.#taskListKey = taskListKey;
  }

  get taskList() { return this.#taskList; }

  #onTaskAddedEvent(idx, task) {
    this.dispatchEvent(new CustomEvent('taskAdded', {detail: {idx: idx, task: task}}));
  }

  #onTaskDeletedEvent(guid) {
    this.dispatchEvent(new CustomEvent('taskDeleted', {detail: {guid: guid}}));
  }

  #onTasksLoadedEvent() {
    this.dispatchEvent(new CustomEvent('tasksLoaded', {detail: this.#taskList}));
  }

  addTask(params) {
    let idx = 0;
    let errorMessage = '';
    try {
      const task = new Task(params);
      if (task.isFullyFilled) {
        this.#taskList.unshift(task);
        idx = 0;

        this.saveCurrentTasks();
        this.#onTaskAddedEvent(idx, task);
      } else {
        idx = -1;
        errorMessage = task.errorMessage;
        console.log(errorMessage);
      }
    } catch(error) {
      idx = -1;
      errorMessage = error;
    }

    return {idx, errorMessage};
  }

  deleteTask(guid) {
    console.log(this.#taskList);
    for (var idx = this.#taskList.length - 1; idx >= 0; idx--) {
      const task = this.#taskList[idx];
      if (task.guid === guid) {
        this.#taskList.splice(idx, 1);
        console.log(this.#taskList);
      }
    }

    this.saveCurrentTasks();
    this.#onTaskDeletedEvent(guid);
  }

  saveCurrentTasks() {
    console.log(this.#taskList);
    localStorageApi.currentTasks = JSON.stringify(this.#taskList, this.#serializer);
  }

  loadCurrentTasks() {
    try {
      const tasks = localStorageApi.currentTasks;
      if (tasks) {
        this.#taskList = JSON.parse(tasks, this.#deserializer);
        this.#onTasksLoadedEvent();
      }
    } catch(error) {
      console.log(error);
    }
  }

  #serializer(key, value) {
    if (value instanceof Task) {
      value = value.toObject();
    }
      
    return value;
  }

  #deserializer(key, value) {
    if (value instanceof Object) {
      const className = value['__class'];
      if ((className) && (className !== '')) {
        delete value.__class;
/*        
        const str = `new ${className}({${objToString(value)}})`;
*/
        let newObj = eval('new ' + className + '(null)');
        Object.assign(newObj, value);
        value = newObj;
      }
    }

    return value;
  }
}

export class Task {
  #data = {name: '', description: '', guid: ''};

  constructor(params) {
    if (params) {
      this.name = params.name;
      this.description = params.description;
      this.#data.guid = params.guid || crypto.randomUUID();
    } else {
      this.#data.guid = crypto.randomUUID();
    }
  }

  get name() { return this.#data.name; }
  set name(value) { this.#data.name = value; }

  get description() { return this.#data.description; }
  set description(value) { this.#data.description = value; }

  get guid() { return this.#data.guid; }
  set guid(value) { this.#data.guid = value; }

  get isFullyFilled() {
    return (this.#data.name !== '') && (this.#data.description !== '');
  }

  get errorMessage() {
    return (this.#data.name === '') ? 'Task name is empty' : ((this.#data.description === '') ? 'Task description is empty' : '');
  }

  toObject() {
    const result = {};
    Object.assign(result, this.#data);
    result.__class = this.constructor.name;
    return result;
  }
/*
  toString() {
    return Object.entries(this).reduce((str, [param, value]) => {
      return `${str}${param}:${value}\n`
    }, '');
  }
*/
}
/*
function objToString(obj) {
  if ((obj) && (obj instanceof Object)) {
    return Object.entries(obj).reduce((str, [param, value]) => {
      return `${str}${param}: "${value}"\n`
    }, '');
  } else {
    return '';
  }
}
*/