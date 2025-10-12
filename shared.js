// Shared utilities for Book Haven Bookstore
// This file contains common functionality used across multiple pages

// Sidebar functionality
function toggleMenu() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  
  if (sidebar && overlay) {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    
    // Prevent body scroll when sidebar is open
    if (sidebar.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
}

// Enhanced email subscription handler
function createSubscriptionHandler(emailInputId, subscribeBtnClass) {
  const emailInput = document.getElementById(emailInputId);
  const subscribeBtn = document.querySelector(subscribeBtnClass);

  if (!emailInput || !subscribeBtn) {
    console.warn('Subscription elements not found:', { emailInputId, subscribeBtnClass });
    return;
  }

  function handleSubscription(event) {
    event.preventDefault();
    const email = emailInput.value.trim();

    if (email === "") {
      showNotification("Please enter your email address.", 'error');
      emailInput.focus();
      return;
    }

    // Enhanced email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showNotification("Please enter a valid email address.", 'error');
      emailInput.focus();
      return;
    }

    // Simulate subscription process
    subscribeBtn.textContent = 'Subscribing...';
    subscribeBtn.disabled = true;

    setTimeout(() => {
      showNotification(`Thank you for subscribing with ${email}!`, 'success');
      emailInput.value = "";
      subscribeBtn.textContent = 'Subscribe';
      subscribeBtn.disabled = false;
    }, 1000);
  }

  // Event listeners
  subscribeBtn.addEventListener('click', handleSubscription);
  emailInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubscription(event);
    }
  });
}

// Notification system
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 8px;
    color: white;
    font-weight: 600;
    z-index: 10000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    max-width: 300px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  `;

  // Set background color based on type
  switch (type) {
    case 'success':
      notification.style.backgroundColor = '#10b981';
      break;
    case 'error':
      notification.style.backgroundColor = '#ef4444';
      break;
    default:
      notification.style.backgroundColor = '#3b82f6';
  }

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Keyboard navigation support
function addKeyboardSupport() {
  // Close sidebar when pressing Escape key
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      const sidebar = document.getElementById('sidebar');
      if (sidebar && sidebar.classList.contains('active')) {
        toggleMenu();
      }
    }
  });

  // Hamburger menu keyboard support
  const hamburgerMenu = document.getElementById('hamburgerMenu');
  if (hamburgerMenu) {
    hamburgerMenu.addEventListener('keypress', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleMenu();
      }
    });
  }

  // Close sidebar when clicking on overlay
  const overlay = document.getElementById('sidebarOverlay');
  if (overlay) {
    overlay.addEventListener('click', toggleMenu);
  }
}

// Fix social media links to prevent page reloads
function fixSocialMediaLinks() {
  const socialLinks = document.querySelectorAll('footer a[href="#"]');
  
  socialLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Get the social media platform name
      const platform = this.textContent.trim().toLowerCase();
      
      // Show a notification instead of navigating
      showNotification(`Coming soon! Follow us on ${platform.charAt(0).toUpperCase() + platform.slice(1)} for updates.`, 'info');
    });
    
    // Add visual feedback
    link.style.cursor = 'pointer';
    link.title = `Follow Book Haven on ${link.textContent.trim()}`;
  });
}

// Initialize common functionality
document.addEventListener('DOMContentLoaded', function() {
  addKeyboardSupport();
  
  // Initialize subscription handlers for different pages
  const subscriptionConfigs = [
    { emailInputId: 'newsletter-email', subscribeBtnClass: '.subscribe-button' },
    { emailInputId: 'newsletter-email-about', subscribeBtnClass: '.subscribe-button' },
    { emailInputId: 'newsletter-email-custom', subscribeBtnClass: '.subscribe-button' },
    { emailInputId: 'subscribe-email', subscribeBtnClass: '.subscribe-button' }
  ];

  subscriptionConfigs.forEach(config => {
    createSubscriptionHandler(config.emailInputId, config.subscribeBtnClass);
  });
  
  // Fix social media links
  fixSocialMediaLinks();
});

// Export functions for use in other files
window.BookHavenUtils = {
  toggleMenu,
  showNotification,
  createSubscriptionHandler
};
