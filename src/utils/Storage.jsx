export function loadFromStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function saveToStorage(key, value) {
  try {
    const raw = typeof value === "string" ? value : JSON.stringify(value);
    localStorage.setItem(key, raw);
  } catch (e) {
    // ignore
  }
}
