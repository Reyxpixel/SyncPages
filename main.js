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

// Create Sales Growth Chart
function createSalesChart() {
  const salesChart = document.getElementById("salesChartManual");
  if (!salesChart) return;

  // Clear any existing content
  salesChart.innerHTML = "";

  // Simplified data with 5 months
  const months = ["Jan", "Mar", "Jun", "Sep", "Dec"];
  const data = [45, 65, 82, 91, 100];
  const maxValue = Math.max(...data);

  // Calculate chart dimensions
  const chartWidth = salesChart.offsetWidth;
  const chartHeight = salesChart.offsetHeight;
  const padding = 40; // Padding from edges
  const usableWidth = chartWidth - (padding * 2);

  // Create connecting lines first (so they appear behind points)
  for (let i = 0; i < months.length - 1; i++) {
    const startX = padding + (i * (usableWidth / (months.length - 1)));
    const endX = padding + ((i + 1) * (usableWidth / (months.length - 1)));
    const startY = (1 - data[i] / maxValue) * (chartHeight - 60) + 30;
    const endY = (1 - data[i + 1] / maxValue) * (chartHeight - 60) + 30;

    const line = document.createElement("div");
    line.className = "data-line";
    const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
    const angle = Math.atan2(endY - startY, endX - startX);

    line.style.width = `${length}px`;
    line.style.left = `${startX}px`;
    line.style.top = `${startY}px`;
    line.style.transform = `rotate(${angle}rad)`;
    line.style.transformOrigin = "left center";
    salesChart.appendChild(line);
  }

  // Create data points and labels
  months.forEach((month, i) => {
    const x = padding + (i * (usableWidth / (months.length - 1)));
    const y = (1 - data[i] / maxValue) * (chartHeight - 60) + 30;
    
    // Create point
    const point = document.createElement("div");
    point.className = "data-point";
    point.style.left = `${x}px`;
    point.style.top = `${y}px`;
    point.title = `${month}: ${data[i]}%`;
    salesChart.appendChild(point);

    // Create label
    const label = document.createElement("div");
    label.className = "month-label";
    label.textContent = month;
    label.style.left = `${x}px`;
    salesChart.appendChild(label);
  });
}

// Create Traffic Chart
function createTrafficChart() {
  const trafficChart = document.getElementById("trafficChartManual");
  if (!trafficChart) return;

  // Clear any existing content
  trafficChart.innerHTML = "";

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const trafficData = [1200, 1900, 1700, 2100, 2300, 1500, 1300];
  const maxValue = Math.max(...trafficData);

  // Create container for bars and labels
  const chartContainer = document.createElement("div");
  chartContainer.style.display = "flex";
  chartContainer.style.height = "100%";
  chartContainer.style.width = "100%";
  chartContainer.style.padding = "0 20px";
  chartContainer.style.position = "relative";
  trafficChart.appendChild(chartContainer);

  // Create bars with their labels
  days.forEach((day, index) => {
    const barContainer = document.createElement("div");
    barContainer.style.flex = "1";
    barContainer.style.display = "flex";
    barContainer.style.flexDirection = "column";
    barContainer.style.alignItems = "center";
    barContainer.style.gap = "8px";
    
    // Create the bar
    const bar = document.createElement("div");
    bar.className = "bar";
    const barHeight = (trafficData[index] / maxValue) * 80;
    bar.style.height = "0";
    
    // Create value label
    const value = document.createElement("div");
    value.className = "bar-value";
    value.textContent = `${(trafficData[index] / 1000).toFixed(1)}k`;
    bar.appendChild(value);
    
    // Create day label
    const dayLabel = document.createElement("div");
    dayLabel.style.color = "var(--muted)";
    dayLabel.style.fontSize = "0.75rem";
    dayLabel.textContent = day;
    
    // Add elements to container
    barContainer.appendChild(bar);
    barContainer.appendChild(dayLabel);
    chartContainer.appendChild(barContainer);
    
    // Animate the bar height
    setTimeout(() => {
      bar.style.height = `${barHeight}%`;
    }, index * 100);
  });
}

// Initialize charts
function createManualCharts() {
  createSalesChart();
  createTrafficChart();
}

// Call charts creation on load and resize
window.addEventListener("load", createManualCharts);
window.addEventListener("resize", createManualCharts);

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

