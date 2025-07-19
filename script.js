// script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Global Elements ---
    const categoriesDropdownToggle = document.querySelector('.categories-dropdown-toggle');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const cartIcon = document.querySelector('.cart-icon');
    const cartCountSpan = document.querySelector('.cart-count');

    // --- Helper function for Add to Cart click ---
    function handleAddToCartClick(event) {
        const button = event.currentTarget;
        let productName = '';
        if (button.classList.contains('add-to-cart-large')) {
            productName = document.querySelector('.product-title')?.textContent || 'Unknown Product';
        } else {
            productName = button.dataset.productName || 'Unknown Product';
        }

        console.log(`"${productName}" added to cart! (Placeholder action)`);
        if (cartCountSpan) {
            let currentCount = parseInt(cartCountSpan.textContent);
            cartCountSpan.textContent = currentCount + 1;
        }
        // In a real app, you'd send product.id, quantity, etc. to a backend cart API
    }

    // --- Header Navigation (Dropdown, Cart Icon) ---
    if (categoriesDropdownToggle && dropdownMenu) {
        categoriesDropdownToggle.addEventListener('click', (event) => {
            event.preventDefault();
            dropdownMenu.classList.toggle('show-dropdown');
        });

        document.addEventListener('click', (event) => {
            if (!categoriesDropdownToggle.contains(event.target) && !dropdownMenu.contains(event.target)) {
                if (dropdownMenu.classList.contains('show-dropdown')) {
                    dropdownMenu.classList.remove('show-dropdown');
                }
            }
        });
    }

    if (cartIcon) {
        cartIcon.addEventListener('click', (event) => {
            event.preventDefault();
            console.log('Cart icon clicked! This would typically lead to the cart page.');
            // window.location.href = 'cart.html';
        });
    }

    // Initial Attach Add to Cart button listeners (for existing buttons on page load)
    const initialAddToCartButtons = document.querySelectorAll('.btn-add-to-cart, .add-to-cart-large');
    initialAddToCartButtons.forEach(button => {
        button.addEventListener('click', handleAddToCartClick);
    });


    // --- Dynamic Product Loading (products.html & product-detail.html) ---

    // Helper function to create star rating HTML
    const getStarRatingHtml = (rating) => {
        let starsHtml = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            starsHtml += '<i class="fas fa-star"></i>';
        }
        if (hasHalfStar) {
            starsHtml += '<i class="fas fa-star-half-alt"></i>';
        }
        for (let i = 0; i < (5 - fullStars - (hasHalfStar ? 1 : 0)); i++) {
            starsHtml += '<i class="far fa-star"></i>';
        }
        return starsHtml;
    };

    // Function to generate a product card HTML
    const createProductCard = (product) => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        productCard.innerHTML = `
            <a href="product-detail.html?id=${product.id}">
                <img src="${product.imageUrl}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">$${product.price.toFixed(2)}</p>
                <div class="rating">
                    ${getStarRatingHtml(product.rating)}
                </div>
            </a>
            <button class="btn btn-add-to-cart" data-product-id="${product.id}" data-product-name="${product.name}">Add to Cart</button>
        `;
        return productCard;
    };

    // --- Product Listing Page Logic (products.html) ---
    const productGrid = document.querySelector('.product-grid');
    if (productGrid && typeof products !== 'undefined') { // Check if products array exists (from productsData.js)
        productGrid.innerHTML = ''; // Clear any existing placeholder content

        products.forEach(product => {
            productGrid.appendChild(createProductCard(product));
        });

        // Re-attach Add to Cart button listeners after dynamic content is added
        const allAddToCartButtons = document.querySelectorAll('.btn-add-to-cart');
        allAddToCartButtons.forEach(button => {
            button.removeEventListener('click', handleAddToCartClick);
            button.addEventListener('click', handleAddToCartClick);
        });
    }

    // --- Product Detail Page Logic (product-detail.html) ---
    const productDetailPage = document.querySelector('.product-detail-page');
    if (productDetailPage && typeof products !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');

        if (productId) {
            const product = products.find(p => p.id === productId);

            if (product) {
                // Update main image and thumbnails
                const mainProductImage = document.querySelector('.main-product-image');
                if (mainProductImage) mainProductImage.src = product.imageUrl;

                // Update product info
                const productTitle = document.querySelector('.product-title');
                const productRating = document.querySelector('.product-rating');
                const productPrice = document.querySelector('.product-price');
                const productDescription = document.querySelector('.product-description');
                const addToCartBtn = document.querySelector('.add-to-cart-large');

                if (productTitle) productTitle.textContent = product.name;
                if (productRating) {
                    productRating.innerHTML = `${getStarRatingHtml(product.rating)} <span class="rating-text">(${product.rating.toFixed(1)} / 5 - ${product.reviews} Reviews)</span>`;
                }
                if (productPrice) productPrice.textContent = `$${product.price.toFixed(2)}`;
                if (productDescription) productDescription.textContent = product.description;
                if (addToCartBtn) {
                    addToCartBtn.dataset.productId = product.id;
                    addToCartBtn.dataset.productName = product.name;
                }

                document.title = `${product.name} - Your E-commerce Store`;

                // Product Image Gallery Functionality for detail page
                const thumbnails = document.querySelectorAll('.thumbnail-images .thumbnail');
                if (mainProductImage && thumbnails.length > 0) {
                    thumbnails.forEach(thumbnail => {
                        thumbnail.addEventListener('click', () => {
                            mainProductImage.src = thumbnail.src;
                            thumbnails.forEach(t => t.classList.remove('active'));
                            thumbnail.classList.add('active');
                        });
                    });
                }

            } else {
                console.warn(`Product with ID ${productId} not found.`);
                productDetailPage.innerHTML = '<div class="container" style="text-align:center; padding: 50px;"><h2>Product Not Found</h2><p>The product you are looking for does not exist.</p><a href="products.html" class="btn btn-primary" style="margin-top:20px;">Browse All Products</a></div>';
            }
        } else {
            console.warn('No product ID in URL for product detail page.');
        }
    }

    // --- Product Listing Page - Price Range Sliders ---
    const minPriceRange = document.getElementById('price-range-min');
    const maxPriceRange = document.getElementById('price-range-max');
    const minPriceVal = document.getElementById('min-price-val');
    const maxPriceVal = document.getElementById('max-price-val');

    if (minPriceRange && maxPriceRange && minPriceVal && maxPriceVal) {
        const updatePriceDisplay = () => {
            minPriceVal.textContent = `$${minPriceRange.value}`;
            maxPriceVal.textContent = (maxPriceRange.value == maxPriceRange.max) ? `$${maxPriceRange.value}+` : `$${maxPriceRange.value}`;

            if (parseInt(minPriceRange.value) > parseInt(maxPriceRange.value)) {
                minPriceRange.value = maxPriceRange.value;
                minPriceVal.textContent = `$${minPriceRange.value}`;
            }
            if (parseInt(maxPriceRange.value) < parseInt(minPriceRange.value)) {
                maxPriceRange.value = minPriceRange.value;
                maxPriceVal.textContent = (maxPriceRange.value == maxPriceRange.max) ? `$${maxPriceRange.value}+` : `$${maxPriceRange.value}`;
            }
        };

        minPriceRange.addEventListener('input', updatePriceDisplay);
        maxPriceRange.addEventListener('input', updatePriceDisplay);
        updatePriceDisplay();
    }

    // --- Product Detail Page - Tabbed Content ---
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabLinks.length > 0 && tabContents.length > 0) {
        tabLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                const targetTabId = event.target.dataset.tab;

                tabLinks.forEach(l => l.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));

                event.target.classList.add('active');

                const targetContent = document.getElementById(targetTabId);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });

        if (!document.querySelector('.tab-link.active') && tabLinks[0]) {
            tabLinks[0].classList.add('active');
            tabContents[0].classList.add('active');
        }
    }


    // --- Checkout Page Logic (checkout.html) ---
    const progressSteps = document.querySelectorAll('.checkout-progress-bar .progress-step');
    const checkoutStepsContent = document.querySelectorAll('.checkout-steps .checkout-step-content');
    const nextStepBtns = document.querySelectorAll('.checkout-steps .next-step-btn');
    const prevStepBtns = document.querySelectorAll('.checkout-steps .prev-step-btn');
    const editStepBtns = document.querySelectorAll('.review-summary-full .edit-step-btn');
    const placeOrderBtn = document.querySelector('.place-order-btn');

    let currentStepIndex = 0; // Start at the first step (Shipping)

    const updateCheckoutUI = () => {
        progressSteps.forEach((step, index) => {
            if (index === currentStepIndex) {
                step.classList.add('active');
            } else if (index < currentStepIndex) {
                step.classList.add('active');
            }
            else {
                step.classList.remove('active');
            }
        });

        checkoutStepsContent.forEach((content, index) => {
            if (index === currentStepIndex) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });

        if (currentStepIndex === 2) {
            const reviewShippingAddress = document.getElementById('review-shipping-address');
            const reviewPaymentMethod = document.getElementById('review-payment-method');

            const fullName = document.getElementById('fullName')?.value || 'John Doe';
            const address1 = document.getElementById('address1')?.value || '123 Main St';
            const address2 = document.getElementById('address2')?.value ? `, ${document.getElementById('address2').value}` : '';
            const city = document.getElementById('city')?.value || 'Anytown';
            const state = document.getElementById('state')?.value || 'State';
            const zipCode = document.getElementById('zipCode')?.value || '12345';
            const countrySelect = document.getElementById('country');
            const country = countrySelect ? countrySelect.options[countrySelect.selectedIndex].text : 'United States';
            const phone = document.getElementById('phone')?.value || '+123-456-7890';

            if (reviewShippingAddress) {
                reviewShippingAddress.innerHTML = `
                    ${fullName}<br>
                    ${address1}${address2}<br>
                    ${city}, ${state} ${zipCode}<br>
                    ${country}<br>
                    ${phone}
                `;
            }

            const paymentMethodRadios = document.querySelectorAll('input[name="paymentMethod"]');
            let selectedPaymentMethod = 'Not selected';
            paymentMethodRadios.forEach(radio => {
                if (radio.checked) {
                    selectedPaymentMethod = radio.nextElementSibling.textContent.trim();
                    if (radio.value === 'creditCard') {
                        const cardNumber = document.getElementById('cardNumber')?.value || '**** **** **** ****';
                        selectedPaymentMethod += ` ending in ${cardNumber.slice(-4)}`;
                    }
                }
            });

            if (reviewPaymentMethod) {
                reviewPaymentMethod.textContent = selectedPaymentMethod;
            }
        }
    };

    nextStepBtns.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();

            const currentForm = button.closest('form');
            if (currentForm && !currentForm.checkValidity()) {
                currentForm.reportValidity();
                return;
            }

            if (currentStepIndex < checkoutStepsContent.length - 1) {
                currentStepIndex++;
                updateCheckoutUI();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });

    prevStepBtns.forEach(button => {
        button.addEventListener('click', () => {
            if (currentStepIndex > 0) {
                currentStepIndex--;
                updateCheckoutUI();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });

    editStepBtns.forEach(button => {
        button.addEventListener('click', (event) => {
            const targetStepId = event.target.dataset.targetStep;
            const targetStepElement = document.getElementById(targetStepId);

            if (targetStepElement) {
                currentStepIndex = Array.from(checkoutStepsContent).indexOf(targetStepElement);
                updateCheckoutUI();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });

    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', (event) => {
            event.preventDefault();
            console.log('Order Placed! (This is a placeholder action)');
            alert('Your order has been placed successfully! (Placeholder)');
            // window.location.href = 'order-confirmation.html';
        });
    }

    if (document.querySelector('.checkout-page')) { // Only run if on checkout page
        updateCheckoutUI();
    }


    // --- Authentication Page Logic (auth.html) ---
    const authTabLinks = document.querySelectorAll('.auth-tab-link');
    const authTabContents = document.querySelectorAll('.auth-tab-content');
    const switchFormLinks = document.querySelectorAll('.switch-form-link');
    const authForms = document.querySelectorAll('.auth-form-card form');

    if (authTabLinks.length > 0 && authTabContents.length > 0) {
        const switchAuthTab = (targetTabId) => {
            authTabLinks.forEach(link => link.classList.remove('active'));
            authTabContents.forEach(content => content.classList.remove('active'));

            const targetLink = document.querySelector(`.auth-tab-link[data-auth-tab="${targetTabId}"]`);
            if (targetLink) {
                targetLink.classList.add('active');
            }

            const targetContent = document.getElementById(targetTabId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        };

        authTabLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const targetTabId = event.target.dataset.authTab;
                switchAuthTab(targetTabId);
            });
        });

        switchFormLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const targetTabId = event.target.dataset.targetTab;
                switchAuthTab(targetTabId);
            });
        });

        authForms.forEach(form => {
            form.addEventListener('submit', (event) => {
                event.preventDefault();

                const formId = form.closest('.auth-tab-content').id;
                if (formId === 'login') {
                    console.log('Login form submitted!');
                    const email = form.querySelector('#loginEmail').value;
                    const password = form.querySelector('#loginPassword').value;
                    console.log(`Login attempt - Email: ${email}, Password: ${password}`);
                    alert('Login attempt successful! (Placeholder)');
                    // window.location.href = 'account.html';
                } else if (formId === 'signup') {
                    console.log('Signup form submitted!');
                    const fullName = form.querySelector('#signupName').value;
                    const email = form.querySelector('#signupEmail').value;
                    const password = form.querySelector('#signupPassword').value;
                    const confirmPassword = form.querySelector('#confirmPassword').value;

                    if (password !== confirmPassword) {
                        alert('Passwords do not match!');
                        return;
                    }
                    console.log(`Signup attempt - Name: ${fullName}, Email: ${email}, Password: ${password}`);
                    alert('Signup successful! (Placeholder)');
                    // window.location.href = 'account.html';
                }
            });
        });

        if (!document.querySelector('.auth-tab-link.active') && authTabLinks[0]) {
            switchAuthTab(authTabLinks[0].dataset.authTab);
        }
    }
});
