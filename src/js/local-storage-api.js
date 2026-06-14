export class localStorageApi {

  static #keys = {
    theme: 'theme',
    tasks: 'tasks'
  }

  static get currentTheme() {
    return localStorage.getItem(this.#keys.theme);
  }

  static set currentTheme(theme) {
    localStorage.setItem(this.#keys.theme, theme);
  }

  static get currentTasks() {
    return localStorage.getItem(this.#keys.tasks);
  }

  static set currentTasks(tasks) {
    localStorage.setItem(this.#keys.tasks, tasks);
  }
}
