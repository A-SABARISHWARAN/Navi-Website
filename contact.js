// Contact Form Handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const API_URL = 'http://localhost:3000/api/contact'; // Update for production
    
    if (contactForm) {
        // Form validation
        const validateForm = () => {
            let isValid = true;
            const errors = {};
            
            // Name validation
            const nameInput = document.getElementById('name');
            if (!nameInput.value.trim()) {
                errors.name = 'Name is required';
                isValid = false;
            }
            
            // Email validation
            const emailInput = document.getElementById('email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput.value.trim()) {
                errors.email = 'Email is required';
                isValid = false;
            } else if (!emailRegex.test(emailInput.value)) {
                errors.email = 'Please enter a valid email address';
                isValid = false;
            }
            
            // Phone validation (optional)
            const phoneInput = document.getElementById('phone');
            if (phoneInput.value.trim()) {
                const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
                if (!phoneRegex.test(phoneInput.value.replace(/\s/g, ''))) {
                    errors.phone = 'Please enter a valid phone number';
                    isValid = false;
                }
            }
            
            // Inquiry type validation
            const inquiryTypeInput = document.getElementById('inquiryType');
            if (!inquiryTypeInput.value) {
                errors.inquiryType = 'Please select an inquiry type';
                isValid = false;
            }
            
            // Message validation
            const messageInput = document.getElementById('message');
            if (!messageInput.value.trim()) {
                errors.message = 'Message is required';
                isValid = false;
            } else if (messageInput.value.trim().length < 10) {
                errors.message = 'Message must be at least 10 characters';
                isValid = false;
            }
            
            // Privacy checkbox validation
            const privacyInput = document.getElementById('privacy');
            if (!privacyInput.checked) {
                errors.privacy = 'You must agree to the privacy policy';
                isValid = false;
            }
            
            // Display errors
            Object.keys(errors).forEach(field => {
                const errorElement = document.getElementById(`${field}Error`);
                if (errorElement) {
                    errorElement.textContent = errors[field];
                    errorElement.style.display = 'block';
                }
            });
            
            // Clear previous errors
            const allErrorElements = document.querySelectorAll('.error-message');
            allErrorElements.forEach(element => {
                if (!Object.keys(errors).includes(element.id.replace('Error', ''))) {
                    element.textContent = '';
                    element.style.display = 'none';
                }
            });
            
            return isValid;
        };
        
        // Clear errors on input
        contactForm.querySelectorAll('input, textarea, select').forEach(element => {
            element.addEventListener('input', () => {
                const fieldName = element.id;
                const errorElement = document.getElementById(`${fieldName}Error`);
                if (errorElement) {
                    errorElement.textContent = '';
                    errorElement.style.display = 'none';
                }
            });
        });
        
        // Form submission
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Hide previous messages
            document.getElementById('successMessage').style.display = 'none';
            document.getElementById('errorMessage').style.display = 'none';
            
            // Validate form
            if (!validateForm()) {
                return;
            }
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const submitText = document.getElementById('submitText');
            const loadingSpinner = document.getElementById('loadingSpinner');
            
            submitBtn.disabled = true;
            submitText.textContent = 'Sending...';
            loadingSpinner.style.display = 'inline-block';
            
            try {
                // Prepare form data
                const formData = new FormData(contactForm);
                const data = Object.fromEntries(formData.entries());
                
                // Send to backend
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (response.ok && result.success) {
                    // Success
                    contactForm.reset();
                    document.getElementById('successMessage').style.display = 'flex';
                    
                    // Scroll to success message
                    document.getElementById('successMessage').scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                    
                    // Add to performance metrics
                    if (window.perfMonitor) {
                        window.perfMonitor.mark('formSubmitSuccess');
                    }
                } else {
                    // API error
                    throw new Error(result.message || 'Failed to send message');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                
                // Show error message
                document.getElementById('errorMessage').style.display = 'flex';
                
                // Scroll to error
                document.getElementById('errorMessage').scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
                
                // Add to performance metrics
                if (window.perfMonitor) {
                    window.perfMonitor.mark('formSubmitError');
                }
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                submitText.textContent = 'Send Message';
                loadingSpinner.style.display = 'none';
            }
        });
        
        // Add character counter for message
        const messageInput = document.getElementById('message');
        if (messageInput) {
            const charCounter = document.createElement('div');
            charCounter.className = 'char-counter';
            charCounter.style.fontSize = '0.875rem';
            charCounter.style.color = 'rgba(255, 255, 255, 0.6)';
            charCounter.style.marginTop = '0.5rem';
            charCounter.style.textAlign = 'right';
            
            messageInput.parentNode.appendChild(charCounter);
            
            const updateCharCounter = () => {
                const length = messageInput.value.length;
                charCounter.textContent = `${length} characters`;
                
                if (length < 10) {
                    charCounter.style.color = '#EF4444';
                } else if (length < 50) {
                    charCounter.style.color = '#F59E0B';
                } else {
                    charCounter.style.color = '#10B981';
                }
            };
            
            messageInput.addEventListener('input', updateCharCounter);
            updateCharCounter(); // Initial update
        }
        
        // Phone input formatting
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                
                if (value.length > 0) {
                    if (value.length <= 3) {
                        value = `+${value}`;
                    } else if (value.length <= 5) {
                        value = `+${value.slice(0, 3)} (${value.slice(3)}`;
                    } else if (value.length <= 10) {
                        value = `+${value.slice(0, 3)} (${value.slice(3, 5)}) ${value.slice(5)}`;
                    } else {
                        value = `+${value.slice(0, 3)} (${value.slice(3, 5)}) ${value.slice(5, 10)}-${value.slice(10, 14)}`;
                    }
                }
                
                e.target.value = value;
            });
        }
        
        // Add form field focus animations
        const formGroups = contactForm.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            const input = group.querySelector('input, textarea, select');
            if (input) {
                input.addEventListener('focus', () => {
                    group.classList.add('focused');
                });
                
                input.addEventListener('blur', () => {
                    group.classList.remove('focused');
                });
            }
        });
    }
    
    // Add additional CSS for contact page
    const style = document.createElement('style');
    style.textContent = `
        .contact-page {
            padding-top: 100px;
            padding-bottom: var(--space-xl);
        }
        
        .contact-hero {
            text-align: center;
            margin-bottom: var(--space-xl);
        }
        
        .contact-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: var(--space-xl);
        }
        
        @media (min-width: 992px) {
            .contact-grid {
                grid-template-columns: 2fr 1fr;
            }
        }
        
        .form-group {
            margin-bottom: var(--space-md);
        }
        
        .form-group label {
            display: block;
            margin-bottom: var(--space-xs);
            font-weight: 500;
            color: var(--primary-light);
        }
        
        .form-group input,
        .form-group textarea,
        .form-group select {
            width: 100%;
            padding: var(--space-sm);
            background-color: var(--secondary-dark);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: var(--radius-md);
            color: var(--primary-light);
            font-family: var(--font-body);
            font-size: 1rem;
            transition: var(--transition-base);
        }
        
        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus {
            outline: none;
            border-color: var(--accent);
            box-shadow: 0 0 0 3px rgba(0, 112, 243, 0.1);
        }
        
        .form-group.focused input,
        .form-group.focused textarea,
        .form-group.focused select {
            border-color: var(--accent);
        }
        
        .error-message {
            color: #EF4444;
            font-size: 0.875rem;
            margin-top: var(--space-xs);
            display: none;
        }
        
        .checkbox-group {
            display: flex;
            align-items: flex-start;
            gap: var(--space-xs);
        }
        
        .checkbox-group input[type="checkbox"] {
            width: auto;
            margin-top: 4px;
        }
        
        .checkbox-group label {
            margin-bottom: 0;
            font-size: 0.875rem;
            line-height: 1.4;
        }
        
        .form-submit {
            margin-top: var(--space-lg);
        }
        
        .btn-large {
            padding: var(--space-md) var(--space-xl);
            font-size: 1.125rem;
        }
        
        .form-note {
            font-size: 0.875rem;
            color: rgba(255, 255, 255, 0.6);
            margin-top: var(--space-xs);
        }
        
        .success-message,
        .error-message-global {
            display: none;
            align-items: flex-start;
            gap: var(--space-sm);
            padding: var(--space-md);
            background-color: rgba(16, 185, 129, 0.1);
            border: 1px solid #10B981;
            border-radius: var(--radius-md);
            margin-top: var(--space-md);
        }
        
        .error-message-global {
            background-color: rgba(239, 68, 68, 0.1);
            border-color: #EF4444;
        }
        
        .success-message svg,
        .error-message-global svg {
            flex-shrink: 0;
        }
        
        .success-message h4,
        .error-message-global h4 {
            margin-bottom: var(--space-xs);
            color: #10B981;
        }
        
        .error-message-global h4 {
            color: #EF4444;
        }
        
        .info-card,
        .cta-card,
        .privacy-card {
            background-color: var(--secondary-dark);
            border-radius: var(--radius-lg);
            padding: var(--space-lg);
            margin-bottom: var(--space-md);
            border: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .info-card h3,
        .cta-card h3,
        .privacy-card h4 {
            margin-bottom: var(--space-md);
        }
        
        .info-item {
            display: flex;
            gap: var(--space-md);
            margin-bottom: var(--space-lg);
        }
        
        .info-icon {
            flex-shrink: 0;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: rgba(0, 112, 243, 0.1);
            border-radius: var(--radius-md);
        }
        
        .info-icon svg {
            stroke-width: 2;
        }
        
        .info-content h4 {
            margin-bottom: var(--space-xs);
            font-size: 1rem;
        }
        
        .info-content p {
            margin-bottom: 2px;
        }
        
        .info-note {
            font-size: 0.875rem;
            color: rgba(255, 255, 255, 0.6);
        }
        
        .btn-block {
            width: 100%;
            margin-bottom: var(--space-sm);
        }
        
        .privacy-list {
            list-style: none;
            margin: var(--space-md) 0;
        }
        
        .privacy-list li {
            position: relative;
            padding-left: var(--space-md);
            margin-bottom: var(--space-xs);
        }
        
        .privacy-list li::before {
            content: '✓';
            position: absolute;
            left: 0;
            color: var(--accent);
            font-weight: bold;
        }
        
        .privacy-link {
            color: var(--accent);
            text-decoration: none;
            font-weight: 500;
            transition: var(--transition-fast);
        }
        
        .privacy-link:hover {
            text-decoration: underline;
        }
    `;
    document.head.appendChild(style);
});