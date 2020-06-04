export function getFromStorage (name) {
  return JSON.parse(localStorage.getItem(name));
}

export function setStorage (data, name) {
  localStorage.setItem(name, data);
}