// Membership page functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeMembershipForm();
    initializeFormValidation();
    initializeStepAnimations();
    initializeTermsAndPrivacy();
});

// Membership form initialization
function initializeMembershipForm() {
    const membershipForm = document.getElementById('membershipForm');
    
    if (membershipForm) {
        membershipForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleMembershipSubmission();
        });
        
        // Real-time validation
        const inputs = membershipForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
        
        // Account type change handler
        const accountType = document.getElementById('accountType');
        const initialDeposit = document.getElementById('initialDeposit');
        
        if (accountType && initialDeposit) {
            accountType.addEventListener('change', function() {
                updateMinimumDeposit(this.value, initialDeposit);
            });
        }
    }
}

// Update minimum deposit based on account type
function updateMinimumDeposit(accountType, depositField) {
    const minimums = {
        'regular': 100,
        'high-yield': 1000,
        'youth': 50
    };
    
    const minimum = minimums[accountType] || 100;
    depositField.min = minimum;
    
    if (parseInt(depositField.value) < minimum) {
        depositField.value = minimum;
    }
    
    // Update placeholder text
    depositField.placeholder = `Minimum: P${minimum}`;
}

// Form validation
function initializeFormValidation() {
    // Custom validation rules
    const validationRules = {
        idNumber: {
            pattern: /^\d{9}$/,
            message: 'ID number must be 9 digits'
        },
        phone: {
            pattern: /^(\+267|267)?\s?\d{8}$/,
            message: 'Please enter a valid Botswana phone number'
        },
        email: {
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
        },
        monthlyIncome: {
            min: 1000,
            message: 'Monthly income must be at least P1,000'
        }
    };
    
    // Apply validation rules
    Object.keys(validationRules).forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            field.addEventListener('blur', function() {
                validateFieldWithRules(this, validationRules[fieldName]);
            });
        }
    });
}

// Validate field with custom rules
function validateFieldWithRules(field, rules) {
    const value = field.value.trim();
    
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    if (value && rules.pattern && !rules.pattern.test(value)) {
        showFieldError(field, rules.message);
        return false;
    }
    
    if (value && rules.min && parseFloat(value) < rules.min) {
        showFieldError(field, rules.message);
        return false;
    }
    
    clearFieldError(field);
    return true;
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value && !validateEmail(value)) {
        showFieldError(field, 'Please enter a valid email address');
        return false;
    }
    
    // Phone validation
    if (field.type === 'tel' && value && !validatePhone(value)) {
        showFieldError(field, 'Please enter a valid phone number');
        return false;
    }
    
    // Date validation (must be 18 or older)
    if (field.type === 'date' && value) {
        const birthDate = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        
        if (age < 18) {
            showFieldError(field, 'You must be at least 18 years old');
            return false;
        }
    }
    
    clearFieldError(field);
    return true;
}

// Phone validation for Botswana
function validatePhone(phone) {
    const botswanaPhonePattern = /^(\+267|267)?\s?\d{8}$/;
    return botswanaPhonePattern.test(phone);
}

// Handle membership form submission
function handleMembershipSubmission() {
    const form = document.getElementById('membershipForm');
    const formData = new FormData(form);
    
    // Validate entire form
    if (!validateEntireForm(form)) {
        showNotification('Please correct the errors in the form before submitting.', 'error');
        return;
    }
    
    // Check required checkboxes
    const termsAccept = document.getElementById('termsAccept');
    const privacyAccept = document.getElementById('privacyAccept');
    
    if (!termsAccept.checked || !privacyAccept.checked) {
        showNotification('Please accept the terms and conditions and privacy policy.', 'error');
        return;
    }
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Submitting Application...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Success
        showNotification('Your membership application has been submitted successfully! We will contact you within 2-3 business days.', 'success');
        
        // Reset form
        form.reset();
        
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Show success modal or redirect
        showApplicationSuccessModal();
        
    }, 3000);
}

// Validate entire form
function validateEntireForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Show application success modal
function showApplicationSuccessModal() {
    const modal = document.createElement('div');
    modal.className = 'success-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <i class="fas fa-check-circle"></i>
                <h3>Application Submitted Successfully!</h3>
            </div>
            <div class="modal-body">
                <p>Thank you for applying to become a member of Sesigo Saccos. Here's what happens next:</p>
                <div class="next-steps">
                    <div class="step">
                        <i class="fas fa-envelope"></i>
                        <span>You'll receive a confirmation email within 24 hours</span>
                    </div>
                    <div class="step">
                        <i class="fas fa-search"></i>
                        <span>We'll review your application and verify documents</span>
                    </div>
                    <div class="step">
                        <i class="fas fa-phone"></i>
                        <span>Our team will contact you within 2-3 business days</span>
                    </div>
                    <div class="step">
                        <i class="fas fa-check-circle"></i>
                        <span>Upon approval, you'll receive your welcome package</span>
                    </div>
                </div>
                <p><strong>Application Reference:</strong> SS-${Date.now()}</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" onclick="closeSuccessModal()">Continue</button>
            </div>
        </div>
    `;
    
    // Add styles
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 20px;
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

// Close success modal
function closeSuccessModal() {
    const modal = document.querySelector('.success-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

// Step animations
function initializeStepAnimations() {
    const steps = document.querySelectorAll('.step');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('fade-in');
                }, index * 200);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    steps.forEach(step => {
        observer.observe(step);
    });
}

// Terms and privacy modal handling
function initializeTermsAndPrivacy() {
    window.showTerms = function() {
        showModal('Terms and Conditions', getTermsContent());
    };
    
    window.showPrivacy = function() {
        showModal('Privacy Policy', getPrivacyContent());
    };
}

// Show modal
function showModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'terms-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" onclick="closeModal()">Close</button>
            </div>
        </div>
    `;
    
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 20px;
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// Close modal
function closeModal() {
    const modal = document.querySelector('.terms-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

// Get terms content
function getTermsContent() {
    return `
        <div class="terms-content">
            <h4>1. Membership Agreement</h4>
            <p>By applying for membership with Sesigo Saccos, you agree to abide by our constitution, bylaws, and all applicable regulations.</p>
            
            <h4>2. Eligibility Requirements</h4>
            <p>Members must be at least 18 years old, provide valid identification, and meet our income requirements.</p>
            
            <h4>3. Member Responsibilities</h4>
            <p>Members are expected to maintain accurate information, make timely payments, and participate in the cooperative spirit of our organization.</p>
            
            <h4>4. Services and Benefits</h4>
            <p>Members have access to savings accounts, loans, financial education, and other services as outlined in our service agreements.</p>
            
            <h4>5. Fees and Charges</h4>
            <p>All applicable fees and charges will be clearly communicated and agreed upon before services are provided.</p>
            
            <h4>6. Privacy and Confidentiality</h4>
            <p>We are committed to protecting your personal and financial information in accordance with applicable privacy laws.</p>
            
            <h4>7. Dispute Resolution</h4>
            <p>Any disputes will be resolved through our internal grievance procedures or through appropriate legal channels in Botswana.</p>
            
            <h4>8. Amendments</h4>
            <p>These terms may be updated from time to time, and members will be notified of any significant changes.</p>
        </div>
    `;
}

// Get privacy policy content
function getPrivacyContent() {
    return `
        <div class="privacy-content">
            <h4>Information We Collect</h4>
            <p>We collect personal information necessary to provide financial services, including identification, contact details, employment information, and financial data.</p>
            
            <h4>How We Use Your Information</h4>
            <p>Your information is used to process applications, provide services, comply with regulations, and communicate important updates.</p>
            
            <h4>Information Sharing</h4>
            <p>We do not sell or share your personal information with third parties except as required by law or with your explicit consent.</p>
            
            <h4>Data Security</h4>
            <p>We implement robust security measures to protect your information from unauthorized access, alteration, or disclosure.</p>
            
            <h4>Your Rights</h4>
            <p>You have the right to access, correct, or request deletion of your personal information, subject to legal and regulatory requirements.</p>
            
            <h4>Cookies and Tracking</h4>
            <p>Our website may use cookies to improve user experience and analyze website usage.</p>
            
            <h4>Contact Us</h4>
            <p>If you have questions about our privacy practices, please contact us at privacy@sesigosaccos.bw or +267 123 4567.</p>
        </div>
    `;
}

// Reset form function
function resetForm() {
    const form = document.getElementById('membershipForm');
    if (form) {
        // Clear all field errors
        const errorElements = form.querySelectorAll('.field-error');
        errorElements.forEach(error => error.remove());
        
        // Reset field styles
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.style.borderColor = 'var(--border-color)';
        });
        
        // Reset form
        form.reset();
        
        showNotification('Form has been reset.', 'info');
    }
}

// Make functions globally available
window.resetForm = resetForm;
window.showTerms = showTerms;
window.showPrivacy = showPrivacy;
window.closeModal = closeModal;
window.closeSuccessModal = closeSuccessModal;