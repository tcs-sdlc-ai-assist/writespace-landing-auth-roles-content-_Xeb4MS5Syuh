import { getUsers } from './storage';

const SESSION_KEY = 'writespace_session';

export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'adminpass',
};

export function getSession() {
  try {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setSession(sessionObj) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionObj));
  } catch {
    // localStorage unavailable
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // localStorage unavailable
  }
}

export function login(username, password) {
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    const session = {
      userId: 'admin-uuid',
      username: 'admin',
      displayName: 'Admin',
      role: 'admin',
    };
    setSession(session);
    return session;
  }

  const users = getUsers();
  const user = users.find((u) => u.username === username && u.password === password);

  if (!user) {
    return null;
  }

  const session = {
    userId: user.id,
    username: user.username,
    displayName: user.displayName,
    role: user.role,
  };
  setSession(session);
  return session;
}