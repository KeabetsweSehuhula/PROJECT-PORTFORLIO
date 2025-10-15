// Services page functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeServicesNavigation();
    initializeCalculators();
    initializeFAQInteractions();
    initializeLiveChat();
});

// Services navigation
function initializeServicesNavigation() {
    const navLinks = document.querySelectorAll('.service-nav-link');
    const sections = document.querySelectorAll('.service-section');
    
    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Scroll to target section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 160; // Account for sticky nav
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Update active link on scroll
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            const sectionHeight = section.offsetHeight;
            
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Calculator functionality
function initializeCalculators() {
    // Savings calculator
    const savingsCalculator = document.getElementById('savingsCalculator');
    if (savingsCalculator) {
        const inputs = savingsCalculator.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', calculateSavings);
        });
        
        // Initial calculation
        calculateSavings();
    }
    
    // Loan calculator
    const loanCalculator = document.getElementById('loanCalculator');
    if (loanCalculator) {
        const inputs = loanCalculator.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', calculateLoan);
        });
        
        // Initial calculation
        calculateLoan();
    }
}

// Savings calculation
function calculateSavings() {
    const initialDeposit = parseFloat(document.getElementById('initialDeposit')?.value) || 0;
    const monthlySavings = parseFloat(document.getElementById('monthlySavings')?.value) || 0;
    const timePeriod = parseFloat(document.getElementById('timePeriod')?.value) || 0;
    const interestRate = parseFloat(document.getElementById('interestRate')?.value) || 0;
    
    if (timePeriod > 0 && interestRate > 0) {
        const monthlyRate = interestRate / 100 / 12;
        const totalMonths = timePeriod * 12;
        
        // Future value of initial deposit
        const futureValueInitial = initialDeposit * Math.pow(1 + monthlyRate, totalMonths);
        
        // Future value of monthly savings (annuity)
        const futureValueMonthly = monthlySavings * (Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate;
        
        const totalSavings = futureValueInitial + futureValueMonthly;
        const totalContributions = initialDeposit + (monthlySavings * totalMonths);
        const totalInterest = totalSavings - totalContributions;
        
        // Update display
        const resultAmount = document.querySelector('.result-amount');
        const resultInterest = document.querySelector('.result-interest');
        
        if (resultAmount) {
            resultAmount.textContent = `P${Math.round(totalSavings).toLocaleString()}`;
        }
        if (resultInterest) {
            resultInterest.textContent = `P${Math.round(totalInterest).toLocaleString()}`;
        }
    }
}

// Loan calculation
function calculateLoan() {
    const loanAmount = parseFloat(document.getElementById('loanAmount')?.value) || 0;
    const loanRate = parseFloat(document.getElementById('loanRate')?.value) || 0;
    const loanTerm = parseFloat(document.getElementById('loanTerm')?.value) || 0;
    
    if (loanAmount > 0 && loanRate > 0 && loanTerm > 0) {
        const monthlyRate = loanRate / 100 / 12;
        const totalPayments = loanTerm;
        
        // Monthly payment calculation
        const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
                              (Math.pow(1 + monthlyRate, totalPayments) - 1);
        
        const totalAmount = monthlyPayment * totalPayments;
        const totalInterest = totalAmount - loanAmount;
        
        // Update display
        const resultPayment = document.querySelector('.result-payment');
        const resultTotalInterest = document.querySelector('.result-total-interest');
        const resultTotalAmount = document.querySelector('.result-total-amount');
        
        if (resultPayment) {
            resultPayment.textContent = `P${Math.round(monthlyPayment).toLocaleString()}`;
        }
        if (resultTotalInterest) {
            resultTotalInterest.textContent = `P${Math.round(totalInterest).toLocaleString()}`;
        }
        if (resultTotalAmount) {
            resultTotalAmount.textContent = `P${Math.round(totalAmount).toLocaleString()}`;
        }
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
        // Create chat widget
        const chatWidget = document.createElement('div');
        chatWidget.className = 'chat-widget';
        chatWidget.innerHTML = `
            <div class="chat-header">
                <h4>Live Chat Support</h4>
                <button class="chat-close">&times;</button>
            </div>
            <div class="chat-messages">
                <div class="chat-message bot">
                    <p>Hello! I'm here to help you with any questions about our services. How can I assist you today?</p>
                </div>
            </div>
            <div class="chat-input">
                <input type="text" placeholder="Type your message..." id="chatInput">
                <button id="chatSend">Send</button>
            </div>
        `;
        
        // Add styles
        chatWidget.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 350px;
            height: 400px;
            background: white;
            border-radius: 12px;
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            display: flex;
            flex-direction: column;
            border: 1px solid var(--border-color);
        `;
        
        document.body.appendChild(chatWidget);
        
        // Chat functionality
        const chatInput = chatWidget.querySelector('#chatInput');
        const chatSend = chatWidget.querySelector('#chatSend');
        const chatMessages = chatWidget.querySelector('.chat-messages');
        const chatClose = chatWidget.querySelector('.chat-close');
        
        // Send message
        function sendMessage() {
            const message = chatInput.value.trim();
            if (message) {
                // Add user message
                const userMessage = document.createElement('div');
                userMessage.className = 'chat-message user';
                userMessage.innerHTML = `<p>${message}</p>`;
                chatMessages.appendChild(userMessage);
                
                chatInput.value = '';
                chatMessages.scrollTop = chatMessages.scrollHeight;
                
                // Simulate bot response
                setTimeout(() => {
                    const botMessage = document.createElement('div');
                    botMessage.className = 'chat-message bot';
                    botMessage.innerHTML = `<p>Thank you for your message. A customer service representative will be with you shortly. In the meantime, you can also call us at +267 123 4567.</p>`;
                    chatMessages.appendChild(botMessage);
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 1000);
            }
        }
        
        chatSend.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
        
        // Close chat
        chatClose.addEventListener('click', function() {
            chatWidget.remove();
        });
        
        // Focus input
        chatInput.focus();
    };
}

// Product card interactions
function initializeProductCards() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('featured')) {
                this.style.transform = 'translateY(-8px) scale(1.02)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('featured')) {
                this.style.transform = 'translateY(0) scale(1)';
            }
        });
    });
}

// Initialize product cards
document.addEventListener('DOMContentLoaded', function() {
    initializeProductCards();
});

// Resource download simulation
function downloadResource(resourceName) {
    showNotification(`Downloading ${resourceName}...`, 'info');
    
    // Simulate download delay
    setTimeout(() => {
        showNotification(`${resourceName} downloaded successfully!`, 'success');
    }, 2000);
}

// Add download functionality to resource links
document.addEventListener('DOMContentLoaded', function() {
    const resourceLinks = document.querySelectorAll('.resource-item');
    
    resourceLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const resourceName = this.querySelector('span').textContent;
            downloadResource(resourceName);
        });
    });
});

// Contact advisor functionality
function contactAdvisor() {
    showNotification('Redirecting you to our contact page to schedule a consultation with one of our financial advisors.', 'info');
    
    setTimeout(() => {
        window.location.href = './contact.html';
    }, 2000);
}

// Share article functionality
function shareArticle(articleTitle) {
    if (navigator.share) {
        navigator.share({
            title: articleTitle,
            text: 'Check out this article from Sesigo Saccos',
            url: window.location.href
        });
    } else {
        // Fallback - copy to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
            showNotification('Article link copied to clipboard!', 'success');
        });
    }
}

// Make functions globally available
window.calculateSavings = calculateSavings;
window.calculateLoan = calculateLoan;
window.contactAdvisor = contactAdvisor;
window.shareArticle = shareArticle;