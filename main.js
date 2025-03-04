// DOM Elements
const header = document.getElementById("header")
const themeToggle = document.getElementById("theme-toggle")
const mobileMenuToggle = document.querySelector(".mobile-menu-toggle")
const mobileMenu = document.querySelector(".mobile-menu")
const contactForm = document.getElementById("contact-form")
const planSelect = document.getElementById("plan")

// Initialize the site
document.addEventListener("DOMContentLoaded", () => {
  initTheme()
  initScrollEffects()
  initMobileMenu()
  initPlanSelection()
  initContactForm()
  initAnimations()
})

// Theme Toggle
function initTheme() {
  // Check for saved theme preference or use system preference
  const savedTheme = localStorage.getItem("theme")
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

  if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
    document.body.classList.add("dark-mode")
  }

  // Theme toggle button
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode")
    const currentTheme = document.body.classList.contains("dark-mode") ? "dark" : "light"
    localStorage.setItem("theme", currentTheme)
  })
}

// Scroll Effects
function initScrollEffects() {
  // Header scroll effect
  window.addEventListener("scroll", () => {
    if (window.scrollY > 10) {
      header.classList.add("scrolled")
    } else {
      header.classList.remove("scrolled")
    }
  })

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      if (targetId === "#") return

      const targetElement = document.querySelector(targetId)
      if (targetElement) {
        // Close mobile menu if open
        if (mobileMenu.classList.contains("active")) {
          mobileMenu.classList.remove("active")
        }

        // Scroll to target
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Account for header height
          behavior: "smooth",
        })
      }
    })
  })
}

// Mobile Menu
function initMobileMenu() {
  mobileMenuToggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("active")

    // Toggle icon
    const icon = mobileMenuToggle.querySelector("i")
    if (mobileMenu.classList.contains("active")) {
      icon.classList.remove("fa-bars")
      icon.classList.add("fa-times")
    } else {
      icon.classList.remove("fa-times")
      icon.classList.add("fa-bars")
    }
  })
}

// Plan Selection
function initPlanSelection() {
  // Set plan in contact form based on button clicked
  document.querySelectorAll("[data-plan]").forEach((button) => {
    button.addEventListener("click", () => {
      const plan = button.getAttribute("data-plan")
      if (planSelect) {
        // Find and select the option
        for (let i = 0; i < planSelect.options.length; i++) {
          if (planSelect.options[i].value === plan) {
            planSelect.selectedIndex = i
            break
          }
        }
      }
    })
  })
}

// Contact Form
function initContactForm() {
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Basic form validation
      const name = document.getElementById("name").value
      const email = document.getElementById("email").value
      const plan = document.getElementById("plan").value

      if (!name || !email) {
        alert("Please fill in all required fields.")
        return
      }

      // In a real implementation, you would send this data to your server
      // For this demo, we'll just show a success message
      alert(`Thank you for your interest in our ${plan} plan! We'll contact you soon.`)

      // Reset form
      contactForm.reset()
    })
  }
}

// Animations
function initAnimations() {
  // Simple reveal animation for elements with data-aos attribute
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  }

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("aos-animate")
        observer.unobserve(entry.target)
      }
    })
  }, observerOptions)

  document.querySelectorAll("[data-aos]").forEach((element) => {
    element.classList.add("aos-init")
    observer.observe(element)
  })
}

// Helper function to animate elements when they come into view
function animateOnScroll() {
  const elements = document.querySelectorAll(".feature-card, .testimonial-card, .pricing-card")

  elements.forEach((element) => {
    const position = element.getBoundingClientRect()

    // If element is in viewport
    if (position.top < window.innerHeight && position.bottom >= 0) {
      element.classList.add("animate")
    }
  })
}

// Call on scroll
window.addEventListener("scroll", animateOnScroll)
// Initial call
animateOnScroll()

