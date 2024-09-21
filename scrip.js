const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");
const pontorefInput = document.getElementById('pontoref');
const nameuserInput = document.getElementById('nameuser');
const nameuserWarn = document.getElementById('nameuser-warn');
const cashamountInput = document.getElementById('cash-amount');
const observacoesInput = document.getElementById('observacoes');
const trocoWarn = document.getElementById('troco-warn');
const deliveryFields = document.getElementById('delivery-fields');
const deliveryMethodRadios = document.querySelectorAll('input[name="delivery-method"]');
const paymentMethodRadios = document.querySelectorAll('input[name="payment"]');
const pagamentoWarn = document.getElementById('pagamento-warn');
const retiradaWarn = document.getElementById('retirada-warn');
const horarioFuncionamento = document.getElementById('horario-funcionamento');
const item1Menu = document.getElementById('item-1');
const item2Menu = document.getElementById('item-2');
const item3Menu = document.getElementById('item-3');

function hoverItem1() {
    item2Menu.style.opacity = '0.7';
    item3Menu.style.opacity = '0.7';
}

function outItem1() {
    item2Menu.style.opacity = '1';
    item3Menu.style.opacity = '1';
}

function hoverItem2() {
    item1Menu.style.opacity = '0.7';
    item3Menu.style.opacity = '0.7';
}

function outItem2() {
    item1Menu.style.opacity = '1';
    item3Menu.style.opacity = '1';
}

function hoverItem3() {
    item2Menu.style.opacity = '0.7';
    item1Menu.style.opacity = '0.7';
}

function outItem3() {
    item2Menu.style.opacity = '1';
    item1Menu.style.opacity = '1';
}

let cart = [];
let paymentMethod = '';

// Abrir o modal do carrinho
cartBtn.addEventListener("click", function() {
    cartModal.style.display = "flex";
});

// Fechar modal quando clicar fora
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none";
    }
});

closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none";
});

menu.addEventListener("click", function(event){
    let parentButton = event.target.closest(".add-to-cart-btn");
    if(parentButton){
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));
        addToCart(name, price);
    }
});

// Função para adicionar no carrinho
function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name);
    if(existingItem){
        // Se o item já existe, aumenta apenas a quantidade +1
        existingItem.quantity += 1;
    } else {
        cart.push({
            name,
            price,
            quantity: 1,
        });
    }
    updateCartModal();
}

// Atualiza o carrinho
function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;
    cart.forEach(item => {
        const cartItemElement = document.createElement("div");  
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");
        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium">${item.name}</p>
                    <p>Quantidade: ${item.quantity}</p>
                    <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                </div>
                <button class="remove-from-cart-btn" data-name="${item.name}">
                    Remover
                </button>
            </div>
        `;
        total += item.price * item.quantity;
        cartItemsContainer.appendChild(cartItemElement);
    });
    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
    cartCounter.innerHTML = cart.length;
}

// Função para remover itens do carrinho
cartItemsContainer.addEventListener("click", function(event) {
    if(event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name");
        removeItemCart(name);
    }
});

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);
    if(index !== -1) {
        const item = cart[index];
        if(item.quantity > 1) {
            item.quantity -= 1;
        } else {
            cart.splice(index, 1);
        }
        updateCartModal();
    }
}

nameuserInput.addEventListener("input", function(event){
    let inputValue = event.target.value;
    if(inputValue !== ""){
        nameuserInput.classList.remove("border-red-500");
        nameuserWarn.classList.add("hidden");
    }
});

addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;
    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500");
        addressWarn.classList.add("hidden");
    }
});

cashamountInput.addEventListener("input", function(event){
    let inputValue = event.target.value;
    if(inputValue !== ""){
        cashamountInput.classList.remove("border-red-500");
        trocoWarn.classList.add("hidden");
    }
});

//Retirada warn
deliveryMethodRadios.forEach(input => {
    input.addEventListener('change', function() {
        retiradaWarn.classList.add('hidden'); // Remove o aviso quando um método é selecionado
    });
});

//Pagamento warn
paymentMethodRadios.forEach(input => {
    input.addEventListener('change', function() {
        pagamentoWarn.classList.add('hidden'); 
    });
});

// Controle de método de entrega (Delivery ou Pickup)
deliveryMethodRadios.forEach(input => {
    input.addEventListener('change', function() {
        const isDelivery = document.getElementById('delivery').checked;
        if (isDelivery) {
            deliveryFields.classList.remove('hidden');
            addressWarn.classList.add('hidden');
        } else {
            deliveryFields.classList.add('hidden');
            addressWarn.classList.add('hidden');
        }
    });
});

// Controle de método de pagamento
paymentMethodRadios.forEach(input => {
    input.addEventListener('change', function() {
        paymentMethod = document.querySelector('input[name="payment"]:checked').value;
        if (paymentMethod === 'cash') {
            document.getElementById('change-selection').classList.remove('hidden');
        } else {
            document.getElementById('change-selection').classList.add('hidden');
        }
    });
});

// Finalizar pedidos
checkoutBtn.addEventListener("click", function(){
    const isOpen = checkRestaurantOpen();
    if(!isOpen){
        Toastify({
            text: "Ops, o restaurante está fechado no momento",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#ef4444",
            },
        }).showToast();
        return;
    }

    if(cart.length === 0) return;
    if(nameuserInput.value === ""){
        nameuserWarn.classList.remove("hidden");
        nameuserWarn.classList.add("border-red-500");
        return;
    }

    const deliveryMethodSelected = document.querySelector('input[name="delivery-method"]:checked');
    if (!deliveryMethodSelected) {
        retiradaWarn.classList.remove('hidden');
        retiradaWarn.classList.add('border-red-500');
        return;
    }

    if(document.getElementById('delivery').checked && addressInput.value === ""){
        addressWarn.classList.remove("hidden");
        addressWarn.classList.add("border-red-500");
        return;
    }

    if (!document.querySelector('input[name="payment"]:checked')) {
        pagamentoWarn.classList.remove('hidden');
        pagamentoWarn.classList.add('border-red-500');
        return;
    }

    if(paymentMethod === 'cash' && cashamountInput.value === ""){
        trocoWarn.classList.remove("hidden");
        trocoWarn.classList.add("border-red-500");
        return;
    }

    // Enviar o pedido para o WhatsApp
    const cartItems = cart.map((item) => {
        return (
            `${item.name}, Quantidade: (${item.quantity})\nPreço: R$${item.price.toFixed(2)}\n`
        );
    }).join("\n");

    const totalCompra = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const deliveryMethod = document.getElementById('delivery').checked ? "Delivery" : "Consumir/Retirar no local";
    const paymentInfo = paymentMethod === 'cash' ? `Dinheiro, precisa de troco: ${cashamountInput.value}` : "Pix";

    const msgInicial = 'Olá, gostaria de fazer um pedido!\n\nPedido:\n\n'
    const message = encodeURIComponent(`${msgInicial} ${cartItems} 

Nome do cliente: ${nameuserInput.value}

Método de retirada: ${deliveryMethod}
${deliveryMethod === "Delivery" ? `Endereço: ${addressInput.value}\nPonto de referência: ${pontorefInput.value}\n` : ''}

Forma de pagamento: ${paymentInfo}

Total do pedido: R$${totalCompra.toFixed(2)}

Observações do cliente, caso tenha: '${observacoesInput.value}'
    `);

    const phone = "+5579996041990";
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

    cart = [];
    updateCartModal();
});

function checkRestaurantOpen() {
    const data = new Date();
    const hora = data.getHours();
    const minutos = data.getMinutes();
    return (hora > 18 || (hora === 18 && minutos >= 00)) && (hora < 23 || (hora === 23 && minutos === 0));
}

const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();
if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
    horarioFuncionamento.innerHTML = 'ABERTO - 18:00 às 23:00'
} else {
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");
}
