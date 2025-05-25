import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js';
import { 
  getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged 
} from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js';

const firebaseConfig = {
  apiKey: 'YOUR_FIREBASE_API_KEY',
  authDomain: 'YOUR_FIREBASE_AUTH_DOMAIN',
  projectId: 'YOUR_FIREBASE_PROJECT_ID',
  storageBucket: 'YOUR_FIREBASE_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_FIREBASE_MESSAGING_SENDER_ID',
  appId: 'YOUR_FIREBASE_APP_ID'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const modal = document.getElementById('login-modal');
const backdrop = document.getElementById('modal-backdrop');
const loginBtn = document.querySelector('.logout-btn');
const postsWrapper = document.getElementById('posts-wrapper');
const statusBar = document.getElementById('status-bar');

let postCount = 0;
const posts = [];

const allStatusUsers = [
  { id: 1, name: 'alice', avatar: 'https://randomuser.me/api/portraits/women/65.jpg' },
  { id: 2, name: 'bob', avatar: 'https://randomuser.me/api/portraits/men/12.jpg' },
  { id: 3, name: 'carol', avatar: 'https://randomuser.me/api/portraits/women/32.jpg' },
  { id: 4, name: 'dave', avatar: 'https://randomuser.me/api/portraits/men/45.jpg' },
  { id: 5, name: 'emma', avatar: 'https://randomuser.me/api/portraits/women/50.jpg' },
  { id: 6, name: 'frank', avatar: 'https://randomuser.me/api/portraits/men/33.jpg' },
  { id: 7, name: 'gina', avatar: 'https://randomuser.me/api/portraits/women/27.jpg' },
  { id: 8, name: 'henry', avatar: 'https://randomuser.me/api/portraits/men/75.jpg' },
  { id: 9, name: 'iris', avatar: 'https://randomuser.me/api/portraits/women/11.jpg' },
  { id: 10, name: 'jack', avatar: 'https://randomuser.me/api/portraits/men/59.jpg' },
  { id: 11, name: 'kate', avatar: 'https://randomuser.me/api/portraits/women/40.jpg' },
  { id: 12, name: 'leo', avatar: 'https://randomuser.me/api/portraits/men/64.jpg' },
];

let currentIndex = 0;

function getVisibleStatuses() {
  const visible = allStatusUsers.slice(currentIndex, currentIndex + 10);
  if (visible.length < 10) {
    visible.push(...allStatusUsers.slice(0, 10 - visible.length));
  }
  return visible;
}

function renderStatusBar() {
  statusBar.innerHTML = '';
  getVisibleStatuses().forEach(user => {
    const div = document.createElement('div');
    div.className = 'status-item';
    div.innerHTML = `
      <span class="status-avatar-border">
        <img src="${user.avatar}" alt="${user.name}" class="status-avatar" />
      </span>
      <span class="status-username">${user.name}</span>
    `;
    statusBar.appendChild(div);
  });
}

function updateStatuses() {
  currentIndex = (currentIndex + 1) % allStatusUsers.length;
  renderStatusBar();
}

async function fetchRandomImage() {
  return 'https://picsum.photos/600/400';
}

async function fetchRandomPost() {
  try {
    const res = await fetch('https://dummyjson.com/posts');
    const data = await res.json();
    return data.posts[Math.floor(Math.random() * data.posts.length)];
  } catch {
    return { title: 'Default Post Title', body: 'Placeholder post in case API fails.' };
  }
}

async function fetchRandomUser() {
  try {
    const res = await fetch('https://randomuser.me/api/');
    const data = await res.json();
    const user = data.results[0];
    return {
      name: `${user.name.first} ${user.name.last}`,
      avatar: user.picture.medium
    };
  } catch {
    return { name: 'Anonymous User', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' };
  }
}

async function generateNewPostVersion() {
  if (postCount >= 30) return;

  const randomUser = await fetchRandomUser();
  const postData = await fetchRandomPost();
  const imageUrl = await fetchRandomImage();

  posts.unshift({
    id: postCount + 1,
    user: { name: randomUser.name, avatar: randomUser.avatar },
    timestamp: new Date(),
    image: imageUrl,
    caption: postData.title,
    body: postData.body,
    likes: Math.floor(Math.random() * 20),
    comments: []
  });

  postCount++;
  renderPosts();
}

function renderPosts() {
  postsWrapper.innerHTML = '';
  posts.forEach(post => {
    const postDiv = document.createElement('div');
    postDiv.className = 'post-container';
    postDiv.innerHTML = `
      <div class="post-header">
        <div class="post-user-info">
          <img src="${post.user.avatar}" alt="${post.user.name}" class="post-user-avatar" />
          <div>
            <p class="post-user-name">${post.user.name}</p>
            <span class="post-timestamp">${new Date(post.timestamp).toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
      <img src="${post.image}" alt="Post image" class="post-image" onerror="this.src='https://picsum.photos/600/400'" />
      <p class="post-caption">${post.caption}</p>
      <p class="post-body">${post.body}</p>
      <div class="post-actions">
        <button class="like-btn" data-post-id="${post.id}">
          <i class='bx bx-heart'></i> ${post.likes}
        </button>
      </div>
    `;
    postsWrapper.appendChild(postDiv);
  });
}
document.addEventListener("click", (e) => {
  if (e.target.closest(".like-btn")) {
    const btn = e.target.closest(".like-btn");
    const icon = btn.querySelector("i");
    icon.classList.toggle("bxs-heart");
    icon.classList.toggle("bx-heart");
  }
});



setInterval(async () => {
  updateStatuses();
  await generateNewPostVersion();
}, 15000);

renderStatusBar();
generateNewPostVersion();


