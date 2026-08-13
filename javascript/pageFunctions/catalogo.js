import { supabase } from '../database/supaBase.js';

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

document.addEventListener('click', async (e) => {

    const button = e.target.closest('.add-cart');

    if (!button) return;

    const id = button.dataset.id;
    const name = button.dataset.name;
    const price = parseFloat(button.dataset.price);

    console.log('Produto selecionado:', {
        id,
        name,
        price
    });

    button.disabled = true;
    button.textContent = 'Adicionando...';

    const success = await addProductToCart(id);

    button.disabled = false;
    button.textContent = 'Adicionar';

    if (!success) {

        alert('Não foi possível adicionar o produto ao carrinho.');

        return;
    }

    const cart = getCart();

    const existingProduct = cart.find(
        item => item.id === id
    );

    if (existingProduct) {

        existingProduct.quantity += 1;

    } else {

        cart.push({
            id: id,
            name: name,
            price: price,
            quantity: 1
        });

    }

    saveCart(cart);
    updateCartCount();
    openCartModal(name);
});

async function loadProducts() {

    const productsContainer = document.getElementById('products-container');

    const { data: products, error } = await supabase
        .from('products')
        .select('*');

    if (error) {
        console.error('Erro ao buscar produtos:', error);

        productsContainer.innerHTML = `
            <p class="col-span-full text-center text-red-500">
                Não foi possível carregar os produtos.
            </p>
        `;

        return;
    }

    console.log('Produtos recebidos:', products);

    productsContainer.innerHTML = '';

    products.forEach(product => {

        const productCard = document.createElement('div');

        productCard.className =
            'bg-white rounded-3xl overflow-hidden shadow-lg card-hover p-4';

        productCard.innerHTML = `
            <img
                src="${product.image_url}"
                alt="${product.name}"
                class="w-full h-72 object-cover rounded-2xl mb-4">

            <h3 class="text-2xl font-bold text-gray-800 mb-2">
                ${product.name}
            </h3>

            <p class="text-gray-600 mb-4">
                ${product.description}
            </p>

            <div class="flex justify-between items-center">

                <span class="text-2xl font-bold text-coral">
                    R$ ${Number(product.base_price).toFixed(2).replace('.', ',')}
                </span>

                <button class="add-cart bg-coral text-white px-5 py-2 rounded-full hover:opacity-90 transition btn-hover"
                    data-id="${product.id}"
                    data-name="${product.name}"
                    data-price="${product.base_price}">
                    Adicionar
                </button>

            </div>
        `;

        productsContainer.appendChild(productCard);
    });

    lucide.createIcons();
}

function getCartId() {
    return localStorage.getItem('cart_id');
}

async function getOrCreateCart() {

    let cartId = getCartId();

    // Já existe um carrinho para esta sessão
    if (cartId) {
        return cartId;
    }

    const now = new Date().toISOString();

    const { data, error } = await supabase
        .from('carts')
        .insert({
            user_id: 'f85672ef-f499-4a39-9c24-63d0c0756dd2',
            created_at: now,
            updated_at: now
        })
        .select()
        .single();

    if (error) {
        console.error('Erro ao criar carrinho:', error);
        console.error('Código:', error.code);
        console.error('Mensagem:', error.message);
        console.error('Detalhes:', error.details);
        console.error('Hint:', error.hint);

        return null;
    }

    console.log('Carrinho criado:', data);

    cartId = data.id;

    localStorage.setItem('cart_id', cartId);

    return cartId;
}

async function addProductToCart(productId) {

    const cartId = await getOrCreateCart();

    if (!cartId) {
        return false;
    }

    // Verifica se o produto já está no carrinho
    const { data: existingItem, error: selectError } =
        await supabase
            .from('cart_items')
            .select('id, quantity')
            .eq('cart_id', cartId)
            .eq('product_id', productId)
            .maybeSingle();

    if (selectError) {

        console.error(
            'Erro ao verificar item do carrinho:',
            selectError
        );

        return false;
    }


    // Produto já existe → aumenta quantidade
    if (existingItem) {

        const { error: updateError } =
            await supabase
                .from('cart_items')
                .update({
                    quantity: existingItem.quantity + 1
                })
                .eq('id', existingItem.id);

        if (updateError) {

            console.error(
                'Erro ao atualizar quantidade:',
                updateError
            );

            return false;
        }

        return true;
    }


    // Produto ainda não existe → cria item
    const { error: insertError } =
        await supabase
            .from('cart_items')
            .insert({
                cart_id: cartId,
                product_id: productId,
                quantity: 1
            });

    if (insertError) {

        console.error(
            'Erro ao inserir item:',
            insertError
        );

        return false;
    }

    return true;
}

loadProducts();
updateCartCount();