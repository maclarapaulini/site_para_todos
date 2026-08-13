lucide.createIcons();

// const phone = "5511939288314";
const phone = "5514988082038";
const message = "Olá! Gostaria de conhecer melhor os produtos e possibilidades de encomendas personalizadas.";
const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

console.log(whatsappUrl);

const whatsappButton = document.getElementById('whatsapp-btn');
if (whatsappButton) {
    whatsappButton.href = whatsappUrl;
}

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

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            mobileMenu.classList.add('hidden');
        }
    });
});

const contactForm = document.querySelector('form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Obrigada pelo interesse! Em um site real, esta mensagem será enviada para nossa equipe.');
    });
}

const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.card-hover, .group').forEach((el) => {
    observer.observe(el);
});


function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const cart = getCart();

    document.getElementById('cart-count').textContent =
        cart.reduce((total, item) => total + item.quantity, 0);
}

document.addEventListener('click', (e) => {
    const button = e.target.closest('.add-cart');

    if (!button) return;

    const name = button.dataset.name;
    const price = parseFloat(button.dataset.price);
    const cart = getCart();

    const existingProduct =
        cart.find(item => item.name === name);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({
            name,
            price,
            quantity: 1
        });
    }

    saveCart(cart);
    updateCartCount();
});

updateCartCount();