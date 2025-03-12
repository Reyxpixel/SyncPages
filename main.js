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
  createManualCharts()
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

    // Handle form submission
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

      // Create form data
      const formData = new FormData(contactForm)

      // Submit the form using fetch
      fetch(contactForm.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            // Show success message
            showFormSuccess(`Thank you for your interest in our ${plan} plan! We'll contact you soon.`)

            // Launch confetti
            launchConfetti()

            // Reset form
            contactForm.reset()

            // Remove active class from all inputs
            formInputs.forEach((input) => {
              input.parentElement.classList.remove("input-active")
            })
          } else {
            throw new Error("Form submission failed")
          }
        })
        .catch((error) => {
          showFormError("There was a problem submitting your form. Please try again.")
          console.error("Error:", error)
        })
    })
  }
}

// Launch confetti animation
function launchConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ["#0099ff", "#ffffff", "#00c16a"],
  })

  // Add more confetti after a delay
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ["#0099ff", "#ffffff", "#00c16a"],
    })
  }, 250)

  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ["#0099ff", "#ffffff", "#00c16a"],
    })
  }, 400)
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

// Create manual charts
function createManualCharts() {
  // Create Sales Growth Chart
  const salesChart = document.getElementById("salesChartManual")
  if (salesChart) {
    // Clear any existing content first
    salesChart.innerHTML = ""

    // Create line chart with bars to represent data points
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const withWebsiteData = [10, 25, 45, 70, 90, 120, 150, 180, 210, 250, 280, 320]
    const withoutWebsiteData = [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65]

    // Find max value for scaling
    const maxValue = Math.max(...withWebsiteData)

    // Determine how many months to show based on screen width
    const isMobile = window.innerWidth < 768
    const monthsToShow = isMobile ? months.filter((_, i) => i % 3 === 0) : months
    const dataIndices = isMobile ? [0, 3, 6, 9, 11] : [...Array(months.length).keys()]

    // Create data points for selected indices only
    dataIndices.forEach((index) => {
      // With website data point
      const withWebsiteHeight = (withWebsiteData[index] / maxValue) * 70

      const withWebsitePoint = document.createElement("div")
      withWebsitePoint.className = "data-point"
      withWebsitePoint.style.position = "absolute"
      withWebsitePoint.style.bottom = `${withWebsiteHeight + 30}px`
      withWebsitePoint.style.left = `${(index / (months.length - 1)) * 100}%`
      withWebsitePoint.style.width = "8px"
      withWebsitePoint.style.height = "8px"
      withWebsitePoint.style.backgroundColor = "rgba(0, 153, 255, 0.8)"
      withWebsitePoint.style.borderRadius = "50%"
      withWebsitePoint.style.transform = "translate(-50%, 50%)"
      withWebsitePoint.style.zIndex = "2"
      withWebsitePoint.title = `${months[index]}: ${withWebsiteData[index]}`
      salesChart.appendChild(withWebsitePoint)

      // Without website data point
      const withoutWebsiteHeight = (withoutWebsiteData[index] / maxValue) * 70
      const withoutWebsitePoint = document.createElement("div")
      withoutWebsitePoint.className = "data-point"
      withoutWebsitePoint.style.position = "absolute"
      withoutWebsitePoint.style.bottom = `${withoutWebsiteHeight + 30}px`
      withoutWebsitePoint.style.left = `${(index / (months.length - 1)) * 100}%`
      withoutWebsitePoint.style.width = "8px"
      withoutWebsitePoint.style.height = "8px"
      withoutWebsitePoint.style.backgroundColor = "rgba(0, 102, 204, 0.7)"
      withoutWebsitePoint.style.borderRadius = "50%"
      withoutWebsitePoint.style.transform = "translate(-50%, 50%)"
      withoutWebsitePoint.style.zIndex = "2"
      withoutWebsitePoint.title = `${months[index]}: ${withoutWebsiteData[index]}`
      salesChart.appendChild(withoutWebsitePoint)

      // Add month label for selected months only
      if (isMobile ? true : index % 2 === 0) {
        const monthLabel = document.createElement("div")
        monthLabel.className = "month-label"
        monthLabel.textContent = months[index]
        monthLabel.style.position = "absolute"
        monthLabel.style.bottom = "10px"
        monthLabel.style.left = `${(index / (months.length - 1)) * 100}%`
        monthLabel.style.transform = "translateX(-50%)"
        monthLabel.style.fontSize = isMobile ? "0.65rem" : "0.75rem"
        monthLabel.style.color = "var(--muted)"
        salesChart.appendChild(monthLabel)
      }
    })
  }

  // Create Traffic Chart (Bar Chart)
  const trafficChart = document.getElementById("trafficChartManual")
  if (trafficChart) {
    // Clear any existing content
    trafficChart.innerHTML = ""

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    const trafficData = [1200, 1900, 1700, 2100, 2300, 1500, 1300]

    // Find max value for scaling
    const maxValue = Math.max(...trafficData)

    // Check if mobile
    const isMobile = window.innerWidth < 768
    const barWidth = isMobile ? "30px" : "40px"

    // Create bars
    days.forEach((day, index) => {
      const barHeight = (trafficData[index] / maxValue) * 80
      const bar = document.createElement("div")
      bar.className = "bar"
      bar.style.height = `${barHeight}%`
      bar.style.width = barWidth
      bar.title = `${day}: ${trafficData[index]} visitors`

      // Add value label on top of bar
      const valueLabel = document.createElement("div")
      valueLabel.textContent = isMobile ? (trafficData[index] / 1000).toFixed(1) + "k" : trafficData[index]
      valueLabel.style.position = "absolute"
      valueLabel.style.top = "-25px"
      valueLabel.style.left = "50%"
      valueLabel.style.transform = "translateX(-50%)"
      valueLabel.style.fontSize = isMobile ? "0.65rem" : "0.75rem"
      valueLabel.style.color = "var(--muted-light)"
      bar.appendChild(valueLabel)

      trafficChart.appendChild(bar)
    })
  }
}

// Add window resize event to redraw charts when screen size changes
window.addEventListener("resize", () => {
  // Debounce the resize event
  clearTimeout(window.resizeTimer)
  window.resizeTimer = setTimeout(() => {
    createManualCharts()
  }, 250)
})

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

