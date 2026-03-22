// Set the time element to current date and time in WAT
function updatePostDate() {
  const timeElem = document.querySelector("time");
  if (!timeElem) return;
  const now = new Date();
  // datetime in ISO format (YYYY-MM-DDTHH:MM:SSZ)
  timeElem.setAttribute("datetime", now.toISOString());
  // human-readable text in WAT (Africa/Lagos)
  const options = {
    timeZone: "Africa/Lagos",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  timeElem.textContent = now.toLocaleString("en-US", options);
}

// Detect and apply system theme preference
function safeLocalStorageGet(key) {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    console.warn("localStorage get failed", e);
    return null;
  }
}

function safeLocalStorageSet(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.warn("localStorage set failed", e);
  }
}

function initializeTheme() {
  const savedTheme = safeLocalStorageGet("theme");

  if (savedTheme) {
    // User has made a choice before - respect it
    if (savedTheme === "dark-mode") {
      document.body.classList.add("dark-mode");
    }
  } else {
    // First visit - detect system preference
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    if (prefersDark) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark-mode");
    } else {
      localStorage.setItem("theme", "light");
    }
  }

  updateThemeToggleIcon();
  listenForSystemThemeChanges();
}

// Listen for system theme changes and update if no user preference saved
function listenForSystemThemeChanges() {
  const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");

  darkModeQuery.addEventListener("change", (e) => {
    const savedTheme = localStorage.getItem("theme");

    // Only auto-update if user hasn't manually set a theme
    if (!savedTheme) {
      if (e.matches) {
        document.body.classList.add("dark-mode");
      } else {
        document.body.classList.remove("dark-mode");
      }
    }
  });
}

updatePostDate();
initializeTheme();

// Theme toggle functionality
const themeToggle = document.getElementById("theme-toggle");
if (themeToggle) {
  themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    safeLocalStorageSet("theme", isDark ? "dark-mode" : "light");
    updateThemeToggleIcon();
  });
} else {
  console.log("Theme toggle button not found");
}

// Hamburger and menu toggle functionality
const hamburger = document.getElementById("hamburger");
const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.querySelector(".nav-menu");
const dropdowns = document.querySelectorAll(".dropdown");

console.log("Elements found:", {
  hamburger,
  menuToggle,
  navMenu,
  dropdownsLength: dropdowns.length,
});

function toggleMobileMenu() {
  console.log("toggleMobileMenu called");
  console.log("hamburger:", hamburger);
  console.log("navMenu:", navMenu);
  if (!navMenu || !hamburger) {
    console.log("Missing elements, returning");
    return;
  }
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
  console.log("After toggle - hamburger classes:", hamburger.className);
  console.log("After toggle - navMenu classes:", navMenu.className);
}

if (hamburger) {
  hamburger.addEventListener("click", toggleMobileMenu);
  console.log("Hamburger event listener added");
}

if (menuToggle) {
  menuToggle.addEventListener("click", toggleMobileMenu);
  console.log("Menu toggle event listener added");
}

// Close menu when a link is clicked
const navLinks = document.querySelectorAll(".nav-menu a");
navLinks.forEach((link) => {
  link.addEventListener("click", function () {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
  });
});

// Dropdown toggle for mobile
dropdowns.forEach((dropdown) => {
  const link = dropdown.querySelector("a");
  if (link) {
    link.addEventListener("click", function (e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        dropdown.classList.toggle("active");
      }
    });
  }
});

// Add click event to cta-button to scroll to #about
const ctaButton = document.querySelector(".cta-button");
if (ctaButton) {
  ctaButton.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent any default behavior
    const aboutSection = document.querySelector("#about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  });
}

// Blog category filter buttons
const filterButtons = document.querySelectorAll(".filter-btn");
const blogCards = document.querySelectorAll(".blog-card");

function setActiveFilter(button) {
  filterButtons.forEach((btn) => btn.classList.remove("active"));
  button.classList.add("active");
}

function applyFilter(category) {
  blogCards.forEach((card) => {
    const cardCategory = card.dataset.category;
    if (category === "all" || cardCategory === category) {
      card.classList.remove("filtered-out");
    } else {
      card.classList.add("filtered-out");
    }
  });
}

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const filter = btn.dataset.filter;
    setActiveFilter(btn);
    applyFilter(filter);
  });
});

// Set default active filter
if (filterButtons.length) {
  setActiveFilter(filterButtons[0]);
}

// Scroll progress bar
const progressBar = document.getElementById("progress-bar");
function updateProgressBar() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = `${Math.min(100, Math.max(0, pct))}%`;
}

window.addEventListener("scroll", updateProgressBar);
window.addEventListener("resize", updateProgressBar);
updateProgressBar();

// Newsletter modal
const modal = document.getElementById("newsletter-modal");
const closeBtn = document.querySelector(".close-btn");

function showModal() {
  const lastClosed = localStorage.getItem("modalClosed");
  if (lastClosed) {
    const timeDiff = Date.now() - parseInt(lastClosed);
    const hours24 = 24 * 60 * 60 * 1000;
    if (timeDiff < hours24) return;
  }
  setTimeout(() => {
    modal.classList.remove("modal-hidden");
  }, 10000);
}

function closeModal() {
  modal.classList.add("modal-hidden");
  localStorage.setItem("modalClosed", Date.now().toString());
}

closeBtn.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

showModal();

// Read more toggle
document.querySelectorAll(".read-more").forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const card = this.closest(".blog-card");
    const extra = card.querySelector(".extra-content");
    if (extra.style.display === "none" || extra.style.display === "") {
      extra.style.display = "block";
      this.textContent = "Read Less";
    } else {
      extra.style.display = "none";
      this.textContent = "Read More";
    }
  });
});

function updateThemeToggleIcon() {
  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.textContent = document.body.classList.contains("dark-mode")
      ? "☀️"
      : "🌙";
  }
}
