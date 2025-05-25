document.addEventListener("DOMContentLoaded", function () {
  console.log("JavaScript loaded!");

  if (typeof firebase === "undefined") {
    console.error("Firebase SDK not found!");
    return;
  }

  const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
  };

  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();

  console.log("Firebase initialized successfully!");

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
  let isLogin = true;

  function openModal() {
    modal.style.display = "block";
    backdrop.classList.add("show");
  }

  function closeModalHandler() {
    backdrop.classList.remove("show");
    modal.style.display = "none";
    emailInput.value = "";
    passwordInput.value = "";
  }

  toggleLink.addEventListener("click", (e) => {
    e.preventDefault();
    isLogin = !isLogin;
    modalTitle.textContent = isLogin ? "Login" : "Sign Up";
    actionBtn.textContent = isLogin ? "Login" : "Sign Up";
    toggleLink.textContent = isLogin ? "Sign up" : "Login";
    switchText.textContent = isLogin ? "Don't have an account? " : "Already have an account? ";
  });

  // Modal Close Events
  closeModal.addEventListener("click", closeModalHandler);
  backdrop.addEventListener("click", closeModalHandler);

  // Authentication Action (Login or Signup)
  actionBtn.addEventListener("click", async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      let userCredential;
      if (isLogin) {
        userCredential = await auth.signInWithEmailAndPassword(email, password);
        alert("Login Successful!");
      } else {
        userCredential = await auth.createUserWithEmailAndPassword(email, password);
        alert("Account created!");

        const user = userCredential.user;
        await db.collection("users").doc(user.uid).set({
          username: email.split("@")[0],
          profilePic: "https://images.unsplash.com/photo-1715889680244-869181c961e8?w=600"
        });
      }
      closeModalHandler();
    } catch (error) {
      console.error("Authentication error:", error);
      alert(error.message || "Authentication failed.");
    }
  });

  // Login/Logout Button Click
  loginBtn.addEventListener("click", async () => {
    const user = auth.currentUser;

    if (user) {
      try {
        await auth.signOut();
        alert("Logged out successfully.");
        window.location.href = "loader.html";
      } catch (error) {
        console.error("Logout error:", error);
        alert("Error logging out.");
      }
    } else {
      openModal();
    }
  });

  // Update UI When Auth State Changes
  auth.onAuthStateChanged((user) => {
    if (user) {
      loginBtn.textContent = "Logout";
      const username = user.email.split("@")[0];

      document.querySelectorAll('.user-display-name').forEach(el => el.textContent = username);
      document.querySelectorAll('.profile-avatar').forEach(el => {
        el.src = user.photoURL || "fallback.png";
        el.alt = `${username}'s profile picture`;
      });
    } else {
      document.querySelectorAll('.user-display-name').forEach(el => el.textContent = "Guest");
      loginBtn.textContent = "Login";
    }
  });

  console.log("Authentication system fully functional!");
});
