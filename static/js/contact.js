// Contact Form Validation and Submission
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const successMessage = document.getElementById('success-message');
    const messageTextarea = document.getElementById('message');
    const characterCounter = document.querySelector('.character-counter');
    
    // Form fields
    const formFields = {
        firstName: document.getElementById('first-name'),
        lastName: document.getElementById('last-name'),
        email: document.getElementById('email'),
        phone: document.getElementById('phone'),
        subject: document.getElementById('subject'),
        message: document.getElementById('message'),
        consent: document.getElementById('consent')
    };

    // Character counter for message field
    messageTextarea.addEventListener('input', function() {
        const length = this.value.length;
        const maxLength = 500;
        const minLength = 10;
        
        characterCounter.textContent = `${length}/${maxLength}`;
        
        // Update counter color based on length
        characterCounter.classList.remove('warning', 'error');
        if (length > maxLength * 0.9) {
            characterCounter.classList.add('error');
        } else if (length > maxLength * 0.7) {
            characterCounter.classList.add('warning');
        }
        
        // Prevent typing beyond max length
        if (length > maxLength) {
            this.value = this.value.substring(0, maxLength);
            characterCounter.textContent = `${maxLength}/${maxLength}`;
        }
    });

    // Real-time validation
    Object.keys(formFields).forEach(key => {
        const field = formFields[key];
        if (field && field.type !== 'checkbox') {
            field.addEventListener('blur', function() {
                validateField(field);
            });
            
            field.addEventListener('input', function() {
                // Clear error message on input
                const errorMsg = field.parentElement.querySelector('.form-error-message');
                if (errorMsg) {
                    errorMsg.classList.remove('show');
                }
                field.classList.remove('invalid');
            });
        }
    });

    // Field validation function
    function validateField(field) {
        const errorMsg = field.parentElement.querySelector('.form-error-message');
        let isValid = true;
        
        // Remove previous states
        field.classList.remove('valid', 'invalid');
        if (errorMsg) {
            errorMsg.classList.remove('show');
        }
        
        // Check if field is required and empty
        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            if (errorMsg) {
                errorMsg.classList.add('show');
            }
            field.classList.add('invalid');
            return false;
        }
        
        // Specific validations
        switch(field.type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (field.value && !emailRegex.test(field.value)) {
                    isValid = false;
                    if (errorMsg) {
                        errorMsg.textContent = 'Please enter a valid email address';
                        errorMsg.classList.add('show');
                    }
                    field.classList.add('invalid');
                }
                break;
                
            case 'tel':
                const phoneRegex = /^[\d\s\-\+\(\)]+$/;
                if (field.value && !phoneRegex.test(field.value)) {
                    isValid = false;
                    if (errorMsg) {
                        errorMsg.textContent = 'Please enter a valid phone number';
                        errorMsg.classList.add('show');
                    }
                    field.classList.add('invalid');
                }
                break;
                
            case 'textarea':
                if (field.value.length < 10) {
                    isValid = false;
                    if (errorMsg) {
                        errorMsg.classList.add('show');
                    }
                    field.classList.add('invalid');
                }
                break;
        }
        
        if (isValid && field.value.trim()) {
            field.classList.add('valid');
        }
        
        return isValid;
    }

    // Form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate all fields
        let isFormValid = true;
        const validationResults = {};
        
        Object.keys(formFields).forEach(key => {
            const field = formFields[key];
            if (field) {
                const isValid = validateField(field);
                validationResults[key] = isValid;
                if (!isValid) {
                    isFormValid = false;
                }
            }
        });
        
        // Special validation for checkbox
        if (!formFields.consent.checked) {
            isFormValid = false;
            alert('Please agree to be contacted regarding your inquiry.');
            return;
        }
        
        if (!isFormValid) {
            // Scroll to first invalid field
            const firstInvalidField = contactForm.querySelector('.invalid');
            if (firstInvalidField) {
                firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstInvalidField.focus();
            }
            return;
        }
        
        // Show loading state
        submitButton.classList.add('loading');
        submitButton.disabled = true;
        
        // Simulate form submission (replace with actual submission)
        setTimeout(function() {
            // Hide loading state
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
            
            // Show success message
            successMessage.classList.remove('hidden');
            
            // Reset form
            contactForm.reset();
            characterCounter.textContent = '0/500';
            
            // Remove validation classes
            Object.keys(formFields).forEach(key => {
                const field = formFields[key];
                if (field) {
                    field.classList.remove('valid', 'invalid');
                }
            });
            
            // Scroll to success message
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Hide success message after 10 seconds
            setTimeout(function() {
                successMessage.classList.add('hidden');
            }, 10000);
            
            // In a real application, you would send the data to a server here
            console.log('Form submitted successfully:', {
                firstName: formFields.firstName.value,
                lastName: formFields.lastName.value,
                email: formFields.email.value,
                phone: formFields.phone.value,
                subject: formFields.subject.value,
                message: formFields.message.value,
                consent: formFields.consent.checked
            });
            
        }, 2000); // Simulate 2 second submission time
    });

    // Mobile menu functionality (if not already handled in main script)
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
        
        // Close mobile menu when clicking on links
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // Add smooth scroll behavior for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add hover effect for contact info items
    const contactInfoItems = document.querySelectorAll('.contact-info-item');
    contactInfoItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(4px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });

    // Add click-to-copy functionality for contact information
    const emailLink = document.querySelector('a[href^="mailto:"]');
    const phoneLink = document.querySelector('a[href^="tel:"]');
    
    if (emailLink) {
        emailLink.addEventListener('click', function(e) {
            // This is handled by the browser automatically for mailto links
            console.log('Email link clicked');
        });
    }
    
    if (phoneLink) {
        phoneLink.addEventListener('click', function(e) {
            // This is handled by the browser automatically for tel links
            console.log('Phone link clicked');
        });
    }

    // Form field focus animations
    Object.keys(formFields).forEach(key => {
        const field = formFields[key];
        if (field && field.type !== 'checkbox') {
            field.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            field.addEventListener('blur', function() {
                this.parentElement.classList.remove('focused');
            });
        }
    });

    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // Escape key closes mobile menu
        if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
        }
        
        // Enter key on form submit button when form is valid
        if (e.key === 'Enter' && e.target === submitButton && !submitButton.disabled) {
            contactForm.dispatchEvent(new Event('submit'));
        }
    });

    console.log('Contact page functionality loaded successfully');
});
