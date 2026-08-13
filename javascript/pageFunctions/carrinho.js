import { supabase } from '../database/supaBase.js';

lucide.createIcons();

const cartItemsContainer =
    document.getElementById('cart-items');

const emptyCart =
    document.getElementById('empty-cart');

const cartTotal =
    document.getElementById('cart-total');

function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function renderCart() {

    const cart = getCart();

    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        emptyCart.classList.remove('hidden');
        // testInsertCartItem();
        updateWhatsappButton([]);
        return;
    }

    emptyCart.classList.add('hidden');

    let total = 0;

    cart.forEach((item, index) => {

        total += item.price * item.quantity;

        const product = document.createElement('div');

        product.className =
            'bg-white rounded-3xl shadow-lg p-6 flex justify-between items-center';

        product.innerHTML = `
        
            <div>
                <h3 class="text-2xl font-bold text-gray-800">
                    ${item.name}
                </h3>
                <div class="flex items-center gap-3 mt-3">

                    <button
                        onclick="decreaseQuantity(${index})"
                        class="w-8 h-8 rounded-full bg-orange-100 text-coral font-bold hover:bg-orange-200 transition">

                        -
                    </button>

                    <span class="text-gray-700 font-semibold">
                        ${item.quantity}
                    </span>

                    <button
                        onclick="increaseQuantity(${index})"
                        class="w-8 h-8 rounded-full bg-orange-100 text-coral font-bold hover:bg-orange-200 transition">

                        +
                    </button>

                </div>

                <p class="text-coral font-bold text-xl mt-2">
                    R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}
                </p>
            </div>

            <button
                onclick="removeItem(${index})"
                class="bg-red-100 text-red-500 px-4 py-2 rounded-full hover:bg-red-200 transition">

                Remover
            </button>
        `;

        cartItemsContainer.appendChild(product);
    });

    cartTotal.textContent =
        `R$ ${total.toFixed(2).replace('.', ',')}`;

    testInsertCartItem();
    updateWhatsappButton(cart);
}

function removeItem(index) {

    const cart = getCart();

    cart.splice(index, 1);

    saveCart(cart);

    renderCart();
}

function increaseQuantity(index) {

    const cart = getCart();

    cart[index].quantity += 1;

    saveCart(cart);

    renderCart();
}

function decreaseQuantity(index) {

    const cart = getCart();

    if (cart[index].quantity > 1) {

        cart[index].quantity -= 1;

    } else {

        cart.splice(index, 1);
    }

    saveCart(cart);

    renderCart();
}

function updateWhatsappButton(cart) {

    // const phone = "5511939288314";
    const phone = "5514988082038";

    let message = "Olá! Tenho interesse nos seguintes produtos: %0A%0A";

    let total = 0;

    cart.forEach(item => {

        const subtotal = item.price * item.quantity;

        total += subtotal;

        message +=
            `• ${item.name} - ${item.quantity}x - R$ ${subtotal.toFixed(2)}%0A`;
    });

    message += `%0ATotal: R$ ${total.toFixed(2)}`;

    const whatsappUrl = `https://wa.me/${phone}?text=${message}`;

    const whatsappButton = document.getElementById('whatsapp-btn');
    whatsappButton.href = whatsappUrl;
}

async function testInsertCartItem() {
    const { data, error } = await supabase
        .from('cart_items')
        .insert({
            cart_id: '80643252-4555-41b3-8712-08bfeeb16f2b',
            product_variant_id: '3615b72b-4abc-423c-9012-e8f172228adf',
            quantity: 4
        })
        .select();
}

window.removeItem = removeItem;
window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;

const testButton = document.getElementById('test-button');
testButton.addEventListener('click', testInsertCartItem);

// testInsertCartItem();
renderCart();