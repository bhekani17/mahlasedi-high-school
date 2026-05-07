// Uniform Store JavaScript Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Shopping cart functionality
    let cart = [];
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    
    // Initialize cart from localStorage
    function initializeCart() {
        const savedCart = localStorage.getItem('uniformCart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            updateCartUI();
        }
    }
    
    // Update cart UI
    function updateCartUI() {
        if (cartCount) {
            cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
        }
        if (cartTotal) {
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartTotal.textContent = `R${total.toFixed(2)}`;
        }
        localStorage.setItem('uniformCart', JSON.stringify(cart));
    }
    
    // Add to cart functionality
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const productCard = this.closest('.bg-white');
            const productName = productCard.querySelector('h3')?.textContent || 'Product';
            const productPrice = parseFloat(productCard.querySelector('.font-bold.text-primary')?.textContent.replace('R', ''));
            const sizeSelect = productCard.querySelector('select');
            const quantityInput = productCard.querySelector('input[type="number"]');
            
            const item = {
                id: Date.now(),
                name: productName,
                price: productPrice,
                size: sizeSelect?.value || 'Standard',
                quantity: quantityInput?.value || 1
            };
            
            cart.push(item);
            updateCartUI();
            
            // Show success message
            showNotification('Item added to cart!', 'success');
            
            // Update button state
            button.textContent = 'Added to Cart';
            button.classList.add('bg-green-600');
            button.classList.remove('bg-secondary');
            
            setTimeout(() => {
                button.textContent = 'Add to Cart';
                button.classList.remove('bg-green-600');
                button.classList.add('bg-secondary');
            }, 2000);
        });
    });
    
    // Show notification
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
            type === 'success' ? 'bg-green-500' : 'bg-blue-500'
        } text-white`;
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'} mr-2"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    // Size selector functionality
    document.querySelectorAll('.size-selector').forEach(select => {
        select.addEventListener('change', function() {
            const sizeInfo = this.options[this.selectedIndex]?.dataset.info;
            if (sizeInfo) {
                const infoDiv = this.parentElement.querySelector('.size-info');
                if (infoDiv) {
                    infoDiv.textContent = sizeInfo;
                }
            }
        });
    });
    
    // Quantity input validation
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', function() {
            const value = parseInt(this.value);
            if (value < 1) {
                this.value = 1;
            } else if (value > 10) {
                this.value = 10;
            }
        });
    });
    
    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('bg-secondary'));
            this.classList.add('bg-secondary');
            
            // Filter products
            productCards.forEach(card => {
                if (filter === 'all') {
                    card.style.display = 'block';
                } else {
                    const category = card.dataset.category;
                    card.style.display = category === filter ? 'block' : 'none';
                }
            });
        });
    });
    
    // Search functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            productCards.forEach(card => {
                const productName = card.querySelector('h3')?.textContent.toLowerCase() || '';
                const productDescription = card.querySelector('.text-gray-600')?.textContent.toLowerCase() || '';
                
                if (productName.includes(searchTerm) || productDescription.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
    
    // Price range filter
    const priceRange = document.getElementById('price-range');
    if (priceRange) {
        priceRange.addEventListener('input', function() {
            const maxPrice = parseInt(this.value);
            
            productCards.forEach(card => {
                const price = parseFloat(card.querySelector('.font-bold.text-primary')?.textContent.replace('R', ''));
                if (price <= maxPrice) {
                    card.style.display = 'block';
                } else {
                    cart.style.display = 'none';
                }
            });
        });
    }
    
    // Quick view modal
    const modal = document.getElementById('quick-view-modal');
    const modalClose = document.querySelector('.modal-close');
    
    document.querySelectorAll('.quick-view').forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productInfo = extractProductInfo(productCard);
            
            // Populate modal
            document.getElementById('modal-product-name').textContent = productInfo.name;
            document.getElementById('modal-product-price').textContent = `R${productInfo.price}`;
            document.getElementById('modal-product-description').textContent = productInfo.description;
            document.getElementById('modal-product-image').src = productInfo.image;
            
            // Show modal
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        });
    });
    
    // Close modal
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        });
    }
    
    // Close modal on outside click
    modal?.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    });
    
    // Extract product info
    function extractProductInfo(card) {
        return {
            name: card.querySelector('h3')?.textContent || 'Product',
            price: parseFloat(card.querySelector('.font-bold.text-primary')?.textContent.replace('R', '') || 0),
            description: card.querySelector('.text-gray-600')?.textContent || '',
            image: card.querySelector('img')?.src || ''
        };
    }
    
    // Checkout functionality
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                showNotification('Your cart is empty!', 'error');
                return;
            }
            
            // Redirect to checkout page or show checkout modal
            window.location.href = '#checkout';
        });
    }
    
    // Remove from cart
    document.querySelectorAll('.remove-from-cart').forEach(button => {
        button.addEventListener('click', function() {
            const itemId = parseInt(this.dataset.itemId);
            cart = cart.filter(item => item.id !== itemId);
            updateCartUI();
            showNotification('Item removed from cart', 'info');
        });
    });
    
    // Size chart modal
    const sizeChartModal = document.getElementById('size-chart-modal');
    const sizeChartBtn = document.getElementById('size-chart-btn');
    
    if (sizeChartBtn) {
        sizeChartBtn.addEventListener('click', function() {
            sizeChartModal.classList.remove('hidden');
            sizeChartModal.classList.add('flex');
        });
    }
    
    const sizeChartClose = document.querySelector('.size-chart-close');
    if (sizeChartClose) {
        sizeChartClose.addEventListener('click', function() {
            sizeChartModal.classList.add('hidden');
            sizeChartModal.classList.remove('flex');
        });
    }
    
    // Wishlist functionality
    document.querySelectorAll('.add-to-wishlist').forEach(button => {
        button.addEventListener('click', function() {
            const icon = this.querySelector('i');
            
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                showNotification('Added to wishlist', 'success');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                showNotification('Removed from wishlist', 'info');
            }
        });
    });
    
    // Compare functionality
    let compareItems = [];
    const compareCount = document.getElementById('compare-count');
    
    document.querySelectorAll('.add-to-compare').forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productId = productCard.dataset.productId;
            
            if (compareItems.includes(productId)) {
                // Remove from compare
                compareItems = compareItems.filter(id => id !== productId);
                this.classList.remove('bg-orange-500');
                this.classList.add('bg-gray-200');
            } else {
                // Add to compare
                if (compareItems.length < 3) {
                    compareItems.push(productId);
                    this.classList.remove('bg-gray-200');
                    this.classList.add('bg-orange-500');
                } else {
                    showNotification('Maximum 3 items can be compared', 'error');
                }
            }
            
            if (compareCount) {
                compareCount.textContent = compareItems.length;
            }
        });
    });
    
    // Product image zoom
    document.querySelectorAll('.product-image').forEach(image => {
        image.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });
        
        image.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Lazy loading for images
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
    
    // Initialize
    initializeCart();
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    console.log('Uniform store functionality loaded successfully');
});
