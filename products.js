// Advanced Product Catalog System
class ProductCatalog {
    constructor() {
        this.products = [
            {
                id: 1,
                name: "Premium Organic Skincare Set",
                price: 89.99,
                originalPrice: 129.99,
                image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&crop=center",
                category: "Care Packs",
                rating: 4.8,
                reviews: 156,
                description: "Complete organic skincare routine with natural ingredients",
                tags: ["Bestseller", "Organic", "Premium"],
                inStock: true,
                badge: "20% OFF"
            },
            {
                id: 2,
                name: "Artisan Coffee Collection",
                price: 34.99,
                originalPrice: 44.99,
                image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop&crop=center",
                category: "Food",
                rating: 4.9,
                reviews: 203,
                description: "Premium single-origin coffee beans from around the world",
                tags: ["Bestseller", "Premium"],
                inStock: true,
                badge: "POPULAR"
            },
            {
                id: 3,
                name: "Luxury Spa Gift Box",
                price: 124.99,
                originalPrice: 159.99,
                image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop&crop=center",
                category: "Gifts",
                rating: 4.7,
                reviews: 89,
                description: "Indulgent spa experience with premium bath products",
                tags: ["Premium", "Eco-Friendly"],
                inStock: true,
                badge: "GIFT"
            },
            {
                id: 4,
                name: "Wellness Tea Blend Set",
                price: 28.99,
                originalPrice: 39.99,
                image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop&crop=center",
                category: "Wellness",
                rating: 4.6,
                reviews: 124,
                description: "Herbal tea collection for relaxation and wellness",
                tags: ["Organic", "Wellness", "New"],
                inStock: true,
                badge: "NEW"
            },
            {
                id: 5,
                name: "Eco-Friendly Bamboo Kitchen Set",
                price: 45.99,
                originalPrice: 65.99,
                image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=center",
                category: "Eco-Friendly",
                rating: 4.5,
                reviews: 78,
                description: "Sustainable bamboo kitchenware for eco-conscious cooking",
                tags: ["Eco-Friendly", "Bestseller"],
                inStock: true,
                badge: "ECO"
            },
            {
                id: 6,
                name: "Gourmet Chocolate Collection",
                price: 52.99,
                originalPrice: 69.99,
                image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&h=400&fit=crop&crop=center",
                category: "Food",
                rating: 4.9,
                reviews: 167,
                description: "Artisan chocolates crafted with premium ingredients",
                tags: ["Premium", "Bestseller"],
                inStock: true,
                badge: "PREMIUM"
            },
            {
                id: 7,
                name: "Mindfulness Journal & Pen Set",
                price: 24.99,
                originalPrice: 34.99,
                image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop&crop=center",
                category: "Wellness",
                rating: 4.4,
                reviews: 92,
                description: "Beautiful journal for mindfulness and daily reflection",
                tags: ["Wellness", "New"],
                inStock: true,
                badge: "NEW"
            },
            {
                id: 8,
                name: "Organic Honey Gift Set",
                price: 38.99,
                originalPrice: 49.99,
                image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop&crop=center",
                category: "Food",
                rating: 4.7,
                reviews: 134,
                description: "Pure organic honey varieties from local beekeepers",
                tags: ["Organic", "Premium"],
                inStock: true,
                badge: "ORGANIC"
            }
        ];
        this.filteredProducts = [...this.products];
        this.currentFilters = {
            category: 'all',
            search: '',
            priceRange: 200,
            tags: [],
            sort: 'featured'
        };
        this.searchSuggestions = [];
        this.searchTimeout = null;
        this.wishlist = JSON.parse(localStorage.getItem('goodtogo-wishlist')) || [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderProducts();
        this.updatePriceDisplay();
        this.generateSearchSuggestions();
        this.setupAutocomplete();
        
        // Ensure products are rendered when page loads
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => this.renderProducts(), 100);
            });
        } else {
            // DOM is already loaded, render immediately
            setTimeout(() => this.renderProducts(), 100);
        }
    }

    setupEventListeners() {
        // Search input with debounce
        const searchInput = document.getElementById('product-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                clearTimeout(this.searchTimeout);
                this.searchTimeout = setTimeout(() => {
                    this.currentFilters.search = e.target.value.toLowerCase();
                    this.applyFilters();
                }, 300);
            });
        }

        // Category filters
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilters.category = e.target.dataset.category;
                this.applyFilters();
            });
        });

        // Sort dropdown
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentFilters.sort = e.target.value;
                this.applyFilters();
            });
        }

        // Price range slider
        const priceRange = document.getElementById('price-range');
        const priceDisplay = document.getElementById('price-display');
        if (priceRange && priceDisplay) {
            priceRange.addEventListener('input', (e) => {
                const value = e.target.value;
                priceDisplay.textContent = `$0 - $${value}`;
                this.currentFilters.priceRange = parseInt(value);
                this.applyFilters();
            });
        }

        // Tag filters
        document.querySelectorAll('.tag-filter').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tag = e.target.dataset.tag;
                const isActive = e.target.classList.contains('active');
                
                if (isActive) {
                    e.target.classList.remove('active');
                    this.currentFilters.tags = this.currentFilters.tags.filter(t => t !== tag);
                } else {
                    e.target.classList.add('active');
                    this.currentFilters.tags.push(tag);
                }
                
                this.applyFilters();
            });
        });
    }

    generateSearchSuggestions() {
        const suggestions = new Set();
        
        this.products.forEach(product => {
            // Add product names
            suggestions.add(product.name.toLowerCase());
            
            // Add individual words from names
            product.name.toLowerCase().split(' ').forEach(word => {
                if (word.length > 2) suggestions.add(word);
            });
            
            // Add categories
            suggestions.add(product.category.toLowerCase());
            
            // Add tags
            product.tags.forEach(tag => suggestions.add(tag.toLowerCase()));
            
            // Add description keywords
            if (product.description) {
                product.description.toLowerCase().split(' ').forEach(word => {
                    if (word.length > 3) suggestions.add(word.replace(/[^\w]/g, ''));
                });
            }
        });
        
        this.searchSuggestions = Array.from(suggestions).filter(s => s.length > 2);
    }

    setupAutocomplete() {
        const searchInput = document.getElementById('product-search');
        if (!searchInput) return;

        // Create autocomplete container
        const autocompleteContainer = document.createElement('div');
        autocompleteContainer.className = 'autocomplete-suggestions';
        autocompleteContainer.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 2px solid #e0e0e0;
            border-top: none;
            border-radius: 0 0 15px 15px;
            max-height: 200px;
            overflow-y: auto;
            z-index: 1000;
            display: none;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        `;

        searchInput.parentElement.appendChild(autocompleteContainer);
        searchInput.parentElement.style.position = 'relative';

        let selectedIndex = -1;

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            selectedIndex = -1;

            if (query.length < 2) {
                autocompleteContainer.style.display = 'none';
                return;
            }

            const matches = this.searchSuggestions
                .filter(suggestion => suggestion.includes(query))
                .slice(0, 8);

            if (matches.length === 0) {
                autocompleteContainer.style.display = 'none';
                return;
            }

            autocompleteContainer.innerHTML = matches
                .map((match, index) => `
                    <div class="autocomplete-item" data-index="${index}" style="
                        padding: 12px 20px;
                        cursor: pointer;
                        border-bottom: 1px solid #f0f0f0;
                        transition: background-color 0.2s ease;
                    " onmouseover="this.style.backgroundColor='#f8f9fa'" 
                       onmouseout="this.style.backgroundColor='white'">
                        ${this.highlightMatch(match, query)}
                    </div>
                `).join('');

            autocompleteContainer.style.display = 'block';

            // Add click listeners to suggestions
            autocompleteContainer.querySelectorAll('.autocomplete-item').forEach(item => {
                item.addEventListener('click', () => {
                    searchInput.value = item.textContent;
                    autocompleteContainer.style.display = 'none';
                    this.currentFilters.search = item.textContent.toLowerCase();
                    this.applyFilters();
                });
            });
        });

        // Keyboard navigation
        searchInput.addEventListener('keydown', (e) => {
            const items = autocompleteContainer.querySelectorAll('.autocomplete-item');
            
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
                this.updateSelection(items, selectedIndex);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                selectedIndex = Math.max(selectedIndex - 1, -1);
                this.updateSelection(items, selectedIndex);
            } else if (e.key === 'Enter' && selectedIndex >= 0) {
                e.preventDefault();
                items[selectedIndex].click();
            } else if (e.key === 'Escape') {
                autocompleteContainer.style.display = 'none';
                selectedIndex = -1;
            }
        });

        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchInput.parentElement.contains(e.target)) {
                autocompleteContainer.style.display = 'none';
            }
        });
    }

    highlightMatch(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<strong style="color: #e59cba;">$1</strong>');
    }

    updateSelection(items, selectedIndex) {
        items.forEach((item, index) => {
            if (index === selectedIndex) {
                item.style.backgroundColor = '#e59cba';
                item.style.color = 'white';
            } else {
                item.style.backgroundColor = 'white';
                item.style.color = 'black';
            }
        });
    }

    applyFilters() {
        // Show skeleton loading
        const container = document.getElementById('products-container');
        LoadingManager.createSkeletonLoader(container, 6);
        
        // Simulate filter processing delay
        setTimeout(() => {
            this.filteredProducts = this.products.filter(product => {
                const matchesCategory = this.currentFilters.category === 'all' || 
                                      product.category === this.currentFilters.category;
                const matchesSearch = !this.currentFilters.search || 
                                    product.name.toLowerCase().includes(this.currentFilters.search.toLowerCase()) ||
                                    product.description.toLowerCase().includes(this.currentFilters.search.toLowerCase());
                const matchesPrice = product.price <= this.currentFilters.priceRange;
                const matchesTags = this.currentFilters.tags.length === 0 || 
                                  this.currentFilters.tags.some(tag => product.tags.includes(tag));
                
                return matchesCategory && matchesSearch && matchesPrice && matchesTags;
            });

            this.sortProducts();
            this.renderProducts();
        }, 600);
    }

    sortProducts() {
        switch (this.currentFilters.sort) {
            case 'price-low':
                this.filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                this.filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                this.filteredProducts.sort((a, b) => b.rating - a.rating);
                break;
            case 'popular':
                this.filteredProducts.sort((a, b) => b.reviews - a.reviews);
                break;
            case 'newest':
                this.filteredProducts.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
                break;
            default: // featured
                this.filteredProducts.sort((a, b) => {
                    const aFeatured = a.tags.includes('Bestseller') ? 1 : 0;
                    const bFeatured = b.tags.includes('Bestseller') ? 1 : 0;
                    return bFeatured - aFeatured;
                });
        }
    }

    renderProducts() {
        const productsContainer = document.getElementById('products-container');
        if (!productsContainer) {
            try {
                // Products container not found - silently return
                return;
            } catch (error) {
                // silently ignore error
            }
        }

        if (this.filteredProducts.length === 0) {
            productsContainer.innerHTML = `
                <div class="no-products">
                    <i class="ri-shopping-bag-line"></i>
                    <h3>No products found</h3>
                    <p>Try adjusting your filters or search terms</p>
                    <button class="btn-secondary" onclick="productCatalog.clearFilters()">Clear Filters</button>
                </div>
            `;
            return;
        }

        productsContainer.innerHTML = this.filteredProducts.map(product => `
            <div class="product-card" data-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    <div class="product-badges">
                        ${product.tags.includes('Bestseller') ? '<span class="badge bestseller">Bestseller</span>' : ''}
                        ${product.tags.includes('New') ? '<span class="badge new">New</span>' : ''}
                        ${product.tags.includes('Organic') ? '<span class="badge organic">Organic</span>' : ''}
                        ${product.tags.includes('Premium') ? '<span class="badge premium">Premium</span>' : ''}
                    </div>
                    <div class="product-actions">
                        <button class="wishlist-btn ${this.isInWishlist(product.id) ? 'active' : ''}" 
                                onclick="productCatalog.toggleWishlist('${product.id}')"
                                title="Add to Wishlist">
                            <i class="ri-heart-${this.isInWishlist(product.id) ? 'fill' : 'line'}"></i>
                        </button>
                        <button class="quick-view-btn" onclick="productCatalog.openQuickView('${product.id}')" title="Quick View">
                            <i class="ri-eye-line"></i>
                        </button>
                        <button class="reviews-btn" onclick="productCatalog.showReviews('${product.id}')" title="Reviews">
                            <i class="ri-chat-3-line"></i>
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <div class="product-rating">
                        ${this.generateStars(product.rating)}
                        <span class="rating-text">${product.rating} (${product.reviews})</span>
                    </div>
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-tags">
                        ${product.tags.slice(0, 2).map(tag => `<span class="feature-tag">${tag}</span>`).join('')}
                    </div>
                    <div class="product-footer">
                        <div class="product-pricing">
                            <span class="product-price">$${product.price.toFixed(2)}</span>
                            ${product.originalPrice ? 
                                `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                        </div>
                        <div class="stock-info">
                            ${product.inStock ? 
                                '<span class="in-stock">In Stock</span>' : 
                                '<span class="out-of-stock">Out of Stock</span>'}
                        </div>
                        <button class="add-to-cart-btn ${!product.inStock ? 'disabled' : ''}" 
                                onclick="productCatalog.addToCart('${product.id}')"
                                ${!product.inStock ? 'disabled' : ''}>
                            <i class="ri-shopping-cart-line"></i>
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Update product count
        this.updateProductCount();
    }

    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let starsHTML = '';
        
        // Full stars
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="ri-star-fill"></i>';
        }
        
        // Half star
        if (hasHalfStar) {
            starsHTML += '<i class="ri-star-half-line"></i>';
        }
        
        // Empty stars
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="ri-star-line"></i>';
        }
        
        return `<div class="stars">${starsHTML}</div>`;
    }

    toggleWishlist(productId) {
        const button = document.querySelector(`[onclick="productCatalog.toggleWishlist('${productId}')"]`);
        const isInWishlist = this.wishlist.includes(productId);
        
        if (isInWishlist) {
            this.wishlist = this.wishlist.filter(id => id !== productId);
            button.classList.remove('active');
            const icon = button.querySelector('i');
            icon.classList.remove('ri-heart-fill');
            icon.classList.add('ri-heart-line');
            this.showToast('Removed from wishlist', 'info');
        } else {
            this.wishlist.push(productId);
            AnimationUtils.animateWishlistHeart(button);
            this.showToast('Added to wishlist!', 'success');
        }
        
        localStorage.setItem('goodtogo-wishlist', JSON.stringify(this.wishlist));
    }

    clearFilters() {
        this.currentFilters = {
            category: 'all',
            search: '',
            priceRange: 200,
            tags: [],
            sort: 'featured'
        };
        
        // Reset UI elements
        document.getElementById('product-search').value = '';
        document.getElementById('price-range').value = 200;
        document.getElementById('sort-select').value = 'featured';
        
        // Reset category buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === 'all');
        });
        
        // Reset tag filters
        document.querySelectorAll('.tag-filter').forEach(btn => {
            btn.classList.remove('active');
        });
        
        this.applyFilters();
    }

    isInWishlist(productId) {
        return this.wishlist.includes(productId);
    }

    openQuickView(productId) {
        this.showQuickView(productId);
    }

    showReviews(productId) {
        const modal = document.getElementById('reviews-modal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    updateProductCount() {
        const count = this.filteredProducts.length;
        const countElement = document.getElementById('product-count');
        if (countElement) {
            countElement.textContent = `${count} product${count !== 1 ? 's' : ''} found`;
        }
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="ri-${type === 'success' ? 'check' : 'information'}-line"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(toast);
        
        gsap.fromTo(toast, 
            { x: 300, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.3 }
        );
        
        setTimeout(() => {
            gsap.to(toast, {
                x: 300,
                opacity: 0,
                duration: 0.3,
                onComplete: () => toast.remove()
            });
        }, 3000);
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product || !product.inStock) return;

        const button = document.querySelector(`[onclick="productCatalog.addToCart('${productId}')"]`);
        if (button) {
            LoadingManager.showButtonLoading(button);
            
            // Simulate API call delay
            setTimeout(() => {
                if (typeof cart !== 'undefined') {
                    cart.addItem(product);
                    AnimationUtils.animateCartIcon();
                    AnimationUtils.addSuccessState(button);
                }
                LoadingManager.hideButtonLoading(button);
                this.showToast(`${product.name} added to cart!`, 'success');
            }, 800);
        }
    }

    showQuickView(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const modal = document.createElement('div');
        modal.className = 'quick-view-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="modal-content">
                <button class="close-modal" onclick="this.closest('.quick-view-modal').remove()">×</button>
                <div class="modal-body">
                    <div class="modal-gallery">
                        <div class="main-image">
                            <img src="${product.image}" alt="${product.name}" id="main-product-image">
                        </div>
                        <div class="thumbnail-images">
                            ${product.tags.map((tag, index) => `
                                <img src="${product.image}" alt="${product.name}" 
                                     class="thumbnail ${index === 0 ? 'active' : ''}"
                                     onclick="document.getElementById('main-product-image').src = this.src; 
                                              document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active')); 
                                              this.classList.add('active');">
                            `).join('')}
                        </div>
                    </div>
                    <div class="modal-info">
                        <div class="product-badges">
                            ${product.tags.includes('bestseller') ? '<span class="badge bestseller">Bestseller</span>' : ''}
                            ${product.tags.includes('new') ? '<span class="badge new">New</span>' : ''}
                        </div>
                        <h2>${product.name}</h2>
                        <div class="product-rating">
                            ${this.generateStars(product.rating)}
                            <span class="rating-text">${product.rating} (${product.reviews} reviews)</span>
                        </div>
                        <p class="modal-description">${product.description}</p>
                        <div class="product-features">
                            <h4>Key Features:</h4>
                            <ul>
                                ${product.tags.map(feature => `<li>${feature}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="product-specifications">
                            <h4>Specifications:</h4>
                            <div class="spec-grid">
                                ${Object.entries({}).map(([key, value]) => `
                                    <div class="spec-item">
                                        <span class="spec-label">${key}:</span>
                                        <span class="spec-value">${value}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        <div class="modal-pricing">
                            <span class="modal-price">$${product.price.toFixed(2)}</span>
                            ${product.originalPrice > product.price ? 
                                `<span class="modal-original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                        </div>
                        <div class="modal-actions">
                            <button class="wishlist-btn-modal ${this.wishlist.includes(product.id) ? 'active' : ''}" 
                                    onclick="productCatalog.toggleWishlist('${product.id}')">
                                <i class="ri-heart-${this.wishlist.includes(product.id) ? 'fill' : 'line'}"></i>
                                ${this.wishlist.includes(product.id) ? 'Remove from' : 'Add to'} Wishlist
                            </button>
                            <button class="modal-add-to-cart" onclick="productCatalog.addToCart('${product.id}'); this.closest('.quick-view-modal').remove();">
                                Add to Cart - $${product.price.toFixed(2)}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Animate modal in
        gsap.fromTo(modal.querySelector('.modal-content'), 
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.3 }
        );
    }

    showAddToCartMessage(productName) {
        const message = document.createElement('div');
        message.className = 'cart-success-message';
        message.innerHTML = `
            <i class="ri-check-line"></i>
            <span>${productName} added to cart!</span>
        `;
        
        document.body.appendChild(message);
        
        gsap.fromTo(message, 
            { y: -100, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.3 }
        );
        
        setTimeout(() => {
            gsap.to(message, {
                y: -100,
                opacity: 0,
                duration: 0.3,
                onComplete: () => message.remove()
            });
        }, 3000);
    }

    animateProductCards() {
        gsap.fromTo('.product-card', 
            { y: 50, opacity: 0 },
            { 
                y: 0, 
                opacity: 1, 
                duration: 0.6,
                stagger: 0.1,
                scrollTrigger: {
                    trigger: '#products-container',
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    }

    getProduct(id) {
        return this.products.find(product => product.id === id);
    }

    getProducts() {
        return this.products;
    }

    filterByCategory(category) {
        this.currentFilters.category = category;
        
        // Update active category button
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });
        
        // Scroll to products section
        document.getElementById('page4').scrollIntoView({ behavior: 'smooth' });
        
        this.applyFilters();
    }
}

// Initialize product catalog
const productCatalog = new ProductCatalog();
