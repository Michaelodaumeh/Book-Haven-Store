function toggleMenu() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  
  if (sidebar && overlay) {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    
    // Prevent body scroll when sidebar is open
    if (sidebar.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
}

// Add keyboard support for hamburger menu
document.addEventListener('DOMContentLoaded', () => {
  const hamburgerMenu = document.getElementById('hamburgerMenu');
  if (hamburgerMenu) {
    hamburgerMenu.addEventListener('keypress', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleMenu();
      }
    });
  }
  
  // Close sidebar when clicking on overlay
  const overlay = document.getElementById('sidebarOverlay');
  if (overlay) {
    overlay.addEventListener('click', toggleMenu);
  }
  
  // Close sidebar when pressing Escape key
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      const sidebar = document.getElementById('sidebar');
      if (sidebar && sidebar.classList.contains('active')) {
        toggleMenu();
      }
    }
  });
});

function showBookOptions(bookElement, event) {
    // Prevent event bubbling for input and button elements
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'BUTTON') return;

    // Close all other book options
    document.querySelectorAll('.book-options').forEach(opt => {
        if (opt !== bookElement.querySelector('.book-options')) {
            opt.style.display = 'none';
        }
    });

    // Toggle current book options
    const options = bookElement.querySelector('.book-options');
    if (options) {
        options.style.display = options.style.display === 'block' ? 'none' : 'block';
    }
}

// Handle keyboard navigation for product cards
function handleProductKeydown(event, bookElement) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        showBookOptions(bookElement, event);
    }
}



document.addEventListener('DOMContentLoaded', () => {
    // Enhanced DOM Elements with better error handling
    const elements = {
        cartList: document.getElementById('cartList'),
        viewCartButton: document.getElementById('view-cart'),
        cartContainer: document.getElementById('cart'),
        addToCartButtons: document.querySelectorAll('.add-to-cart'),
        addToCartBtnButtons: document.querySelectorAll('.add-to-cart-btn'),
        viewWishlistButton: document.getElementById('view-wishlist'),
        wishlistContainer: document.getElementById('wishlist'),
        wishlistList: document.getElementById('wishlistList'),
        addToWishlistButtons: document.querySelectorAll('.add-to-wishlist'),
        wishlistBtnButtons: document.querySelectorAll('.wishlist-btn'),
        quickViewButtons: document.querySelectorAll('.quick-view'),
        searchInput: document.getElementById('searchInput'),
        searchBtn: document.getElementById('searchBtn'),
        books: document.querySelectorAll('.my-book'),
        productCards: document.querySelectorAll('.product-card'),
        cartCount: document.getElementById('cart-count'),
        wishlistCount: document.getElementById('wishlist-count'),
        categoryBtns: document.querySelectorAll('.category-btn'),
        sortSelect: document.getElementById('sortSelect'),
        priceRange: document.getElementById('priceRange'),
        maxPrice: document.getElementById('maxPrice'),
        viewToggle: document.querySelectorAll('.view-btn'),
        loadMoreBtn: document.querySelector('.load-more-btn')
    };

    // Validate required elements exist
    const requiredElements = ['cartList', 'viewCartButton', 'cartContainer', 'wishlistContainer', 'wishlistList', 'viewWishlistButton'];
    const missingElements = requiredElements.filter(id => !elements[id]);
    
    if (missingElements.length > 0) {
        console.error('Required DOM elements not found:', missingElements);
        return;
    }


    const cartItems = []; // Array to hold cart items
    const wishlistItems = []; // Array to hold wishlist items

    // Initialize counters on page load
    updateCartCount();
    updateWishlistCount();

    function updateCartCount() {
        const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
        
        // Update badge count
        if (elements.cartCount) {
            elements.cartCount.textContent = totalItems;
            elements.cartCount.style.display = totalItems > 0 ? 'block' : 'none';
        }
        
        // Update button text for old structure
        const btnText = elements.viewCartButton?.querySelector('.btn-text');
        if (btnText) {
            btnText.textContent = 'Cart';
            btnText.setAttribute('data-count', totalItems);
        }
    }

    function updateWishlistCount() {
        const totalItems = wishlistItems.length;
        
        // Update badge count
        if (elements.wishlistCount) {
            elements.wishlistCount.textContent = totalItems;
            elements.wishlistCount.style.display = totalItems > 0 ? 'block' : 'none';
        }
        
        // Update button text for old structure
        const btnText = elements.viewWishlistButton?.querySelector('.btn-text');
        if (btnText) {
            btnText.textContent = 'Wishlist';
            btnText.setAttribute('data-count', totalItems);
        }
    }

  function renderList(items, container, listElement, updateCountFn, keepOpen = false) {
     listElement.innerHTML = '';

        if (items.length === 0) {
          // Show empty state for cart
          if (listElement.id === 'cartList') {
            showEmptyCart();
          } else if (listElement.id === 'wishlistList') {
            showEmptyWishlist();
          } else {
            listElement.innerHTML = '<p>Your list is empty.</p>';
          }
          return;
        }

       let totalPrice = 0; // total for all items

        items.forEach((item, index) => {
          // Create modern cart item structure
          const cartItemDiv = document.createElement('div');
          cartItemDiv.classList.add('cart-item');

          // Cart item image
          const imageDiv = document.createElement('div');
          imageDiv.classList.add('cart-item-image');
          const img = document.createElement('img');
          img.src = item.image;
          img.alt = item.title;
          imageDiv.appendChild(img);

          // Cart item details
          const detailsDiv = document.createElement('div');
          detailsDiv.classList.add('cart-item-details');
          
          const title = document.createElement('h4');
          title.innerText = item.title;
          
          const price = document.createElement('div');
          price.classList.add('cart-item-price');
          price.innerText = item.price;
          
          detailsDiv.appendChild(title);
          detailsDiv.appendChild(price);

          // Cart item controls
          const controlsDiv = document.createElement('div');
          controlsDiv.classList.add('cart-item-controls');
          
          // Quantity controls
          const quantityDiv = document.createElement('div');
          quantityDiv.classList.add('quantity-controls');
          
          const decreaseBtn = document.createElement('button');
          decreaseBtn.classList.add('quantity-btn');
          decreaseBtn.innerHTML = '−';
          decreaseBtn.addEventListener('click', () => {
            if (item.quantity > 1) {
              item.quantity--;
              qtyDisplay.textContent = item.quantity;
              updateCartSummary();
            }
          });
          
          const qtyDisplay = document.createElement('span');
          qtyDisplay.classList.add('quantity-display');
          qtyDisplay.textContent = item.quantity;
          
          const increaseBtn = document.createElement('button');
          increaseBtn.classList.add('quantity-btn');
          increaseBtn.innerHTML = '+';
          increaseBtn.addEventListener('click', () => {
            item.quantity++;
            qtyDisplay.textContent = item.quantity;
            updateCartSummary();
          });
          
          quantityDiv.appendChild(decreaseBtn);
          quantityDiv.appendChild(qtyDisplay);
          quantityDiv.appendChild(increaseBtn);
          
          // Remove button
          const removeBtn = document.createElement('button');
          removeBtn.classList.add('remove-item-btn');
          removeBtn.innerHTML = '×';
          removeBtn.addEventListener('click', () => {
            items.splice(index, 1);
            updateCountFn();
            renderList(items, container, listElement, updateCountFn, keepOpen);
            updateCartSummary();
          });
          
          controlsDiv.appendChild(quantityDiv);
          controlsDiv.appendChild(removeBtn);
          
          // Assemble cart item
          cartItemDiv.appendChild(imageDiv);
          cartItemDiv.appendChild(detailsDiv);
          cartItemDiv.appendChild(controlsDiv);
          
          listElement.appendChild(cartItemDiv);

        });
        
        // Update cart summary for cart items
        if (container === elements.cartContainer) {
            updateCartSummary();
            
            // Show cart items and hide empty state when there are items
            if (items.length > 0) {
                const cartList = document.getElementById('cartList');
                const cartSummary = document.getElementById('cartSummary');
                const cartEmpty = document.getElementById('cartEmpty');
                
                if (cartList) cartList.style.display = 'block';
                if (cartSummary) cartSummary.style.display = 'block';
                if (cartEmpty) cartEmpty.style.display = 'none';
            }
        }
        
        // Show wishlist items when there are items
        if (container === elements.wishlistContainer && items.length > 0) {
            const wishlistList = document.getElementById('wishlistList');
            const wishlistEmpty = document.getElementById('wishlistEmpty');
            
            if (wishlistList) wishlistList.style.display = 'block';
            if (wishlistEmpty) wishlistEmpty.style.display = 'none';
        }

    };


    elements.viewCartButton.addEventListener('click', function () {
        elements.cartContainer.style.display = 'block';
        renderList(cartItems, elements.cartContainer, elements.cartList, updateCartCount);
        updateCartSummary();

        if (!elements.cartContainer.querySelector('.close-cart-button')) {
            const closeButton = document.createElement('button');
            closeButton.innerHTML = '&times;';
            closeButton.classList.add('close-cart-button');
            closeButton.setAttribute('aria-label', 'Close cart');
            closeButton.addEventListener('click', function () {
                elements.cartContainer.style.display = 'none';
            });
            elements.cartContainer.appendChild(closeButton);
        }
    });

    elements.viewWishlistButton.addEventListener('click', function () {
        elements.wishlistContainer.style.display = 'block';
        renderList(wishlistItems, elements.wishlistContainer, elements.wishlistList, updateWishlistCount);

        if (!elements.wishlistContainer.querySelector('.close-wishlist-button')) {
            const closeButton = document.createElement('button');
            closeButton.innerHTML = '&times;';
            closeButton.classList.add('close-wishlist-button');
            closeButton.setAttribute('aria-label', 'Close wishlist');
            closeButton.addEventListener('click', function () {
                elements.wishlistContainer.style.display = 'none';
            });
            elements.wishlistContainer.appendChild(closeButton);
        }
    });

    // Handle Add to Cart buttons (old structure)
    elements.addToCartButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            try {
                const bookElement = this.closest('.my-book');
                if (!bookElement) {
                    console.error('Book element not found');
                    return;
                }

                const titleElement = bookElement.querySelector('.book-title');
                const priceElement = bookElement.querySelector('.book-price');
                const imageElement = bookElement.querySelector('img');

                if (!titleElement || !priceElement || !imageElement) {
                    console.error('Required book elements not found');
                    return;
                }

                const title = titleElement.innerText;
                const price = priceElement.innerText;
                const image = imageElement.src;

                // Check if already in cart
                const existing = cartItems.find(item => item.title === title);
                if (existing) {
                    existing.quantity += 1;
                } else {
                    cartItems.push({ title, price, image, quantity: 1 });
                }

                updateCartCount();
                
                // Update cart display if cart is currently open
                if (elements.cartContainer.style.display === 'block') {
                    renderList(cartItems, elements.cartContainer, elements.cartList, updateCartCount);
                    updateCartSummary();
                }
                
                // Provide user feedback
                this.textContent = 'Added!';
                setTimeout(() => {
                    this.textContent = 'Add to Cart';
                }, 1000);
            } catch (error) {
                console.error('Error adding item to cart:', error);
            }
        });
    });

    // Handle Add to Cart buttons (new modern structure) - Using event delegation
    document.addEventListener('click', function(event) {
        if (event.target.closest('.add-to-cart-btn')) {
            event.preventDefault();
            const button = event.target.closest('.add-to-cart-btn');
            
            try {
                const productCard = button.closest('.product-card');
                if (!productCard) {
                    console.error('Product card not found');
                    return;
                }

                const titleElement = productCard.querySelector('.product-title');
                const priceElement = productCard.querySelector('.current-price');
                const imageElement = productCard.querySelector('img');

                if (!titleElement || !priceElement || !imageElement) {
                    console.error('Required product elements not found');
                    return;
                }

                const title = titleElement.innerText;
                const price = priceElement.innerText;
                const image = imageElement.src;

                // Check if already in cart
                const existing = cartItems.find(item => item.title === title);
                if (existing) {
                    existing.quantity += 1;
                } else {
                    cartItems.push({ title, price, image, quantity: 1 });
                }

                updateCartCount();
                
                // Update cart display if cart is currently open
                if (elements.cartContainer.style.display === 'block') {
                    renderList(cartItems, elements.cartContainer, elements.cartList, updateCartCount);
                    updateCartSummary();
                }
                
                // Provide user feedback
                const originalText = button.innerHTML;
                button.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2"/></svg>Added!';
                button.style.backgroundColor = '#10b981';
                
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.style.backgroundColor = '';
                }, 1500);
            } catch (error) {
                console.error('Error adding item to cart:', error);
            }
        }
    });

    // Handle Add to Wishlist buttons (old structure)
    elements.addToWishlistButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            try {
                const bookElement = this.closest('.my-book');
                if (!bookElement) {
                    console.error('Book element not found');
                    return;
                }

                const titleElement = bookElement.querySelector('.book-title');
                const priceElement = bookElement.querySelector('.book-price');
                const imageElement = bookElement.querySelector('img');

                if (!titleElement || !priceElement || !imageElement) {
                    console.error('Required book elements not found');
                    return;
                }

                const title = titleElement.innerText;
                const price = priceElement.innerText;
                const image = imageElement.src;

                // Avoid duplicates in wishlist
                const exists = wishlistItems.some(item => item.title === title);
                if (!exists) {
                    wishlistItems.push({ title, price, image, quantity: 1 });
                    updateWishlistCount();
                    
                    // Provide user feedback
                    this.textContent = 'Added!';
                    setTimeout(() => {
                        this.textContent = 'Add to Wishlist';
                    }, 1000);
                } else {
                    // Item already in wishlist
                    this.textContent = 'Already Added';
                    setTimeout(() => {
                        this.textContent = 'Add to Wishlist';
                    }, 1000);
                }
            } catch (error) {
                console.error('Error adding item to wishlist:', error);
            }
        });
    });

    // Handle Add to Wishlist buttons (new modern structure) - Using event delegation
    document.addEventListener('click', function(event) {
        if (event.target.closest('.wishlist-btn')) {
            event.preventDefault();
            const button = event.target.closest('.wishlist-btn');
            
            try {
                const productCard = button.closest('.product-card');
                if (!productCard) {
                    console.error('Product card not found');
                    return;
                }

                const titleElement = productCard.querySelector('.product-title');
                const priceElement = productCard.querySelector('.current-price');
                const imageElement = productCard.querySelector('img');

                if (!titleElement || !priceElement || !imageElement) {
                    console.error('Required product elements not found');
                    return;
                }

                const title = titleElement.innerText;
                const price = priceElement.innerText;
                const image = imageElement.src;

                // Avoid duplicates in wishlist
                const exists = wishlistItems.some(item => item.title === title);
                if (!exists) {
                    wishlistItems.push({ title, price, image, quantity: 1 });
                    updateWishlistCount();
                    
                    // Provide user feedback
                    button.style.color = '#ef4444';
                    button.style.transform = 'scale(1.2)';
                    
                    setTimeout(() => {
                        button.style.color = '';
                        button.style.transform = '';
                    }, 500);
                } else {
                    // Item already in wishlist
                    button.style.color = '#f59e0b';
                    button.style.transform = 'scale(1.1)';
                    
                    setTimeout(() => {
                        button.style.color = '';
                        button.style.transform = '';
                    }, 500);
                }
            } catch (error) {
                console.error('Error adding item to wishlist:', error);
            }
        }
    });

    // Handle Quick View buttons - Using event delegation
    document.addEventListener('click', function(event) {
        if (event.target.closest('.quick-view')) {
            event.preventDefault();
            const button = event.target.closest('.quick-view');
            
            try {
                const productCard = button.closest('.product-card');
                if (!productCard) {
                    console.error('Product card not found');
                    return;
                }

                const titleElement = productCard.querySelector('.product-title');
                const descriptionElement = productCard.querySelector('.product-description');
                const priceElement = productCard.querySelector('.current-price');
                const originalPriceElement = productCard.querySelector('.original-price');
                const imageElement = productCard.querySelector('img');
                const ratingElement = productCard.querySelector('.stars');

                if (!titleElement || !priceElement || !imageElement) {
                    console.error('Required product elements not found');
                    return;
                }

                const title = titleElement.innerText;
                const description = descriptionElement?.innerText || '';
                const price = priceElement.innerText;
                const originalPrice = originalPriceElement?.innerText || '';
                const image = imageElement.src;
                const rating = ratingElement ? ratingElement.querySelectorAll('.star.filled').length : 0;

                // Create quick view modal
                showQuickViewModal({ title, description, price, originalPrice, image, rating });
            } catch (error) {
                console.error('Error showing quick view:', error);
            }
        }
    });

    // Quick View Modal function
    function showQuickViewModal(product) {
        const modal = document.createElement('div');
        modal.className = 'quick-view-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 3000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        `;

        modal.innerHTML = `
            <div class="quick-view-content" style="
                background: white;
                border-radius: 12px;
                max-width: 500px;
                width: 100%;
                max-height: 80vh;
                overflow-y: auto;
                position: relative;
            ">
                <button class="close-quick-view" style="
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: #ef4444;
                    color: white;
                    border: none;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1;
                ">&times;</button>
                
                <div class="quick-view-image" style="
                    width: 100%;
                    height: 300px;
                    overflow: hidden;
                    border-radius: 12px 12px 0 0;
                ">
                    <img src="${product.image}" alt="${product.title}" style="
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    ">
                </div>
                
                <div class="quick-view-details" style="padding: 24px;">
                    <h2 style="
                        font-size: 24px;
                        font-weight: 700;
                        color: #111827;
                        margin-bottom: 12px;
                    ">${product.title}</h2>
                    
                    <p class="quick-view-description" style="
                        color: #6b7280;
                        margin-bottom: 16px;
                        line-height: 1.6;
                    ">${product.description}</p>
                    
                    <div class="quick-view-rating" style="
                        margin-bottom: 16px;
                        font-size: 18px;
                        color: #f59e0b;
                    ">
                        ${'★'.repeat(product.rating)}${'☆'.repeat(5 - product.rating)}
                    </div>
                    
                    <div class="quick-view-price" style="margin-bottom: 24px;">
                        <span class="current-price" style="
                            font-size: 24px;
                            font-weight: 700;
                            color: #111827;
                            margin-right: 8px;
                        ">${product.price}</span>
                        ${product.originalPrice ? 
                            `<span class="original-price" style="
                                font-size: 18px;
                                color: #6b7280;
                                text-decoration: line-through;
                            ">${product.originalPrice}</span>` : 
                            ''
                        }
                    </div>
                    
                    <div class="quick-view-actions" style="display: flex; gap: 12px;">
                        <button class="btn-primary add-to-cart-quick" style="
                            flex: 1;
                            padding: 12px 16px;
                            background: #2563eb;
                            color: white;
                            border: none;
                            border-radius: 8px;
                            font-weight: 600;
                            cursor: pointer;
                            transition: background-color 0.15s;
                        ">Add to Cart</button>
                        <button class="btn-secondary add-to-wishlist-quick" style="
                            flex: 1;
                            padding: 12px 16px;
                            background: white;
                            color: #374151;
                            border: 1px solid #d1d5db;
                            border-radius: 8px;
                            font-weight: 600;
                            cursor: pointer;
                            transition: background-color 0.15s;
                        ">Add to Wishlist</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Add event listeners
        modal.querySelector('.close-quick-view').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.querySelector('.add-to-cart-quick').addEventListener('click', () => {
            // Add to cart logic
            const existing = cartItems.find(item => item.title === product.title);
            if (existing) {
                existing.quantity += 1;
            } else {
                cartItems.push({ 
                    title: product.title, 
                    price: product.price, 
                    image: product.image, 
                    quantity: 1 
                });
            }
            updateCartCount();
            document.body.removeChild(modal);
        });

        modal.querySelector('.add-to-wishlist-quick').addEventListener('click', () => {
            // Add to wishlist logic
            const exists = wishlistItems.some(item => item.title === product.title);
            if (!exists) {
                wishlistItems.push({ 
                    title: product.title, 
                    price: product.price, 
                    image: product.image, 
                    quantity: 1 
                });
                updateWishlistCount();
            }
            document.body.removeChild(modal);
        });

        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    // Handle Category Filters
    elements.categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.dataset.category;
            filterProductsByCategory(category);
        });
    });

    // Filter products by category
    function filterProductsByCategory(category) {
        const allProducts = document.querySelectorAll('.product-card, .my-book');
        
        allProducts.forEach(product => {
            if (category === 'all') {
                product.style.display = 'block';
            } else {
                const productCategory = product.dataset.category;
                if (productCategory === category) {
                    product.style.display = 'block';
                } else {
                    product.style.display = 'none';
                }
            }
        });
    }

    // Handle Sort Select
    if (elements.sortSelect) {
        elements.sortSelect.addEventListener('change', () => {
            const sortBy = elements.sortSelect.value;
            sortProducts(sortBy);
        });
    }

    // Sort products
    function sortProducts(sortBy) {
        const productsContainer = document.getElementById('productsGrid');
        const products = Array.from(productsContainer.children);
        
        products.sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    const priceA = parseFloat(a.querySelector('.current-price, .book-price')?.textContent.replace('$', '') || '0');
                    const priceB = parseFloat(b.querySelector('.current-price, .book-price')?.textContent.replace('$', '') || '0');
                    return priceA - priceB;
                case 'price-high':
                    const priceA2 = parseFloat(a.querySelector('.current-price, .book-price')?.textContent.replace('$', '') || '0');
                    const priceB2 = parseFloat(b.querySelector('.current-price, .book-price')?.textContent.replace('$', '') || '0');
                    return priceB2 - priceA2;
                case 'newest':
                    return b.dataset.category.localeCompare(a.dataset.category);
                case 'popular':
                    const ratingA = a.querySelectorAll('.star.filled').length;
                    const ratingB = b.querySelectorAll('.star.filled').length;
                    return ratingB - ratingA;
                default:
                    return 0;
            }
        });
        
        products.forEach(product => productsContainer.appendChild(product));
    }

    // Handle Price Range
    if (elements.priceRange && elements.maxPrice) {
        elements.priceRange.addEventListener('input', () => {
            const maxPrice = parseInt(elements.priceRange.value);
            elements.maxPrice.textContent = maxPrice;
            filterProductsByPrice(maxPrice);
        });
    }

    // Filter products by price
    function filterProductsByPrice(maxPrice) {
        const allProducts = document.querySelectorAll('.product-card, .my-book');
        
        allProducts.forEach(product => {
            const priceElement = product.querySelector('.current-price, .book-price');
            if (priceElement) {
                const price = parseFloat(priceElement.textContent.replace('$', ''));
                if (price <= maxPrice) {
                    product.style.display = 'block';
                } else {
                    product.style.display = 'none';
                }
            }
        });
    }

    // Handle View Toggle
    elements.viewToggle.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.viewToggle.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const viewMode = btn.dataset.view;
            const productsGrid = document.getElementById('productsGrid');
            
            if (viewMode === 'list') {
                productsGrid.classList.add('list-view');
            } else {
                productsGrid.classList.remove('list-view');
            }
        });
    });

    // Handle Load More
    if (elements.loadMoreBtn) {
        elements.loadMoreBtn.addEventListener('click', () => {
            elements.loadMoreBtn.textContent = 'Loading...';
            elements.loadMoreBtn.disabled = true;
            
            setTimeout(() => {
                elements.loadMoreBtn.textContent = 'Load More Products';
                elements.loadMoreBtn.disabled = false;
                alert('All products loaded!');
            }, 1000);
        });
    }

    // Enhanced search functionality with better UX
    if (elements.searchBtn && elements.searchInput) {
        elements.searchBtn.addEventListener('click', (event) => {
            event.preventDefault();
            performSearch();
        });

        // Add Enter key support for search
        elements.searchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                performSearch();
            }
        });

        // Real-time search as user types (with debouncing)
        let searchTimeout;
        elements.searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                if (elements.searchInput.value.trim().length > 2) {
                    performSearch();
                } else if (elements.searchInput.value.trim().length === 0) {
                    clearSearchResults();
                }
            }, 300);
        });

        function performSearch() {
            const query = elements.searchInput.value.trim().toLowerCase();

            if (query === "") {
                showNotification("Please enter a book name", 'error');
                return;
            }

            let found = false;
            let firstMatch = null;
            let matchCount = 0;

            // Search in old book structure (.my-book)
            elements.books.forEach(book => {
                const titleElement = book.querySelector('.book-title');
                if (!titleElement) return;

                const title = titleElement.innerText.toLowerCase();
                const description = book.querySelector('div:not(.book-title):not(.book-options)')?.innerText.toLowerCase() || '';
                
                if (title.includes(query) || description.includes(query)) {
                    book.style.border = '3px solid #28a200';
                    book.style.backgroundColor = '#e0f7fa';
                    book.style.transform = 'scale(1.02)';
                    book.style.boxShadow = '0 4px 12px rgba(40, 162, 0, 0.3)';
                    if (!firstMatch) firstMatch = book;
                    found = true;
                    matchCount++;
                } else {
                    book.style.border = 'none';
                    book.style.backgroundColor = '';
                    book.style.transform = '';
                    book.style.boxShadow = '';
                }
            });

            // Search in new product card structure (.product-card)
            elements.productCards.forEach(card => {
                const titleElement = card.querySelector('.product-title');
                if (!titleElement) return;

                const title = titleElement.innerText.toLowerCase();
                const description = card.querySelector('.product-description')?.innerText.toLowerCase() || '';
                
                if (title.includes(query) || description.includes(query)) {
                    card.style.border = '3px solid #28a200';
                    card.style.backgroundColor = '#e0f7fa';
                    card.style.transform = 'scale(1.02)';
                    card.style.boxShadow = '0 4px 12px rgba(40, 162, 0, 0.3)';
                    if (!firstMatch) firstMatch = card;
                    found = true;
                    matchCount++;
                } else {
                    card.style.border = 'none';
                    card.style.backgroundColor = '';
                    card.style.transform = '';
                    card.style.boxShadow = '';
                }
            });

            if (found && firstMatch) {
                firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Update search button to show results with better styling
                const searchIcon = elements.searchBtn.querySelector('svg');
                const originalContent = elements.searchBtn.innerHTML;
                
                // Store original styles
                const originalBg = elements.searchBtn.style.backgroundColor;
                const originalColor = elements.searchBtn.style.color;
                const originalBorderRadius = elements.searchBtn.style.borderRadius;
                
                // Update button content and style
                elements.searchBtn.innerHTML = `<span style="font-size: 0.875rem; font-weight: 600;">Found ${matchCount}</span>`;
                elements.searchBtn.style.backgroundColor = '#10b981';
                elements.searchBtn.style.color = 'white';
                elements.searchBtn.style.borderRadius = 'var(--radius-md)';
                elements.searchBtn.style.boxShadow = 'var(--shadow-md)';
                
                setTimeout(() => {
                    // Restore original content and styles
                    elements.searchBtn.innerHTML = originalContent;
                    elements.searchBtn.style.backgroundColor = originalBg;
                    elements.searchBtn.style.color = originalColor;
                    elements.searchBtn.style.borderRadius = originalBorderRadius;
                    elements.searchBtn.style.boxShadow = '';
                }, 3000);
                
                showNotification(`Found ${matchCount} result${matchCount > 1 ? 's' : ''} for "${query}"`, 'success');
            } else {
                showNotification(`No book found matching "${query}"`, 'error');
            }
        }

        function clearSearchResults() {
            // Clear old book structure
            elements.books.forEach(book => {
                book.style.border = 'none';
                book.style.backgroundColor = '';
                book.style.transform = '';
                book.style.boxShadow = '';
            });
            
            // Clear new product card structure
            elements.productCards.forEach(card => {
                card.style.border = 'none';
                card.style.backgroundColor = '';
                card.style.transform = '';
                card.style.boxShadow = '';
            });
            
            // Reset search button to original state
            if (elements.searchBtn) {
                // Restore original search button content and styles
                elements.searchBtn.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                `;
                elements.searchBtn.style.backgroundColor = '';
                elements.searchBtn.style.color = '';
                elements.searchBtn.style.borderRadius = '';
                elements.searchBtn.style.boxShadow = '';
            }
        }
    }

    // Email subscription is now handled by shared.js
    // Gallery-specific functionality continues below

    // Modern Cart Functions
    function updateCartSummary() {
        const cartSummary = document.getElementById('cartSummary');
        const cartEmpty = document.getElementById('cartEmpty');
        const cartSubtotal = document.getElementById('cartSubtotal');
        const cartTotal = document.getElementById('cartTotal');
        
        if (cartItems.length === 0) {
            if (cartSummary) cartSummary.style.display = 'none';
            if (cartEmpty) cartEmpty.style.display = 'flex';
            return;
        }
        
        if (cartEmpty) cartEmpty.style.display = 'none';
        if (cartSummary) cartSummary.style.display = 'block';
        
        // Calculate totals
        const subtotal = cartItems.reduce((total, item) => {
            const price = parseFloat(item.price.replace('$', ''));
            return total + (price * item.quantity);
        }, 0);
        
        const shipping = 5.99;
        const total = subtotal + shipping;
        
        if (cartSubtotal) cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        if (cartTotal) cartTotal.textContent = `$${total.toFixed(2)}`;
    }

    function showEmptyCart() {
        const cartList = document.getElementById('cartList');
        const cartSummary = document.getElementById('cartSummary');
        const cartEmpty = document.getElementById('cartEmpty');
        
        if (cartList) cartList.style.display = 'none';
        if (cartSummary) cartSummary.style.display = 'none';
        if (cartEmpty) cartEmpty.style.display = 'flex';
    }

    function showEmptyWishlist() {
        const wishlistList = document.getElementById('wishlistList');
        const wishlistEmpty = document.getElementById('wishlistEmpty');
        
        if (wishlistList) wishlistList.style.display = 'none';
        if (wishlistEmpty) wishlistEmpty.style.display = 'flex';
    }

    function clearCart() {
        if (confirm('Are you sure you want to clear your cart?')) {
            cartItems.length = 0;
            updateCartCount();
            renderList(cartItems, elements.cartContainer, elements.cartList, updateCartCount);
            updateCartSummary();
            
            // Show success message
            showNotification('Cart cleared successfully!', 'success');
        }
    }

    function proceedToCheckout() {
        if (cartItems.length === 0) {
            showNotification('Your cart is empty!', 'error');
            return;
        }
        
        // Calculate totals
        const subtotal = cartItems.reduce((total, item) => {
            const price = parseFloat(item.price.replace('$', ''));
            return total + (price * item.quantity);
        }, 0);
        
        const shipping = 5.99;
        const total = subtotal + shipping;
        
        // Create order summary
        let orderSummary = 'Order Summary:\n\n';
        cartItems.forEach(item => {
            const itemTotal = parseFloat(item.price.replace('$', '')) * item.quantity;
            orderSummary += `${item.title} x${item.quantity} - $${itemTotal.toFixed(2)}\n`;
        });
        
        orderSummary += `\nSubtotal: $${subtotal.toFixed(2)}`;
        orderSummary += `\nShipping: $${shipping.toFixed(2)}`;
        orderSummary += `\nTotal: $${total.toFixed(2)}`;
        
        // Show checkout confirmation
        if (confirm(`${orderSummary}\n\nProceed to checkout?`)) {
            // Clear cart after successful checkout
            cartItems.length = 0;
            updateCartCount();
            renderList(cartItems, elements.cartContainer, elements.cartList, updateCartCount);
            updateCartSummary();
            
            // Close cart modal
            elements.cartContainer.style.display = 'none';
            
            // Show success message
            showNotification('Order placed successfully! Thank you for your purchase.', 'success');
        }
    }


    // Make functions globally available
    window.clearCart = clearCart;
    window.proceedToCheckout = proceedToCheckout;

});
