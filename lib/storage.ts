import type { Project } from './export.ts';

/** Bezpieczny dostęp do localStorage (tryb prywatny, zablokowane ciasteczka). */
export function load<T>(key: string, fallback: T): T {
  try {
    const v = window.localStorage.getItem(key);
    return v === null ? fallback : (JSON.parse(v) as T);
  } catch {
    return fallback;
  }
}

export function save(key: string, value: unknown): boolean {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export const PROJECTS_KEY = 'brickly.projects';
export const ACTIVE_KEY = 'brickly.activeProject';

export function addProject(project: Project): boolean {
  const list = load<Project[]>(PROJECTS_KEY, []);
  list.unshift(project);
  return save(PROJECTS_KEY, list) && save(ACTIVE_KEY, project.id);
}

export function download(filename: string, content: string, mime = 'text/plain;charset=utf-8') {
  const url = URL.createObjectURL(new Blob([content], { type: mime }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(url);
    a.remove();
  }, 0);
}

export function toast(message: string) {
  window.dispatchEvent(new CustomEvent('brickly-toast', { detail: message }));
}
