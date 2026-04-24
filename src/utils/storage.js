const POSTS_KEY = 'writespace_posts';
const USERS_KEY = 'writespace_users';

export function getPosts() {
  try {
    const data = localStorage.getItem(POSTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function setPosts(posts) {
  try {
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  } catch {
    // localStorage unavailable
  }
}

export function addPost(post) {
  const posts = getPosts();
  posts.push(post);
  setPosts(posts);
}

export function updatePost(id, data) {
  const posts = getPosts();
  const index = posts.findIndex((p) => p.id === id);
  if (index !== -1) {
    posts[index] = { ...posts[index], ...data };
    setPosts(posts);
  }
}

export function deletePost(id) {
  const posts = getPosts();
  const filtered = posts.filter((p) => p.id !== id);
  setPosts(filtered);
}

export function getUsers() {
  try {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function setUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    // localStorage unavailable
  }
}

export function addUser(user) {
  const users = getUsers();
  users.push(user);
  setUsers(users);
}

export function deleteUser(id) {
  const users = getUsers();
  const filtered = users.filter((u) => u.id !== id);
  setUsers(filtered);
}