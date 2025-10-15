// Homepage specific functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeHeroAnimations();
    initializeStatsCounter();
    initializeServiceCards();
});

// Hero section animations
function initializeHeroAnimations() {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroButtons = document.querySelector('.hero-buttons');
    const heroStats = document.querySelector('.hero-stats');

    // Animate hero elements on load
    if (heroTitle) {
        setTimeout(() => heroTitle.classList.add('slide-in-left'), 200);
    }
    if (heroSubtitle) {
        setTimeout(() => heroSubtitle.classList.add('slide-in-left'), 400);
    }
    if (heroButtons) {
        setTimeout(() => heroButtons.classList.add('slide-in-left'), 600);
    }
    if (heroStats) {
        setTimeout(() => heroStats.classList.add('slide-in-right'), 800);
    }

    // Floating icons animation
    const floatingIcons = document.querySelectorAll('.floating-icon');
    floatingIcons.forEach((icon, index) => {
        icon.style.animationDelay = `${index * 2}s`;
    });
}

// Statistics counter animation
function initializeStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStatNumber(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
}

function animateStatNumber(element) {
    const finalValue = element.textContent;
    const isPercentage = finalValue.includes('%');
    const isCurrency = finalValue.includes('P');
    const isPlus = finalValue.includes('+');
    
    // Extract numeric value
    let numericValue = parseInt(finalValue.replace(/[^\d]/g, ''));
    
    // Handle special cases for large numbers
    if (finalValue.includes('M')) {
        numericValue = parseInt(finalValue.replace(/[^\d]/g, '')) * 1000000;
    } else if (finalValue.includes('K')) {
        numericValue = parseInt(finalValue.replace(/[^\d]/g, '')) * 1000;
    }
    
    let currentValue = 0;
    const increment = numericValue / 60; // 60 frames for smooth animation
    
    const timer = setInterval(() => {
        currentValue += increment;
        
        if (currentValue >= numericValue) {
            currentValue = numericValue;
            clearInterval(timer);
        }
        
        let displayValue = Math.floor(currentValue);
        
        // Format the display value
        if (isCurrency) {
            if (displayValue >= 1000000) {
                displayValue = 'P' + (displayValue / 1000000).toFixed(0) + 'M';
            } else if (displayValue >= 1000) {
                displayValue = 'P' + (displayValue / 1000).toFixed(0) + 'K';
            } else {
                displayValue = 'P' + displayValue.toLocaleString();
            }
        } else if (displayValue >= 1000) {
            displayValue = (displayValue / 1000).toFixed(1) + 'K';
        }
        
        if (isPercentage) displayValue += '%';
        if (isPlus) displayValue += '+';
        
        element.textContent = displayValue;
    }, 16); // ~60fps
}

// Service cards interaction
function initializeServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add hover effect to icon
            const icon = this.querySelector('.service-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            // Reset icon transform
            const icon = this.querySelector('.service-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
        
        // Add click animation
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

// Newsletter form handling
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('newsletterEmail').value;
        
        if (validateEmail(email)) {
            // Simulate API call
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = 'Subscribing...';
            submitButton.disabled = true;
            
            setTimeout(() => {
                showNotification('Thank you for subscribing to our newsletter!', 'success');
                this.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 1500);
        } else {
            showNotification('Please enter a valid email address.', 'error');
        }
    });
}

// Community impact section animation
function initializeCommunityImpact() {
    const impactStats = document.querySelectorAll('.impact-stat');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('slide-in-left');
                }, index * 200);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    impactStats.forEach(stat => {
        observer.observe(stat);
    });
}

// Initialize community impact animations
document.addEventListener('DOMContentLoaded', function() {
    initializeCommunityImpact();
});

// Pulse animation for community circle
function initializeCommunityCircle() {
    const communityCircle = document.querySelector('.community-circle');
    
    if (communityCircle) {
        // Add click interaction
        communityCircle.addEventListener('click', function() {
            this.style.transform = 'scale(1.05)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
        
        // Add periodic pulse effect
        setInterval(() => {
            communityCircle.style.transform = 'scale(1.02)';
            setTimeout(() => {
                communityCircle.style.transform = 'scale(1)';
            }, 300);
        }, 5000);
    }
}

// Initialize community circle
document.addEventListener('DOMContentLoaded', function() {
    initializeCommunityCircle();
});

// News cards hover effects
function initializeNewsCards() {
    const newsCards = document.querySelectorAll('.news-card');
    
    newsCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const newsImage = this.querySelector('.news-image');
            if (newsImage) {
                newsImage.style.transform = 'scale(1.05)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const newsImage = this.querySelector('.news-image');
            if (newsImage) {
                newsImage.style.transform = 'scale(1)';
            }
        });
    });
}

// Initialize news cards
document.addEventListener('DOMContentLoaded', function() {
    initializeNewsCards();
});