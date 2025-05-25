import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBBb3q6htkf5KL1ucrvAZfcjzgups9ELHM",
  authDomain: "insta-fullstack-36359.firebaseapp.com",
  projectId: "insta-fullstack-36359",
  storageBucket: "insta-fullstack-36359.appspot.com",
  messagingSenderId: "686727278680",
  appId: "1:686727278680:web:14b92b25a0a3ff09f55a2d",
  measurementId: "G-B59W929VBL"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login-btn");
  const modal = document.getElementById("login-modal");
  const backdrop = document.getElementById("modal-backdrop");
  const closeModal = document.getElementById("close-modal");
  const actionBtn = document.getElementById("auth-action-btn");
  const toggleLink = document.getElementById("toggle-auth-mode");
  const modalTitle = document.getElementById("modal-title");
  const emailInput = document.getElementById("auth-email");
  const passwordInput = document.getElementById("auth-password");
  const switchText = document.getElementById("auth-switch-text");
  const userDisplayEls = document.querySelectorAll(".user-display-name");
  const profileImgs = document.querySelectorAll(".profile-avatar");

  let isLogin = true;

  function openModal() {
    modal.style.display = "block";
    backdrop.classList.add("show");
  }

  function closeModalHandler() {
    modal.style.display = "none";
    backdrop.classList.remove("show");
    emailInput.value = "";
    passwordInput.value = "";
  }

  toggleLink.addEventListener("click", (e) => {
    e.preventDefault();
    isLogin = !isLogin;
    modalTitle.textContent = isLogin ? "Login" : "Sign Up";
    actionBtn.textContent = isLogin ? "Login" : "Sign Up";
    switchText.textContent = isLogin ? "Don't have an account? " : "Already have an account? ";
    toggleLink.textContent = isLogin ? "Sign up" : "Login";
  });

  closeModal.addEventListener("click", closeModalHandler);
  backdrop.addEventListener("click", closeModalHandler);

  actionBtn.addEventListener("click", async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Logged in!");
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Account created!");
      }
      closeModalHandler();
    } catch (err) {
      console.error("Auth error:", err);
      alert(err.message || "Authentication failed.");
    }
  });

  loginBtn.addEventListener("click", async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        await signOut(auth);
        alert("Logged out.");
        window.location.href = "loader.html";
      } catch (err) {
        console.error("Logout error:", err);
        alert("Logout failed.");
      }
    } else {
      openModal();
    }
  });

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const username = user.email.split("@")[0];
      userDisplayEls.forEach((el) => (el.textContent = username));
      profileImgs.forEach((img) => {
        img.src = user.photoURL || "https://randomuser.me/api/portraits/men/75.jpg";
        img.alt = `${username}'s profile picture`;
      });
      loginBtn.textContent = "Logout";
    } else {
      userDisplayEls.forEach((el) => (el.textContent = "Guest"));
      profileImgs.forEach((img) => {
        img.src = "https://randomuser.me/api/portraits/men/75.jpg";
        img.alt = "Guest";
      });
      loginBtn.textContent = "Login";
    }
  });
});
