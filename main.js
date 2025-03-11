import { Chart } from "@/components/ui/chart"
// DOM Elements
const header = document.getElementById("header")
const mobileMenuToggle = document.querySelector(".mobile-menu-toggle")
const mobileMenu = document.querySelector(".mobile-menu")
const contactForm = document.getElementById("contact-form")
const planSelect = document.getElementById("plan")

// Initialize the site
document.addEventListener("DOMContentLoaded", () => {
  initScrollEffects()
  initMobileMenu()
  initPlanSelection()
  initContactForm()
  initAnimations()
  initCharts()
})

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
          updateMobileMenuIcon(false)
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
    const isActive = mobileMenu.classList.toggle("active")
    updateMobileMenuIcon(isActive)
  })
}

// Update mobile menu icon
function updateMobileMenuIcon(isActive) {
  const icon = mobileMenuToggle.querySelector("i")
  if (isActive) {
    icon.classList.remove("fa-bars")
    icon.classList.add("fa-times")
  } else {
    icon.classList.remove("fa-times")
    icon.classList.add("fa-bars")
  }
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

      // Add a subtle pulse animation to the form
      if (contactForm) {
        contactForm.classList.add("pulse")
        setTimeout(() => {
          contactForm.classList.remove("pulse")
        }, 1000)
      }
    })
  })
}

// Contact Form
function initContactForm() {
  if (contactForm) {
    // Add focus and blur event listeners to form inputs
    const formInputs = contactForm.querySelectorAll("input, select, textarea")

    formInputs.forEach((input) => {
      // Add active class to parent when input is focused
      input.addEventListener("focus", () => {
        input.parentElement.classList.add("input-active")
      })

      // Remove active class when input loses focus
      input.addEventListener("blur", () => {
        if (!input.value) {
          input.parentElement.classList.remove("input-active")
        }
      })

      // Check if input has value on load
      if (input.value) {
        input.parentElement.classList.add("input-active")
      }
    })

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Basic form validation
      const name = document.getElementById("name").value
      const email = document.getElementById("email").value
      const plan = document.getElementById("plan").value

      if (!name || !email) {
        showFormError("Please fill in all required fields.")
        return
      }

      // In a real implementation, you would send this data to your server
      // For this demo, we'll just show a success message
      showFormSuccess(`Thank you for your interest in our ${plan} plan! We'll contact you soon.`)

      // Reset form
      contactForm.reset()

      // Remove active class from all inputs
      formInputs.forEach((input) => {
        input.parentElement.classList.remove("input-active")
      })
    })
  }
}

// Show form error message
function showFormError(message) {
  const errorDiv = document.createElement("div")
  errorDiv.className = "form-error"
  errorDiv.textContent = message
  errorDiv.style.color = "var(--danger)"
  errorDiv.style.marginBottom = "1rem"
  errorDiv.style.padding = "0.75rem 1rem"
  errorDiv.style.borderRadius = "var(--radius)"
  errorDiv.style.backgroundColor = "rgba(255, 51, 102, 0.1)"
  errorDiv.style.border = "1px solid rgba(255, 51, 102, 0.2)"
  errorDiv.style.fontSize = "0.9375rem"

  // Remove any existing error messages
  const existingError = contactForm.querySelector(".form-error")
  if (existingError) {
    existingError.remove()
  }

  // Add the error message to the top of the form
  contactForm.prepend(errorDiv)
}

// Show form success message
function showFormSuccess(message) {
  const successDiv = document.createElement("div")
  successDiv.className = "form-success"
  successDiv.textContent = message
  successDiv.style.color = "var(--success)"
  successDiv.style.marginBottom = "1rem"
  successDiv.style.padding = "0.75rem 1rem"
  successDiv.style.borderRadius = "var(--radius)"
  successDiv.style.backgroundColor = "rgba(0, 193, 106, 0.1)"
  successDiv.style.border = "1px solid rgba(0, 193, 106, 0.2)"
  successDiv.style.fontSize = "0.9375rem"

  // Remove any existing messages
  const existingMessage = contactForm.querySelector(".form-success, .form-error")
  if (existingMessage) {
    existingMessage.remove()
  }

  // Add the success message to the top of the form
  contactForm.prepend(successDiv)
}

// Animations
function initAnimations() {
  // Simple reveal animation for elements
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  }

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate")
        observer.unobserve(entry.target)
      }
    })
  }, observerOptions)

  document
    .querySelectorAll(".feature-card, .testimonial-card, .pricing-card, .analytics-card, .stat-card")
    .forEach((element) => {
      observer.observe(element)
    })
}

// Charts
function initCharts() {
  // Load Chart.js from CDN if not already loaded
  if (typeof Chart === "undefined") {
    const script = document.createElement("script")
    script.src = "https://cdn.jsdelivr.net/npm/chart.js"
    script.onload = createCharts
    document.head.appendChild(script)
  } else {
    createCharts()
  }
}

function createCharts() {
  // Set Chart.js defaults for all charts
  if (Chart.defaults) {
    Chart.defaults.color = "#aaaaaa"
    Chart.defaults.font.family = "'Inter', sans-serif"
    Chart.defaults.elements.line.borderWidth = 2
    Chart.defaults.elements.point.radius = 3
    Chart.defaults.elements.point.hoverRadius = 5
  }

  // Sales Growth Chart
  const salesCtx = document.getElementById("salesChart")
  if (salesCtx) {
    new Chart(salesCtx.getContext("2d"), {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
          {
            label: "With Website",
            data: [10, 25, 45, 70, 90, 120, 150, 180, 210, 250, 280, 320],
            backgroundColor: "rgba(0, 153, 255, 0.1)",
            borderColor: "rgba(0, 153, 255, 0.8)",
            borderWidth: 2,
            tension: 0.4,
            pointBackgroundColor: "rgba(0, 153, 255, 1)",
          },
          {
            label: "Without Website",
            data: [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65],
            backgroundColor: "rgba(100, 100, 100, 0.1)",
            borderColor: "rgba(100, 100, 100, 0.7)",
            borderWidth: 2,
            tension: 0.4,
            pointBackgroundColor: "rgba(100, 100, 100, 1)",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            mode: "index",
            intersect: false,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            titleColor: "#fff",
            bodyColor: "#fff",
            borderColor: "#333",
            borderWidth: 1,
            padding: 10,
            cornerRadius: 8,
            titleFont: {
              weight: "bold",
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(255, 255, 255, 0.05)",
            },
            ticks: {
              color: "rgba(255, 255, 255, 0.7)",
              padding: 10,
            },
          },
          x: {
            grid: {
              color: "rgba(255, 255, 255, 0.05)",
            },
            ticks: {
              color: "rgba(255, 255, 255, 0.7)",
              padding: 10,
            },
          },
        },
      },
    })
  }

  // Customer Acquisition Channels
  const channelsCtx = document.getElementById("channelsChart")
  if (channelsCtx) {
    new Chart(channelsCtx.getContext("2d"), {
      type: "doughnut",
      data: {
        labels: ["Website", "Social Media", "Referrals", "Other"],
        datasets: [
          {
            data: [65, 20, 10, 5],
            backgroundColor: [
              "rgba(0, 153, 255, 0.8)",
              "rgba(0, 193, 106, 0.8)",
              "rgba(255, 153, 0, 0.8)",
              "rgba(160, 174, 192, 0.8)",
            ],
            borderColor: [
              "rgba(0, 153, 255, 1)",
              "rgba(0, 193, 106, 1)",
              "rgba(255, 153, 0, 1)",
              "rgba(160, 174, 192, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "70%",
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            titleColor: "#fff",
            bodyColor: "#fff",
            borderColor: "#333",
            borderWidth: 1,
            padding: 10,
            cornerRadius: 8,
          },
        },
      },
    })
  }

  // Website Traffic Chart
  const trafficCtx = document.getElementById("trafficChart")
  if (trafficCtx) {
    new Chart(trafficCtx.getContext("2d"), {
      type: "bar",
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "Visitors",
            data: [1200, 1900, 1700, 2100, 2300, 1500, 1300],
            backgroundColor: "rgba(0, 153, 255, 0.8)",
            borderColor: "rgba(0, 153, 255, 1)",
            borderWidth: 0,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            titleColor: "#fff",
            bodyColor: "#fff",
            borderColor: "#333",
            borderWidth: 1,
            padding: 10,
            cornerRadius: 8,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(255, 255, 255, 0.05)",
            },
            ticks: {
              color: "rgba(255, 255, 255, 0.7)",
              padding: 10,
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: "rgba(255, 255, 255, 0.7)",
              padding: 10,
            },
          },
        },
      },
    })
  }
}

// Helper function to animate elements when they come into view
function animateOnScroll() {
  const elements = document.querySelectorAll(
    ".feature-card, .testimonial-card, .pricing-card, .analytics-card, .stat-card",
  )

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

