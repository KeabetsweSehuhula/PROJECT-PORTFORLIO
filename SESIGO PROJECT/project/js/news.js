// News page functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeSearchAndFilter();
    initializeArticleExpansion();
    initializeNewsletterSubscription();
    initializeLoadMore();
    initializeSocialSharing();
});

// Search and filter functionality
function initializeSearchAndFilter() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const dateFilter = document.getElementById('dateFilter');
    const articleCards = document.querySelectorAll('.article-card');
    
    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filterArticles(searchTerm, categoryFilter?.value, dateFilter?.value, articleCards);
        });
    }
    
    // Category filter
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            const searchTerm = searchInput?.value.toLowerCase() || '';
            filterArticles(searchTerm, this.value, dateFilter?.value, articleCards);
        });
    }
    
    // Date filter
    if (dateFilter) {
        dateFilter.addEventListener('change', function() {
            const searchTerm = searchInput?.value.toLowerCase() || '';
            filterArticles(searchTerm, categoryFilter?.value, this.value, articleCards);
        });
    }
}

// Filter articles based on search and filters
function filterArticles(searchTerm, category, dateRange, articles) {
    let visibleCount = 0;
    
    articles.forEach(article => {
        let shouldShow = true;
        
        // Search filter
        if (searchTerm) {
            const articleText = article.textContent.toLowerCase();
            if (!articleText.includes(searchTerm)) {
                shouldShow = false;
            }
        }
        
        // Category filter
        if (category && category !== 'all') {
            const articleCategory = article.getAttribute('data-category');
            if (articleCategory !== category) {
                shouldShow = false;
            }
        }
        
        // Date filter
        if (dateRange && dateRange !== 'all') {
            const articleDate = article.getAttribute('data-date');
            if (!isWithinDateRange(articleDate, dateRange)) {
                shouldShow = false;
            }
        }
        
        // Show/hide article
        if (shouldShow) {
            article.classList.remove('hidden');
            article.style.display = 'block';
            visibleCount++;
            
            // Animate in
            setTimeout(() => {
                article.style.opacity = '1';
                article.style.transform = 'scale(1)';
            }, 100);
        } else {
            article.classList.add('hidden');
            article.style.opacity = '0';
            article.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                article.style.display = 'none';
            }, 300);
        }
    });
    
    // Update results count
    updateResultsCount(visibleCount, articles.length);
}

// Check if date is within range
function isWithinDateRange(dateString, range) {
    if (!dateString) return true;
    
    const articleDate = new Date(dateString);
    const now = new Date();
    const diffTime = now - articleDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    switch (range) {
        case 'week':
            return diffDays <= 7;
        case 'month':
            return diffDays <= 30;
        case 'quarter':
            return diffDays <= 90;
        default:
            return true;
    }
}

// Update results count
function updateResultsCount(visible, total) {
    let resultsIndicator = document.querySelector('.results-indicator');
    
    if (!resultsIndicator) {
        resultsIndicator = document.createElement('div');
        resultsIndicator.className = 'results-indicator';
        resultsIndicator.style.cssText = `
            text-align: center;
            margin: 24px 0;
            color: var(--text-light);
            font-size: 0.95rem;
            padding: 12px;
            background: var(--light-gray);
            border-radius: 8px;
        `;
        
        const articlesGrid = document.querySelector('.articles-grid');
        if (articlesGrid) {
            articlesGrid.parentNode.insertBefore(resultsIndicator, articlesGrid);
        }
    }
    
    if (visible === 0) {
        resultsIndicator.innerHTML = `
            <i class="fas fa-search"></i>
            <span>No articles found matching your criteria. Try adjusting your search or filters.</span>
        `;
        resultsIndicator.style.color = 'var(--warning-color)';
    } else {
        resultsIndicator.textContent = `Showing ${visible} of ${total} articles`;
        resultsIndicator.style.color = 'var(--text-light)';
    }
}

// Article expansion functionality
function initializeArticleExpansion() {
    const readMoreLinks = document.querySelectorAll('.read-more');
    
    readMoreLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const articleId = this.closest('.article-card').id;
            if (articleId) {
                expandArticle(articleId);
            }
        });
    });
}

// Expand article function
function expandArticle(articleId) {
    const article = document.getElementById(articleId);
    if (!article) return;
    
    // Check if already expanded
    let expandedContent = article.querySelector('.article-expanded');
    
    if (expandedContent) {
        // Toggle visibility
        if (expandedContent.classList.contains('show')) {
            expandedContent.classList.remove('show');
            setTimeout(() => {
                expandedContent.style.display = 'none';
            }, 300);
        } else {
            expandedContent.style.display = 'block';
            setTimeout(() => {
                expandedContent.classList.add('show');
            }, 10);
        }
        return;
    }
    
    // Create expanded content
    expandedContent = document.createElement('div');
    expandedContent.className = 'article-expanded';
    
    // Get article-specific content
    const content = getExpandedContent(articleId);
    expandedContent.innerHTML = content;
    
    // Add to article
    article.appendChild(expandedContent);
    
    // Show with animation
    setTimeout(() => {
        expandedContent.style.display = 'block';
        setTimeout(() => {
            expandedContent.classList.add('show');
        }, 10);
    }, 100);
    
    // Scroll to expanded content
    setTimeout(() => {
        expandedContent.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }, 400);
}

// Get expanded content for specific articles
function getExpandedContent(articleId) {
    const contentMap = {
        'article-2': `
            <h3>Enhanced Home Loan Features</h3>
            <p>Our new home loan products are designed to make homeownership more accessible than ever before. Here are the key features:</p>
            
            <h4>Competitive Interest Rates</h4>
            <p>Starting from just 12% APY, our rates are among the most competitive in Botswana's financial market.</p>
            
            <h4>Flexible Down Payment Options</h4>
            <p>We now accept down payments as low as 5% of the property value, making it easier for first-time homebuyers to enter the market.</p>
            
            <h4>Extended Repayment Terms</h4>
            <p>Choose repayment terms up to 30 years, allowing for more manageable monthly payments that fit your budget.</p>
            
            <h4>Quick Approval Process</h4>
            <p>Our streamlined application process means you can get pre-approved within 48 hours and full approval within 5-7 business days.</p>
            
            <h4>Additional Benefits</h4>
            <ul>
                <li>No application fees for members</li>
                <li>Free property valuation</li>
                <li>Flexible payment dates</li>
                <li>Option to make additional payments without penalties</li>
                <li>Life insurance coverage included</li>
            </ul>
            
            <p>To learn more about our home loan products or to start your application, contact our lending specialists at +267 123 4568 or visit our office.</p>
        `,
        'article-3': `
            <h3>Recognition for Community Excellence</h3>
            <p>We are deeply honored to receive the Financial Cooperative Excellence Award from the Botswana Cooperative Association. This recognition reflects our commitment to serving our community and promoting financial inclusion.</p>
            
            <h4>Award Criteria</h4>
            <p>The award recognizes financial cooperatives that demonstrate:</p>
            <ul>
                <li>Outstanding member service and satisfaction</li>
                <li>Strong financial performance and stability</li>
                <li>Innovative products and services</li>
                <li>Significant community impact</li>
                <li>Commitment to financial education</li>
            </ul>
            
            <h4>Our Community Impact</h4>
            <p>Over the past year, Sesigo Saccos has:</p>
            <ul>
                <li>Provided over P50 million in loans to members</li>
                <li>Helped 600+ families achieve homeownership</li>
                <li>Supported 850+ small businesses with funding</li>
                <li>Trained 1,200+ individuals in financial literacy</li>
                <li>Maintained a 98% member satisfaction rate</li>
            </ul>
            
            <h4>Looking Forward</h4>
            <p>This award motivates us to continue expanding our services and finding new ways to support our members' financial success. We're currently developing new digital banking features and planning to open additional service centers across Botswana.</p>
            
            <p>Thank you to all our members who make this recognition possible. Your trust and support drive us to excellence every day.</p>
        `
    };
    
    return contentMap[articleId] || `
        <h3>Full Article Content</h3>
        <p>This is where the full article content would appear. In a real implementation, this content would be loaded from your content management system or database.</p>
        <p>The article would include detailed information, additional sections, images, and any other relevant content that provides value to your readers.</p>
    `;
}

// Newsletter subscription
function initializeNewsletterSubscription() {
    const subscriptionForm = document.getElementById('newsSubscriptionForm');
    
    if (subscriptionForm) {
        subscriptionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleNewsletterSubscription();
        });
    }
}

// Handle newsletter subscription
function handleNewsletterSubscription() {
    const form = document.getElementById('newsSubscriptionForm');
    const email = document.getElementById('newsEmail').value;
    const topics = document.getElementById('newsTopics').value;
    
    if (!validateEmail(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Subscribing...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        showNotification(`Thank you for subscribing! You'll receive ${topics === 'all' ? 'all our updates' : topics + ' updates'} in your inbox.`, 'success');
        
        form.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Show subscription success modal
        showSubscriptionSuccessModal(topics);
        
    }, 1500);
}

// Show subscription success modal
function showSubscriptionSuccessModal(topics) {
    const modal = document.createElement('div');
    modal.className = 'subscription-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <i class="fas fa-envelope-open"></i>
                <h3>Subscription Confirmed!</h3>
            </div>
            <div class="modal-body">
                <p>Welcome to the Sesigo Saccos newsletter family! Here's what you can expect:</p>
                <div class="subscription-benefits">
                    <div class="benefit">
                        <i class="fas fa-calendar-week"></i>
                        <span>Weekly financial insights and tips</span>
                    </div>
                    <div class="benefit">
                        <i class="fas fa-star"></i>
                        <span>Exclusive member offers and promotions</span>
                    </div>
                    <div class="benefit">
                        <i class="fas fa-bell"></i>
                        <span>First access to new products and services</span>
                    </div>
                    <div class="benefit">
                        <i class="fas fa-graduation-cap"></i>
                        <span>Free financial education resources</span>
                    </div>
                </div>
                <p><strong>Your preferences:</strong> ${topics === 'all' ? 'All topics' : topics.charAt(0).toUpperCase() + topics.slice(1)}</p>
                <p><em>You can update your preferences or unsubscribe at any time.</em></p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" onclick="closeSubscriptionModal()">Great, Thanks!</button>
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

// Close subscription modal
function closeSubscriptionModal() {
    const modal = document.querySelector('.subscription-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

// Load more functionality
function initializeLoadMore() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            loadMoreArticles();
        });
    }
}

// Load more articles
function loadMoreArticles() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const articlesGrid = document.getElementById('articlesGrid');
    
    if (!loadMoreBtn || !articlesGrid) return;
    
    // Show loading state
    const originalText = loadMoreBtn.textContent;
    loadMoreBtn.textContent = 'Loading...';
    loadMoreBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Create additional articles
        const newArticles = createAdditionalArticles();
        
        // Add to grid
        newArticles.forEach(article => {
            articlesGrid.appendChild(article);
        });
        
        // Reset button
        loadMoreBtn.textContent = originalText;
        loadMoreBtn.disabled = false;
        
        // Hide button if no more articles
        const totalArticles = articlesGrid.querySelectorAll('.article-card').length;
        if (totalArticles >= 15) { // Arbitrary limit
            loadMoreBtn.style.display = 'none';
            
            const endMessage = document.createElement('p');
            endMessage.textContent = 'You\'ve reached the end of our articles. Check back soon for more updates!';
            endMessage.style.cssText = `
                text-align: center;
                color: var(--text-light);
                font-style: italic;
                margin-top: 32px;
            `;
            loadMoreBtn.parentNode.appendChild(endMessage);
        }
        
        showNotification('More articles loaded successfully!', 'success');
        
    }, 1500);
}

// Create additional articles
function createAdditionalArticles() {
    const additionalArticles = [
        {
            category: 'tips',
            date: '2024-12-05',
            title: 'Emergency Fund Essentials: Building Financial Security',
            excerpt: 'Learn why emergency funds are crucial and how to build one that provides real financial security for you and your family.',
            highlights: ['💰 3-6 Month Rule', '🎯 Smart Strategies', '🛡️ Peace of Mind']
        },
        {
            category: 'education',
            date: '2024-11-28',
            title: 'Teaching Kids About Money: A Parent\'s Guide',
            excerpt: 'Practical strategies for teaching children financial literacy from an early age, setting them up for lifelong financial success.',
            highlights: ['👶 Age-Appropriate Lessons', '💡 Fun Activities', '📚 Educational Resources']
        },
        {
            category: 'market',
            date: '2024-11-20',
            title: 'Inflation Impact: Protecting Your Savings in 2025',
            excerpt: 'Understanding how inflation affects your money and strategies to protect and grow your savings despite economic challenges.',
            highlights: ['📊 Inflation Analysis', '🛡️ Protection Strategies', '📈 Growth Opportunities']
        }
    ];
    
    return additionalArticles.map(article => {
        const articleElement = document.createElement('article');
        articleElement.className = 'article-card';
        articleElement.setAttribute('data-category', article.category);
        articleElement.setAttribute('data-date', article.date);
        
        articleElement.innerHTML = `
            <div class="article-image">
                <i class="fas fa-${article.category === 'tips' ? 'lightbulb' : article.category === 'education' ? 'graduation-cap' : 'chart-line'}"></i>
                <div class="article-category-badge">${article.category === 'tips' ? 'Financial Tips' : article.category === 'education' ? 'Financial Education' : 'Market Updates'}</div>
            </div>
            <div class="article-content">
                <div class="article-meta">
                    <span class="article-date">${new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    <span class="read-time">4 min read</span>
                </div>
                <h3>${article.title}</h3>
                <p>${article.excerpt}</p>
                <div class="article-highlights">
                    ${article.highlights.map(highlight => `<span class="highlight">${highlight}</span>`).join('')}
                </div>
                <a href="#" class="read-more">Read Full Article <i class="fas fa-arrow-right"></i></a>
            </div>
        `;
        
        // Add fade-in animation
        articleElement.style.opacity = '0';
        articleElement.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            articleElement.style.transition = 'all 0.5s ease';
            articleElement.style.opacity = '1';
            articleElement.style.transform = 'translateY(0)';
        }, 100);
        
        return articleElement;
    });
}

// Social sharing
function initializeSocialSharing() {
    // Add share buttons to articles
    const articleCards = document.querySelectorAll('.article-card');
    
    articleCards.forEach(card => {
        const shareButton = document.createElement('button');
        shareButton.className = 'share-button';
        shareButton.innerHTML = '<i class="fas fa-share-alt"></i>';
        shareButton.style.cssText = `
            position: absolute;
            top: 16px;
            right: 16px;
            background: rgba(255, 255, 255, 0.9);
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            opacity: 0;
        `;
        
        const articleImage = card.querySelector('.article-image');
        if (articleImage) {
            articleImage.style.position = 'relative';
            articleImage.appendChild(shareButton);
        }
        
        // Show share button on hover
        card.addEventListener('mouseenter', function() {
            shareButton.style.opacity = '1';
        });
        
        card.addEventListener('mouseleave', function() {
            shareButton.style.opacity = '0';
        });
        
        // Share functionality
        shareButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const title = card.querySelector('h3').textContent;
            shareArticle(title);
        });
    });
}

// Share article function
function shareArticle(title) {
    if (navigator.share) {
        navigator.share({
            title: title,
            text: 'Check out this article from Sesigo Saccos',
            url: window.location.href
        }).catch(err => {
            console.log('Error sharing:', err);
            fallbackShare(title);
        });
    } else {
        fallbackShare(title);
    }
}

// Fallback share function
function fallbackShare(title) {
    const shareModal = document.createElement('div');
    shareModal.className = 'share-modal';
    shareModal.innerHTML = `
        <div class="share-modal-content">
            <h4>Share Article</h4>
            <p>${title}</p>
            <div class="share-options">
                <button onclick="shareToFacebook('${encodeURIComponent(title)}')" class="share-option facebook">
                    <i class="fab fa-facebook-f"></i> Facebook
                </button>
                <button onclick="shareToTwitter('${encodeURIComponent(title)}')" class="share-option twitter">
                    <i class="fab fa-twitter"></i> Twitter
                </button>
                <button onclick="shareToLinkedIn('${encodeURIComponent(title)}')" class="share-option linkedin">
                    <i class="fab fa-linkedin-in"></i> LinkedIn
                </button>
                <button onclick="copyArticleLink()" class="share-option copy">
                    <i class="fas fa-copy"></i> Copy Link
                </button>
            </div>
            <button onclick="closeShareModal()" class="close-share">Close</button>
        </div>
    `;
    
    shareModal.style.cssText = `
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
    `;
    
    document.body.appendChild(shareModal);
}

// Social sharing functions
function shareToFacebook(title) {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    closeShareModal();
}

function shareToTwitter(title) {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${title}&url=${url}`, '_blank');
    closeShareModal();
}

function shareToLinkedIn(title) {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
    closeShareModal();
}

function copyArticleLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        showNotification('Article link copied to clipboard!', 'success');
        closeShareModal();
    });
}

function closeShareModal() {
    const modal = document.querySelector('.share-modal');
    if (modal) {
        modal.remove();
    }
}

// Make functions globally available
window.expandArticle = expandArticle;
window.shareArticle = shareArticle;
window.closeSubscriptionModal = closeSubscriptionModal;
window.shareToFacebook = shareToFacebook;
window.shareToTwitter = shareToTwitter;
window.shareToLinkedIn = shareToLinkedIn;
window.copyArticleLink = copyArticleLink;
window.closeShareModal = closeShareModal;