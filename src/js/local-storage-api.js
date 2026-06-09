export class localStorageApi {

  static #keys = {
    theme: 'theme'
  }

  static get currentTheme() {
    return localStorage.getItem(this.#keys.theme);
  }

  static set currentTheme(theme) {
    localStorage.setItem(this.#keys.theme, theme);
  }
}
