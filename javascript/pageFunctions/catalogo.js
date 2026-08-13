lucide.createIcons();

const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const navbar = document.getElementById('navbar');


mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

window.addEventListener('scroll', () => {

    if (window.scrollY > 50) {
        navbar.classList.add('shadow-md');
    } else {
        navbar.classList.remove('shadow-md');
    }

});

function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}


function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}


function updateCartCount() {

    const cart = getCart();

    const totalItems = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const cartCount = document.getElementById('cart-count');
    const cartCountMobile = document.getElementById('cart-count-mobile');

    if (cartCount) {
        cartCount.textContent = totalItems;
    }

    if (cartCountMobile) {
        cartCountMobile.textContent = totalItems;
    }
}

const cartModal = document.getElementById('cart-modal');
const closeCartModal = document.getElementById('close-cart-modal');
const continueShopping = document.getElementById('continue-shopping');
const modalProductName = document.getElementById('modal-product-name');

function openCartModal(productName) {
    modalProductName.textContent = productName;

    cartModal.classList.remove('hidden');
    cartModal.classList.add('flex');

    document.body.classList.add('overflow-hidden');
}


function closeModal() {
    cartModal.classList.add('hidden');
    cartModal.classList.remove('flex');

    document.body.classList.remove('overflow-hidden');
}

closeCartModal.addEventListener('click', closeModal);
continueShopping.addEventListener('click', closeModal);

cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        closeModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !cartModal.classList.contains('hidden')) {
        closeModal();
    }
});

document.addEventListener('click', (e) => {
    const button = e.target.closest('.add-cart');

    if (!button) return;

    const name = button.dataset.name;
    const price = parseFloat(button.dataset.price);
    const cart = getCart();

    const existingProduct = cart.find(
        item => item.name === name
    );

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }

    saveCart(cart);
    updateCartCount();
    openCartModal(name);
});

updateCartCount();