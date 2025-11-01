// Product Reviews System
class ReviewsManager {
    constructor() {
        this.reviews = this.loadReviews();
        this.init();
    }

    loadReviews() {
        const savedReviews = localStorage.getItem('goodtogo-reviews');
        return savedReviews ? JSON.parse(savedReviews) : this.getDefaultReviews();
    }

    getDefaultReviews() {
        return [
            {
                id: '1',
                productId: 'care-pack-1',
                userName: 'Sarah M.',
                userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
                rating: 5,
                title: 'Amazing quality!',
                comment: 'This care package exceeded my expectations. Everything was perfectly packaged and the quality is outstanding.',
                date: '2024-01-15',
                helpful: 12,
                verified: true
            },
            {
                id: '2',
                productId: 'care-pack-1',
                userName: 'Mike R.',
                userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
                rating: 4,
                title: 'Great value',
                comment: 'Good selection of items. Delivery was fast and everything arrived in perfect condition.',
                date: '2024-01-10',
                helpful: 8,
                verified: true
            },
            {
                id: '3',
                productId: 'care-pack-1',
                userName: 'Emma L.',
                userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
                rating: 5,
                title: 'Perfect gift!',
                comment: 'Bought this as a gift and it was perfect. The recipient loved everything in the package.',
                date: '2024-01-08',
                helpful: 15,
                verified: true
            }
        ];
    }

    saveReviews() {
        localStorage.setItem('goodtogo-reviews', JSON.stringify(this.reviews));
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Close modal events
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-modal') || 
                e.target.classList.contains('modal')) {
                this.closeModal();
            }
        });

        // Write review button
        document.addEventListener('click', (e) => {
            if (e.target.id === 'write-review-btn') {
                this.showWriteReviewModal();
            }
        });

        // Submit review form
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'write-review-form') {
                e.preventDefault();
                this.submitReview(e.target);
            }
        });

        // Cancel review button
        document.addEventListener('click', (e) => {
            if (e.target.id === 'cancel-review') {
                this.closeWriteReviewModal();
            }
        });
    }

    showReviewsModal(productId = 'care-pack-1') {
        const modal = document.getElementById('reviews-modal');
        if (modal) {
            this.renderReviews(productId);
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
        document.body.style.overflow = 'auto';
    }

    showWriteReviewModal() {
        const modal = document.getElementById('write-review-modal');
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            // Focus on the first input
            setTimeout(() => {
                const firstInput = modal.querySelector('input, select, textarea');
                if (firstInput) firstInput.focus();
            }, 100);
        }
    }

    closeWriteReviewModal() {
        const modal = document.getElementById('write-review-modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            
            // Reset form
            const form = document.getElementById('write-review-form');
            if (form) form.reset();
            
            // Reset star rating
            this.resetStarRating();
        }
    }

    renderReviews(productId) {
        const productReviews = this.reviews.filter(review => review.productId === productId);
        const reviewsContainer = document.querySelector('.reviews-list');
        
        if (!reviewsContainer) return;

        if (productReviews.length === 0) {
            reviewsContainer.innerHTML = `
                <div class="no-reviews">
                    <i class="ri-chat-3-line"></i>
                    <h3>No reviews yet</h3>
                    <p>Be the first to review this product!</p>
                    <button class="btn-primary" id="write-review-btn">Write a Review</button>
                </div>
            `;
            return;
        }

        reviewsContainer.innerHTML = productReviews.map(review => `
            <div class="review-item">
                <div class="review-header">
                    <div class="reviewer-info">
                        <img src="${review.userAvatar}" alt="${review.userName}" class="reviewer-avatar">
                        <div class="reviewer-details">
                            <h4>${review.userName} ${review.verified ? '<span class="verified-badge">✓ Verified</span>' : ''}</h4>
                            <div class="review-rating">
                                ${this.generateStars(review.rating)}
                                <span class="review-date">${this.formatDate(review.date)}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="review-content">
                    <h5>${review.title}</h5>
                    <p>${review.comment}</p>
                    <div class="review-actions">
                        <button class="helpful-btn" onclick="reviewsManager.markHelpful('${review.id}')">
                            <i class="ri-thumb-up-line"></i>
                            Helpful (${review.helpful})
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    generateStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<i class="ri-star-fill"></i>';
            } else {
                stars += '<i class="ri-star-line"></i>';
            }
        }
        return stars;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }

    markHelpful(reviewId) {
        const review = this.reviews.find(r => r.id === reviewId);
        if (review) {
            review.helpful += 1;
            this.saveReviews();
            
            // Update the display
            const helpfulBtn = document.querySelector(`[onclick="reviewsManager.markHelpful('${reviewId}')"]`);
            if (helpfulBtn) {
                helpfulBtn.innerHTML = `<i class="ri-thumb-up-line"></i> Helpful (${review.helpful})`;
                
                // Add success animation
                helpfulBtn.classList.add('success-state');
                setTimeout(() => helpfulBtn.classList.remove('success-state'), 600);
            }
        }
    }

    submitReview(form) {
        const formData = new FormData(form);
        const rating = document.querySelector('input[name="rating"]:checked')?.value;
        
        if (!rating) {
            this.showToast('Please select a rating', 'error');
            return;
        }

        const newReview = {
            id: Date.now().toString(),
            productId: 'care-pack-1', // Default for demo
            userName: formData.get('reviewer-name') || 'Anonymous',
            userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
            rating: parseInt(rating),
            title: formData.get('review-title'),
            comment: formData.get('review-content'),
            date: new Date().toISOString().split('T')[0],
            helpful: 0,
            verified: false
        };

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            this.reviews.unshift(newReview);
            this.saveReviews();
            
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            this.closeWriteReviewModal();
            this.showToast('Review submitted successfully!', 'success');
            
            // Refresh reviews if modal is open
            const reviewsModal = document.getElementById('reviews-modal');
            if (reviewsModal && reviewsModal.style.display === 'flex') {
                this.renderReviews('care-pack-1');
            }
        }, 1500);
    }

    resetStarRating() {
        document.querySelectorAll('input[name="rating"]').forEach(input => {
            input.checked = false;
        });
    }

    showToast(message, type = 'info') {
        // Remove existing toasts
        document.querySelectorAll('.toast').forEach(toast => toast.remove());
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icon = type === 'success' ? 'ri-check-line' : 
                    type === 'error' ? 'ri-error-warning-line' : 'ri-information-line';
        
        toast.innerHTML = `
            <i class="${icon}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(toast);
        
        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Hide toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }
}

// Initialize reviews manager
const reviewsManager = new ReviewsManager();

// Global function for product catalog integration
window.showProductReviews = function(productId) {
    reviewsManager.showReviewsModal(productId);
};
