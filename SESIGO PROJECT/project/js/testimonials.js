// Testimonials page functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeTestimonialFiltering();
    initializeVideoTestimonials();
    initializeStorySubmission();
    initializeTestimonialAnimations();
});

// Testimonial filtering
function initializeTestimonialFiltering() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get selected category
            const selectedCategory = this.getAttribute('data-category');
            
            // Filter testimonials
            filterTestimonials(selectedCategory, testimonialCards);
        });
    });
}

// Filter testimonials by category
function filterTestimonials(category, cards) {
    cards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (category === 'all' || cardCategory === category) {
            card.classList.remove('hidden');
            card.style.display = 'block';
            
            // Animate in
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            }, 100);
        } else {
            card.classList.add('hidden');
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            
            // Hide after animation
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
    
    // Update results count
    updateResultsCount(category, cards);
}

// Update results count
function updateResultsCount(category, cards) {
    const visibleCards = Array.from(cards).filter(card => {
        const cardCategory = card.getAttribute('data-category');
        return category === 'all' || cardCategory === category;
    });
    
    // Create or update results indicator
    let resultsIndicator = document.querySelector('.results-indicator');
    if (!resultsIndicator) {
        resultsIndicator = document.createElement('div');
        resultsIndicator.className = 'results-indicator';
        resultsIndicator.style.cssText = `
            text-align: center;
            margin: 32px 0;
            color: var(--text-light);
            font-size: 0.95rem;
        `;
        
        const container = document.querySelector('.testimonials-container');
        container.parentNode.insertBefore(resultsIndicator, container);
    }
    
    const categoryName = category === 'all' ? 'All Stories' : 
                        category.charAt(0).toUpperCase() + category.slice(1) + ' Stories';
    
    resultsIndicator.textContent = `Showing ${visibleCards.length} ${categoryName}`;
}

// Video testimonials
function initializeVideoTestimonials() {
    const videoCards = document.querySelectorAll('.video-card');
    
    videoCards.forEach(card => {
        card.addEventListener('click', function() {
            const videoId = this.getAttribute('onclick')?.match(/playVideo\('(.+)'\)/)?.[1];
            if (videoId) {
                playVideo(videoId);
            }
        });
    });
}

// Play video function
function playVideo(videoId) {
    // Create video modal
    const modal = document.createElement('div');
    modal.className = 'video-modal';
    modal.innerHTML = `
        <div class="video-modal-content">
            <div class="video-header">
                <h3>Member Success Story</h3>
                <button class="video-close">&times;</button>
            </div>
            <div class="video-container">
                <div class="video-placeholder">
                    <i class="fas fa-play-circle"></i>
                    <p>Video testimonial would play here</p>
                    <p class="video-note">In a real implementation, this would connect to your video hosting service (YouTube, Vimeo, etc.)</p>
                </div>
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
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 20px;
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Close functionality
    const closeBtn = modal.querySelector('.video-close');
    closeBtn.addEventListener('click', closeVideoModal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeVideoModal();
        }
    });
    
    // ESC key to close
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeVideoModal();
        }
    });
}

// Close video modal
function closeVideoModal() {
    const modal = document.querySelector('.video-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

// Story submission
function initializeStorySubmission() {
    const storyForm = document.getElementById('storyForm');
    
    if (storyForm) {
        storyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleStorySubmission();
        });
        
        // Character count for story content
        const storyContent = document.getElementById('storyContent');
        if (storyContent) {
            const charCount = document.createElement('div');
            charCount.className = 'char-count';
            charCount.style.cssText = `
                text-align: right;
                font-size: 0.8rem;
                color: var(--text-light);
                margin-top: 4px;
            `;
            
            storyContent.parentNode.appendChild(charCount);
            
            storyContent.addEventListener('input', function() {
                const remaining = 500 - this.value.length;
                charCount.textContent = `${remaining} characters remaining`;
                
                if (remaining < 0) {
                    charCount.style.color = 'var(--error-color)';
                } else if (remaining < 50) {
                    charCount.style.color = 'var(--warning-color)';
                } else {
                    charCount.style.color = 'var(--text-light)';
                }
            });
            
            // Initial count
            storyContent.dispatchEvent(new Event('input'));
        }
    }
}

// Handle story submission
function handleStorySubmission() {
    const form = document.getElementById('storyForm');
    const formData = new FormData(form);
    
    // Validate form
    const name = formData.get('storyName');
    const email = formData.get('storyEmail');
    const type = formData.get('storyType');
    const content = formData.get('storyContent');
    
    if (!name || !email || !type || !content) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }
    
    if (content.length > 500) {
        showNotification('Story content must be 500 characters or less.', 'error');
        return;
    }
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Submitting Story...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        showNotification('Thank you for sharing your success story! We will review it and may feature it in our newsletter or website.', 'success');
        
        form.reset();
        
        // Reset character count
        const charCount = form.querySelector('.char-count');
        if (charCount) {
            charCount.textContent = '500 characters remaining';
            charCount.style.color = 'var(--text-light)';
        }
        
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Show thank you modal
        showThankYouModal();
        
    }, 2000);
}

// Show thank you modal
function showThankYouModal() {
    const modal = document.createElement('div');
    modal.className = 'thank-you-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <i class="fas fa-heart"></i>
                <h3>Thank You for Sharing!</h3>
            </div>
            <div class="modal-body">
                <p>Your success story has been submitted successfully. Here's what happens next:</p>
                <div class="next-steps">
                    <div class="step">
                        <i class="fas fa-search"></i>
                        <span>Our team will review your story</span>
                    </div>
                    <div class="step">
                        <i class="fas fa-star"></i>
                        <span>Selected stories may be featured on our website</span>
                    </div>
                    <div class="step">
                        <i class="fas fa-gift"></i>
                        <span>Featured members receive a special appreciation gift</span>
                    </div>
                    <div class="step">
                        <i class="fas fa-envelope"></i>
                        <span>You'll be notified if your story is selected</span>
                    </div>
                </div>
                <p><em>Your story inspires others in our community to achieve their financial goals!</em></p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" onclick="closeThankYouModal()">Continue</button>
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

// Close thank you modal
function closeThankYouModal() {
    const modal = document.querySelector('.thank-you-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

// Testimonial animations
function initializeTestimonialAnimations() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('fade-in');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    testimonialCards.forEach(card => {
        observer.observe(card);
    });
    
    // Hover effects for testimonial cards
    testimonialCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const avatar = this.querySelector('.testimonial-avatar');
            if (avatar) {
                avatar.style.transform = 'scale(1.1) rotate(5deg)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const avatar = this.querySelector('.testimonial-avatar');
            if (avatar) {
                avatar.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
}

// Statistics animation
function initializeStatsAnimation() {
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

// Animate stat numbers
function animateStatNumber(element) {
    const finalValue = element.textContent;
    const isPercentage = finalValue.includes('%');
    const isCurrency = finalValue.includes('P');
    const isPlus = finalValue.includes('+');
    
    let numericValue = parseInt(finalValue.replace(/[^\d]/g, ''));
    
    if (finalValue.includes('M')) {
        numericValue = parseInt(finalValue.replace(/[^\d]/g, '')) * 1000000;
    } else if (finalValue.includes('K')) {
        numericValue = parseInt(finalValue.replace(/[^\d]/g, '')) * 1000;
    }
    
    let currentValue = 0;
    const increment = numericValue / 60;
    
    const timer = setInterval(() => {
        currentValue += increment;
        
        if (currentValue >= numericValue) {
            currentValue = numericValue;
            clearInterval(timer);
        }
        
        let displayValue = Math.floor(currentValue);
        
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
    }, 16);
}

// Initialize stats animation
document.addEventListener('DOMContentLoaded', function() {
    initializeStatsAnimation();
});

// Search functionality for testimonials
function initializeTestimonialSearch() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search success stories...';
    searchInput.className = 'testimonial-search';
    searchInput.style.cssText = `
        width: 100%;
        max-width: 400px;
        padding: 12px 16px;
        border: 2px solid var(--border-color);
        border-radius: 25px;
        font-size: 16px;
        margin: 32px auto;
        display: block;
    `;
    
    const categoriesSection = document.querySelector('.success-categories');
    if (categoriesSection) {
        categoriesSection.appendChild(searchInput);
        
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const testimonialCards = document.querySelectorAll('.testimonial-card');
            
            testimonialCards.forEach(card => {
                const text = card.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
}

// Make functions globally available
window.playVideo = playVideo;
window.closeVideoModal = closeVideoModal;
window.closeThankYouModal = closeThankYouModal;

// Initialize search (optional feature)
// document.addEventListener('DOMContentLoaded', function() {
//     initializeTestimonialSearch();
// });