import { refs } from './refs.js';
import { localStorageApi } from './local-storage-api.js';

const valueDark = 'dark';
const valueLight = 'light';
const classDark = 'theme-dark';
const classLight = 'theme-light';

export function loadCurrentTheme() {
  const theme = localStorageApi.currentTheme;
  if (theme === valueDark) {
      document.body.classList.add(classDark);
      document.body.classList.remove(classLight);
  } else {
      document.body.classList.remove(classDark);
      document.body.classList.add(classLight);
  }
}

if ((refs) && (refs.toggleThemeButton)) {
  refs.toggleThemeButton.addEventListener('click', () => {
    document.body.classList.toggle(classDark);
    document.body.classList.toggle(classLight);

    const theme = document.body.classList.contains(classDark) ? valueDark : valueLight;
    localStorageApi.currentTheme = theme;
  })
}
