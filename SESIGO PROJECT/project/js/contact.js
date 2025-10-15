// Contact page functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeContactForm();
    initializeMapFunctionality();
    initializeFAQInteractions();
    initializeLiveChat();
});

// Contact form initialization
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactFormSubmission();
        });
        
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateContactField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
        
        // Subject change handler
        const subjectSelect = document.getElementById('subject');
        if (subjectSelect) {
            subjectSelect.addEventListener('change', function() {
                updateFormBasedOnSubject(this.value);
            });
        }
    }
}

// Update form based on subject selection
function updateFormBasedOnSubject(subject) {
    const memberNumberField = document.getElementById('memberNumber');
    const memberNumberGroup = memberNumberField?.parentNode;
    
    if (memberNumberGroup) {
        if (subject === 'support' || subject === 'complaint') {
            memberNumberGroup.style.display = 'block';
            memberNumberField.setAttribute('required', '');
        } else {
            memberNumberGroup.style.display = 'none';
            memberNumberField.removeAttribute('required');
            memberNumberField.value = '';
        }
    }
}

// Validate contact form field
function validateContactField(field) {
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
        showFieldError(field, 'Please enter a valid Botswana phone number');
        return false;
    }
    
    // Member number validation
    if (field.id === 'memberNumber' && value && !validateMemberNumber(value)) {
        showFieldError(field, 'Please enter a valid member number (format: SS-XXXXXX)');
        return false;
    }
    
    // Message length validation
    if (field.type === 'textarea' && value && value.length < 10) {
        showFieldError(field, 'Please provide more details (at least 10 characters)');
        return false;
    }
    
    clearFieldError(field);
    return true;
}

// Validate member number format
function validateMemberNumber(memberNumber) {
    const memberPattern = /^SS-\d{6}$/;
    return memberPattern.test(memberNumber);
}

// Handle contact form submission
function handleContactFormSubmission() {
    const form = document.getElementById('contactForm');
    const formData = new FormData(form);
    
    // Validate entire form
    if (!validateEntireContactForm(form)) {
        showNotification('Please correct the errors in the form before submitting.', 'error');
        return;
    }
    
    // Check consent checkbox
    const contactConsent = document.getElementById('contactConsent');
    if (!contactConsent.checked) {
        showNotification('Please consent to being contacted regarding your inquiry.', 'error');
        return;
    }
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending Message...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        const subject = formData.get('subject');
        const isUrgent = subject === 'complaint' || subject === 'support';
        
        showNotification(
            `Your message has been sent successfully! ${isUrgent ? 'Due to the nature of your inquiry, we will respond within 24 hours.' : 'We will respond within 2-3 business days.'}`, 
            'success'
        );
        
        // Reset form
        form.reset();
        
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Show confirmation modal
        showContactConfirmationModal(subject, formData.get('firstName'));
        
    }, 2000);
}

// Validate entire contact form
function validateEntireContactForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateContactField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Show contact confirmation modal
function showContactConfirmationModal(subject, firstName) {
    const modal = document.createElement('div');
    modal.className = 'contact-confirmation-modal';
    
    const subjectMap = {
        'membership': 'Membership Inquiry',
        'loans': 'Loan Application',
        'savings': 'Savings Account',
        'support': 'Customer Support',
        'complaint': 'Complaint',
        'feedback': 'Feedback',
        'other': 'General Inquiry'
    };
    
    const subjectText = subjectMap[subject] || 'Your Inquiry';
    const ticketNumber = 'CT-' + Date.now();
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <i class="fas fa-check-circle"></i>
                <h3>Message Sent Successfully!</h3>
            </div>
            <div class="modal-body">
                <p>Thank you, ${firstName}! Your ${subjectText.toLowerCase()} has been received.</p>
                
                <div class="confirmation-details">
                    <div class="detail-item">
                        <strong>Ticket Number:</strong> ${ticketNumber}
                    </div>
                    <div class="detail-item">
                        <strong>Subject:</strong> ${subjectText}
                    </div>
                    <div class="detail-item">
                        <strong>Expected Response:</strong> ${subject === 'complaint' || subject === 'support' ? 'Within 24 hours' : '2-3 business days'}
                    </div>
                </div>
                
                <div class="next-steps">
                    <h4>What happens next?</h4>
                    <div class="step">
                        <i class="fas fa-envelope"></i>
                        <span>You'll receive an email confirmation shortly</span>
                    </div>
                    <div class="step">
                        <i class="fas fa-user-tie"></i>
                        <span>A specialist will review your inquiry</span>
                    </div>
                    <div class="step">
                        <i class="fas fa-phone"></i>
                        <span>We'll contact you with a response</span>
                    </div>
                </div>
                
                <div class="urgent-contact">
                    <p><strong>Need immediate assistance?</strong></p>
                    <p>Call us at <a href="tel:+2671234567">+267 123 4567</a></p>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" onclick="closeContactModal()">Continue</button>
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
}

// Close contact modal
function closeContactModal() {
    const modal = document.querySelector('.contact-confirmation-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

// Map functionality
function initializeMapFunctionality() {
    window.openMap = function() {
        const address = 'Plot 123, Main Mall, Gaborone, Botswana';
        const encodedAddress = encodeURIComponent(address);
        
        // Try to open in Google Maps app first, then fallback to web
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
        
        // Show map modal with options
        showMapModal(googleMapsUrl, address);
    };
}

// Show map modal
function showMapModal(googleMapsUrl, address) {
    const modal = document.createElement('div');
    modal.className = 'map-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <i class="fas fa-map-marker-alt"></i>
                <h3>Get Directions</h3>
                <button class="modal-close" onclick="closeMapModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="address-info">
                    <h4>Sesigo Saccos Main Branch</h4>
                    <p>${address}</p>
                </div>
                
                <div class="map-options">
                    <a href="${googleMapsUrl}" target="_blank" class="map-option">
                        <i class="fab fa-google"></i>
                        <span>Open in Google Maps</span>
                    </a>
                    <button onclick="copyAddress()" class="map-option">
                        <i class="fas fa-copy"></i>
                        <span>Copy Address</span>
                    </button>
                    <a href="tel:+2671234567" class="map-option">
                        <i class="fas fa-phone"></i>
                        <span>Call for Directions</span>
                    </a>
                </div>
                
                <div class="location-features">
                    <h4>Location Features</h4>
                    <div class="features-grid">
                        <div class="feature">
                            <i class="fas fa-car"></i>
                            <span>Free Parking Available</span>
                        </div>
                        <div class="feature">
                            <i class="fas fa-bus"></i>
                            <span>Public Transport Nearby</span>
                        </div>
                        <div class="feature">
                            <i class="fas fa-wheelchair"></i>
                            <span>Wheelchair Accessible</span>
                        </div>
                        <div class="feature">
                            <i class="fas fa-wifi"></i>
                            <span>Free WiFi</span>
                        </div>
                    </div>
                </div>
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
}

// Copy address function
function copyAddress() {
    const address = 'Plot 123, Main Mall, Gaborone, Botswana';
    navigator.clipboard.writeText(address).then(() => {
        showNotification('Address copied to clipboard!', 'success');
        closeMapModal();
    });
}

// Close map modal
function closeMapModal() {
    const modal = document.querySelector('.map-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

// FAQ interactions
function initializeFAQInteractions() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                // Close all FAQ items
                faqItems.forEach(faq => {
                    faq.classList.remove('active');
                });
                
                // Open clicked item if it wasn't active
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });
}

// Live chat initialization
function initializeLiveChat() {
    window.startLiveChat = function() {
        // Create enhanced chat widget
        const chatWidget = document.createElement('div');
        chatWidget.className = 'chat-widget';
        chatWidget.innerHTML = `
            <div class="chat-header">
                <div class="chat-agent">
                    <div class="agent-avatar">
                        <i class="fas fa-user-headset"></i>
                    </div>
                    <div class="agent-info">
                        <h4>Customer Support</h4>
                        <span class="agent-status">Online</span>
                    </div>
                </div>
                <button class="chat-close">&times;</button>
            </div>
            <div class="chat-messages" id="chatMessages">
                <div class="chat-message bot">
                    <div class="message-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="message-content">
                        <p>Hello! I'm here to help you with any questions about Sesigo Saccos. How can I assist you today?</p>
                        <div class="quick-options">
                            <button onclick="selectQuickOption('membership')" class="quick-option">Membership Info</button>
                            <button onclick="selectQuickOption('loans')" class="quick-option">Loan Products</button>
                            <button onclick="selectQuickOption('hours')" class="quick-option">Business Hours</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="chat-input">
                <input type="text" placeholder="Type your message..." id="chatInput" maxlength="500">
                <button id="chatSend">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
            <div class="chat-footer">
                <small>Powered by Sesigo Saccos Support</small>
            </div>
        `;
        
        // Enhanced styles
        chatWidget.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 380px;
            height: 500px;
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            display: flex;
            flex-direction: column;
            border: 1px solid var(--border-color);
            font-family: inherit;
            animation: slideInUp 0.3s ease-out;
        `;
        
        document.body.appendChild(chatWidget);
        
        // Chat functionality
        const chatInput = chatWidget.querySelector('#chatInput');
        const chatSend = chatWidget.querySelector('#chatSend');
        const chatMessages = chatWidget.querySelector('#chatMessages');
        const chatClose = chatWidget.querySelector('.chat-close');
        
        // Send message function
        function sendMessage(message = null) {
            const messageText = message || chatInput.value.trim();
            if (messageText) {
                // Add user message
                addChatMessage(messageText, 'user');
                
                if (!message) {
                    chatInput.value = '';
                }
                
                // Simulate typing indicator
                showTypingIndicator();
                
                // Simulate bot response
                setTimeout(() => {
                    hideTypingIndicator();
                    const response = generateBotResponse(messageText);
                    addChatMessage(response, 'bot');
                }, 1500);
            }
        }
        
        // Add message to chat
        function addChatMessage(message, sender) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `chat-message ${sender}`;
            
            if (sender === 'bot') {
                messageDiv.innerHTML = `
                    <div class="message-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="message-content">
                        <p>${message}</p>
                    </div>
                `;
            } else {
                messageDiv.innerHTML = `
                    <div class="message-content">
                        <p>${message}</p>
                    </div>
                `;
            }
            
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        
        // Show typing indicator
        function showTypingIndicator() {
            const typingDiv = document.createElement('div');
            typingDiv.className = 'chat-message bot typing-indicator';
            typingDiv.innerHTML = `
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <div class="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            `;
            
            chatMessages.appendChild(typingDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        
        // Hide typing indicator
        function hideTypingIndicator() {
            const typingIndicator = chatMessages.querySelector('.typing-indicator');
            if (typingIndicator) {
                typingIndicator.remove();
            }
        }
        
        // Generate bot response
        function generateBotResponse(userMessage) {
            const message = userMessage.toLowerCase();
            
            if (message.includes('membership') || message.includes('join')) {
                return 'To become a member, you need to be 18+, have a valid ID, and make an initial deposit of P100. You can apply online or visit our office. Would you like me to connect you with our membership team?';
            } else if (message.includes('loan') || message.includes('borrow')) {
                return 'We offer personal loans, business loans, and home loans with competitive rates starting from 12%. Loan requirements include being a member for 3+ months and having steady income. Would you like specific information about any loan type?';
            } else if (message.includes('hours') || message.includes('time') || message.includes('open')) {
                return 'Our office hours are Monday-Friday 8:00 AM - 5:00 PM, and Saturday 8:00 AM - 1:00 PM. We\'re closed on Sundays. Our call center operates Monday-Friday 7:00 AM - 6:00 PM.';
            } else if (message.includes('contact') || message.includes('phone') || message.includes('call')) {
                return 'You can reach us at +267 123 4567 for general inquiries, +267 123 4568 for loans, or +267 123 4569 for member services. You can also email us at info@sesigosaccos.bw.';
            } else if (message.includes('location') || message.includes('address') || message.includes('where')) {
                return 'We\'re located at Plot 123, Main Mall, Gaborone, Botswana. We have free parking and are wheelchair accessible. Would you like directions?';
            } else {
                return 'Thank you for your message. A customer service representative will be with you shortly. For immediate assistance, please call us at +267 123 4567 or visit our office during business hours.';
            }
        }
        
        // Quick option selection
        window.selectQuickOption = function(option) {
            const optionMap = {
                'membership': 'Tell me about membership requirements',
                'loans': 'What loan products do you offer?',
                'hours': 'What are your business hours?'
            };
            
            sendMessage(optionMap[option]);
        };
        
        // Event listeners
        chatSend.addEventListener('click', () => sendMessage());
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
        
        chatClose.addEventListener('click', function() {
            chatWidget.remove();
        });
        
        // Focus input
        chatInput.focus();
        
        // Character count
        chatInput.addEventListener('input', function() {
            const remaining = 500 - this.value.length;
            if (remaining < 50) {
                this.style.borderColor = remaining < 0 ? 'var(--error-color)' : 'var(--warning-color)';
            } else {
                this.style.borderColor = 'var(--border-color)';
            }
        });
    };
}

// Clear form function
function clearForm() {
    const form = document.getElementById('contactForm');
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
        
        // Hide member number field if it was shown
        const memberNumberGroup = document.getElementById('memberNumber')?.parentNode;
        if (memberNumberGroup) {
            memberNumberGroup.style.display = 'none';
        }
        
        showNotification('Form has been cleared.', 'info');
    }
}

// Make functions globally available
window.clearForm = clearForm;
window.openMap = openMap;
window.copyAddress = copyAddress;
window.closeMapModal = closeMapModal;
window.closeContactModal = closeContactModal;
window.selectQuickOption = selectQuickOption;