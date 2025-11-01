// Shopping Cart Management System
class ShoppingCart {
    constructor() {
        this.items = this.loadCart();
        this.init();
    }

    // Load cart from localStorage
    loadCart() {
        const savedCart = localStorage.getItem('goodtogo-cart');
        return savedCart ? JSON.parse(savedCart) : [];
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('goodtogo-cart', JSON.stringify(this.items));
        this.updateCartDisplay();
    }

    // Add item to cart
    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        this.saveCart();
        this.showAddToCartAnimation();
    }

    // Remove item from cart
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
    }

    // Update item quantity
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
            }
        }
    }

    // Get cart total
    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Get cart item count
    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    // Update cart display in UI
    updateCartDisplay() {
        const cartIcon = document.querySelector('.cart-count');
        const cartTotal = document.querySelector('.cart-total');
        
        if (cartIcon) {
            const count = this.getItemCount();
            cartIcon.textContent = count;
            cartIcon.style.display = count > 0 ? 'block' : 'none';
        }
        
        if (cartTotal) {
            cartTotal.textContent = `$${this.getTotal().toFixed(2)}`;
        }
        
        this.renderCartItems();
    }

    // Render cart items in sidebar
    renderCartItems() {
        const cartItemsContainer = document.querySelector('.cart-items');
        if (!cartItemsContainer) return;

        if (this.items.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            return;
        }

        cartItemsContainer.innerHTML = this.items.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                    <div class="quantity-controls">
                        <button class="quantity-btn minus" onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus" onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <button class="remove-item" onclick="cart.removeItem('${item.id}')">×</button>
            </div>
        `).join('');
    }

    // Show add to cart animation
    showAddToCartAnimation() {
        const cartIcon = document.querySelector('.ri-shopping-cart-line');
        if (cartIcon) {
            cartIcon.style.transform = 'scale(1.2)';
            cartIcon.style.color = '#e59cba';
            setTimeout(() => {
                cartIcon.style.transform = 'scale(1)';
                cartIcon.style.color = '';
            }, 300);
        }
    }

    // Toggle cart sidebar
    toggleCart() {
        const cartSidebar = document.querySelector('.cart-sidebar');
        const cartOverlay = document.querySelector('.cart-overlay');
        if (cartSidebar) {
            cartSidebar.classList.toggle('open');
        }
        if (cartOverlay) {
            cartOverlay.classList.toggle('active');
        }
    }

    // Initialize cart functionality
    init() {
        this.updateCartDisplay();
        
        // Add cart icon click handler
        document.addEventListener('DOMContentLoaded', () => {
            const cartIcon = document.querySelector('.cart-icon');
            if (cartIcon) {
                cartIcon.addEventListener('click', () => this.toggleCart());
            }
        });
    }
}

// Initialize cart
const cart = new ShoppingCart();
