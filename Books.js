// Page-specific functionality for about.html
// Shared functionality is now handled by shared.js

document.addEventListener('DOMContentLoaded', function() {
    // Page-specific initialization for about.html
    console.log('About page script loaded');
    
    // Contact form functionality
    const contactForm = document.getElementById('feedback-form');
    const submitButton = contactForm?.querySelector('button[type="submit"]');
    const clearButton = contactForm?.querySelector('button[type="reset"]');
    
    if (contactForm && submitButton) {
        // Handle form submission
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('customer-name');
            const email = formData.get('contact-email');
            const phone = formData.get('phone');
            const message = formData.get('message');
            const customOrder = formData.get('custom-order');
            
            // Basic validation
            if (!name || !email || !message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Show loading state
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                // Reset button
                submitButton.disabled = false;
                submitButton.textContent = 'Send Message';
                
                // Show success message
                showNotification('Thank you! Your message has been sent successfully. We\'ll get back to you soon.', 'success');
                
                // Clear form
                contactForm.reset();
                
                // Log form data (for development)
                console.log('Form submitted:', {
                    name,
                    email,
                    phone,
                    message,
                    customOrder: customOrder ? 'Yes' : 'No'
                });
            }, 1500);
        });
    }
    
    if (clearButton) {
        // Handle clear form
        clearButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Confirm before clearing
            if (confirm('Are you sure you want to clear all form fields?')) {
                contactForm.reset();
                showNotification('Form cleared successfully.', 'info');
            }
        });
    }
    
    // Add form field validation on blur
    const requiredFields = contactForm?.querySelectorAll('input[required], textarea[required]');
    requiredFields?.forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });
        
        field.addEventListener('input', function() {
            // Remove error styling as user types
            this.style.borderColor = '';
            this.style.boxShadow = '';
        });
    });
    
    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.getAttribute('name') || field.getAttribute('id');
        
        if (field.hasAttribute('required') && !value) {
            showFieldError(field, `${getFieldLabel(fieldName)} is required.`);
            return false;
        }
        
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showFieldError(field, 'Please enter a valid email address.');
                return false;
            }
        }
        
        clearFieldError(field);
        return true;
    }
    
    function showFieldError(field, message) {
        field.style.borderColor = '#ef4444';
        field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.style.color = '#ef4444';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.25rem';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }
    
    function clearFieldError(field) {
        field.style.borderColor = '';
        field.style.boxShadow = '';
        
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }
    
    function getFieldLabel(fieldName) {
        const labels = {
            'customer-name': 'Name',
            'contact-email': 'Email',
            'phone': 'Phone',
            'message': 'Message'
        };
        return labels[fieldName] || fieldName;
    }
});