// Loading and Animation Utilities
class LoadingManager {
    static showPageLoading() {
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'page-loading';
        loadingOverlay.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner large"></div>
                <p>Loading...</p>
            </div>
        `;
        document.body.appendChild(loadingOverlay);
        return loadingOverlay;
    }

    static hidePageLoading(overlay) {
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 300);
        }
    }

    static showButtonLoading(button) {
        button.classList.add('btn-loading');
        button.disabled = true;
    }

    static hideButtonLoading(button) {
        button.classList.remove('btn-loading');
        button.disabled = false;
    }

    static createSkeletonLoader(container, count = 6) {
        container.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const skeleton = document.createElement('div');
            skeleton.className = 'product-skeleton';
            skeleton.innerHTML = `
                <div class="skeleton-image"></div>
                <div class="skeleton-text"></div>
                <div class="skeleton-text short"></div>
                <div class="skeleton-text medium"></div>
            `;
            container.appendChild(skeleton);
        }
    }
}

// Scroll Progress Indicator
class ScrollIndicator {
    constructor() {
        this.createIndicator();
        this.updateProgress();
        window.addEventListener('scroll', () => this.updateProgress());
    }

    createIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'scroll-indicator';
        document.body.appendChild(indicator);
        this.indicator = indicator;
    }

    updateProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        this.indicator.style.width = scrollPercent + '%';
    }
}

// Animation Utilities
class AnimationUtils {
    static animateCartIcon() {
        const cartIcon = document.querySelector('.cart-icon');
        if (cartIcon) {
            cartIcon.classList.add('bounce');
            setTimeout(() => cartIcon.classList.remove('bounce'), 600);
        }
    }

    static animateWishlistHeart(button) {
        const icon = button.querySelector('i');
        if (icon) {
            button.classList.add('active');
            setTimeout(() => {
                icon.classList.remove('ri-heart-line');
                icon.classList.add('ri-heart-fill');
            }, 150);
        }
    }

    static addSuccessState(element) {
        element.classList.add('success-state');
        setTimeout(() => element.classList.remove('success-state'), 600);
    }

    static addErrorState(element) {
        element.classList.add('error-state');
        setTimeout(() => element.classList.remove('error-state'), 600);
    }

    static enhanceToastAnimations() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.classList && node.classList.contains('toast')) {
                        setTimeout(() => {
                            node.classList.add('removing');
                            setTimeout(() => node.remove(), 300);
                        }, 3000);
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true });
    }
}

// Enhanced form interactions
function enhanceFormInteractions() {
    document.querySelectorAll('input, textarea, select').forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
            if (this.value) {
                this.parentElement.classList.add('filled');
            } else {
                this.parentElement.classList.remove('filled');
            }
        });
    });
}

// Initialize loading and animation systems
document.addEventListener('DOMContentLoaded', function() {
    // Initialize scroll indicator
    new ScrollIndicator();
    
    // Enhance toast animations
    AnimationUtils.enhanceToastAnimations();
    
    // Enhance form interactions
    enhanceFormInteractions();
    
    // Initialize contact form
    if (document.getElementById('contact-form')) {
        initContactForm();
    }
    
    // Add interactive classes to elements
    document.querySelectorAll('.team-member, .contact-card, .value-item').forEach(el => {
        el.classList.add('interactive-element');
    });
    
    // Add nav-link class to navigation links
    document.querySelectorAll('#links a').forEach(link => {
        link.classList.add('nav-link');
    });
});

function locomotiveAnimation() {
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Locomotive Scroll
    const locoScroll = new LocomotiveScroll({
        el: document.querySelector("#main"),
        smooth: true,
        multiplier: 1,
        class: "is-revealed"
    });

    // Update ScrollTrigger when locomotive scroll updates
    locoScroll.on("scroll", ScrollTrigger.update);

    // Set up ScrollTrigger to work with Locomotive Scroll
    ScrollTrigger.scrollerProxy("#main", {
        scrollTop(value) {
            return arguments.length
                ? locoScroll.scrollTo(value, 0, 0)
                : locoScroll.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
            return {
                top: 0,
                left: 0,
                width: window.innerWidth,
                height: window.innerHeight,
            };
        },
        pinType: document.querySelector("#main").style.transform
            ? "transform"
            : "fixed",
    });

    // Refresh ScrollTrigger when locomotive scroll refreshes
    ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
    
    // Initial refresh
    ScrollTrigger.refresh();

    // Return the instance for potential cleanup
    return locoScroll;
}

// Initialize locomotive scroll when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for all elements to be rendered
    setTimeout(() => {
        locomotiveAnimation();
    }, 100);
});

// Navigation bar Animation
function navbarAnimation() {
    gsap.to("#nav-part1 .brand-logo", {
        transform: "translateY(-100%)",
        scrollTrigger: {
            trigger: "#page1",
            scroller: "#main",
            start: "top 0",
            end: "top -5%",
            scrub: true,
        },
    });
    
    gsap.to("#nav-part2 #links", {
        transform: "translateY(-100%)",
        opacity: 0,
        scrollTrigger: {
            trigger: "#page1",
            scroller: "#main",
            start: "top 0",
            end: "top -5%",
            scrub: true,
        },
    });
}
navbarAnimation();

//  video Animation
function videoconAnimation() {
    var videocon = document.querySelector("#video-container");
    var playbtn = document.querySelector("#play");
    videocon.addEventListener("mouseenter", function () {
        gsap.to(playbtn, {
            scale: 1,
            opacity: 1,
        });
    });
    videocon.addEventListener("mouseleave", function () {
        gsap.to(playbtn, {
            scale: 0,
            opacity: 0,
        });
    });
    document.addEventListener("mousemove", function (dets) {
        gsap.to(playbtn, {
            left: dets.x - 70,
            top: dets.y - 80,
        });
    });
}
videoconAnimation();

// Loading Animation
function loadinganimation() {
    gsap.from("#page1 h1", {
        y: 100,
        opacity: 0,
        delay: 0.5,
        duration: 0.9,
        stagger: 0.3,
    });
    gsap.from("#page1 #video-container", {
        scale: 0.9,
        opacity: 0,
        delay: 1.3,
        duration: 0.5,
    });
}
loadinganimation();

// Checkout functionality
function proceedToCheckout() {
  if (cart.items.length === 0) {
    alert('Your cart is empty!');
    return;
  }

  // Create checkout modal
  const checkoutModal = document.createElement('div');
  checkoutModal.className = 'checkout-modal';
  checkoutModal.innerHTML = `
    <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
    <div class="checkout-content">
      <div class="checkout-header">
        <h2>Checkout</h2>
        <button class="close-modal" onclick="this.closest('.checkout-modal').remove()">×</button>
      </div>
      <div class="checkout-body">
        <div class="order-summary">
          <h3>Order Summary</h3>
          <div class="checkout-items">
            ${cart.items.map(item => `
              <div class="checkout-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                  <h4>${item.name}</h4>
                  <p>Quantity: ${item.quantity}</p>
                  <p class="item-price">$${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            `).join('')}
          </div>
          <div class="checkout-total">
            <strong>Total: $${cart.getTotal().toFixed(2)}</strong>
          </div>
        </div>
        <div class="checkout-form">
          <h3>Shipping Information</h3>
          <form id="checkout-form">
            <div class="form-group">
              <label>Full Name</label>
              <input type="text" required placeholder="Enter your full name">
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" required placeholder="Enter your email">
            </div>
            <div class="form-group">
              <label>Address</label>
              <input type="text" required placeholder="Enter your address">
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>City</label>
                <input type="text" required placeholder="City">
              </div>
              <div class="form-group">
                <label>ZIP Code</label>
                <input type="text" required placeholder="ZIP">
              </div>
            </div>
            <div class="form-group">
              <label>Card Number (Demo)</label>
              <input type="text" placeholder="1234 5678 9012 3456" maxlength="19">
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Expiry</label>
                <input type="text" placeholder="MM/YY" maxlength="5">
              </div>
              <div class="form-group">
                <label>CVV</label>
                <input type="text" placeholder="123" maxlength="3">
              </div>
            </div>
            <button type="submit" class="place-order-btn">Place Order ($${cart.getTotal().toFixed(2)})</button>
          </form>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(checkoutModal);

  // Animate modal in
  gsap.fromTo(checkoutModal.querySelector('.checkout-content'), 
    { scale: 0.8, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.3 }
  );

  // Handle form submission
  document.getElementById('checkout-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Simulate order processing
    const submitBtn = this.querySelector('.place-order-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="ri-loader-4-line"></i> Sending...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
      // Clear cart
      cart.items = [];
      cart.saveCart();
      
      // Close modals
      checkoutModal.remove();
      cart.toggleCart();
      
      // Show success message
      showOrderSuccess();
    }, 2000);
  });
}

// Show order success message
function showOrderSuccess() {
  const successModal = document.createElement('div');
  successModal.className = 'success-modal';
  successModal.innerHTML = `
    <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
    <div class="success-content">
      <div class="success-icon">
        <i class="ri-check-line"></i>
      </div>
      <h2>Order Placed Successfully!</h2>
      <p>Thank you for your purchase. You will receive a confirmation email shortly.</p>
      <button onclick="this.closest('.success-modal').remove()" class="continue-btn">Continue Shopping</button>
    </div>
  `;
  
  document.body.appendChild(successModal);
  
  // Animate success modal
  gsap.fromTo(successModal.querySelector('.success-content'), 
    { scale: 0.8, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.4 }
  );
}

// Enhanced scroll animations for new sections
function enhancedScrollAnimations() {
  // Page 4 products animation
  gsap.fromTo('#page4 .products-header', 
    { y: 50, opacity: 0 },
    { 
      y: 0, 
      opacity: 1, 
      duration: 0.8,
      scrollTrigger: {
        trigger: '#page4',
        start: 'top 80%',
        end: 'top 50%',
        toggleActions: 'play none none reverse'
      }
    }
  );
}

enhancedScrollAnimations();

// Contact Form Functionality
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
}

function handleContactSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        subject: formData.get('subject'),
        message: formData.get('message'),
        newsletter: formData.get('newsletter') === 'on'
    };
    
    // Validate required fields
    if (!data.firstName || !data.lastName || !data.email || !data.subject || !data.message) {
        showContactToast('Please fill in all required fields', 'error');
        return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showContactToast('Please enter a valid email address', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('.contact-submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="ri-loader-4-line"></i> Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission (since this is frontend-only)
    setTimeout(() => {
        // Reset form
        e.target.reset();
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Show success message
        showContactToast('Thank you! Your message has been sent successfully. We\'ll get back to you soon!', 'success');
        
        // Store submission in localStorage for demo purposes
        const submissions = JSON.parse(localStorage.getItem('contact-submissions') || '[]');
        submissions.push({
            ...data,
            timestamp: new Date().toISOString(),
            id: Date.now()
        });
        localStorage.setItem('contact-submissions', JSON.stringify(submissions));
        
    }, 2000);
}

function showContactToast(message, type = 'info') {
    // Remove existing toasts
    document.querySelectorAll('.contact-toast').forEach(toast => toast.remove());
    
    const toast = document.createElement('div');
    toast.className = `contact-toast toast-${type}`;
    
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
    }, 5000);
}