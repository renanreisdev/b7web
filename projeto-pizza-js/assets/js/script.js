const qs = e => document.querySelector(e);
const qsa = e => document.querySelectorAll(e);

let cartWhats = "";
let cart = [];
let modalQuantity = 1;
let modalKey = 0;
let modalPrice = 0;
let modalSizeIndex = 2;
let pizzaJson;

// CASE BROWSER SUPPORT, CREATE A LOCALSTORAGE
if (typeof (Storage) != "undefined") {
    localStorage.cart ? cart = JSON.parse(localStorage.cart) : localStorage.cart = JSON.stringify(cart);
}

// LIST PIZZA
const listPizza = fetch('https://renanreisdev.github.io/b7web/projeto-pizza-js/apiData/apiPizzas.JSON')
    .then(result => result.json())
    .then(data => {
        pizzaJson = data;

        updateCart();

        data.map((item, index) => {
            let pizzaItem = qs('.models .pizza-item').cloneNode(true);

            // FILLING IN THE PIZZA INFORMATION
            pizzaItem.setAttribute('data-key', index);
            pizzaItem.querySelector('.pizza-item--img img').src = item.img;
            pizzaItem.querySelector('.pizza-item--price').innerHTML = `A partir de R$ ${item.prices[0].toLocaleString('pt-br', { minimumFractionDigits: 2 })}`;
            pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
            pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

            pizzaItem.querySelector('a').addEventListener('click', e => {
                e.preventDefault(); // retira o funcionamento padrão o elemento
                let key = e.target.closest('.pizza-item').getAttribute('data-key');
                modalQuantity = 1;
                modalKey = key;

                qs('.pizzaBig img').src = pizzaJson[key].img;
                qs('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
                qs('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
                qs('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].prices[modalSizeIndex].toLocaleString('pt-br', { minimumFractionDigits: 2 })}`;
                qs('.pizzaInfo--totalPrice').innerHTML = `R$ ${pizzaJson[key].prices[modalSizeIndex].toLocaleString('pt-br', { minimumFractionDigits: 2 })}`;
                qs('.pizzaInfo--size.selected').classList.remove('selected');
                qsa('.pizzaInfo--size').forEach((size, sizeIndex) => {
                    if (sizeIndex == 2) {
                        size.classList.add('selected');
                    }
                    size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
                });

                qs('.pizzaInfo--qt').innerHTML = modalQuantity;

                qs('.pizzaWindowArea').style.opacity = 0;
                qs('.pizzaWindowArea').style.display = 'flex';
                setTimeout(() => {
                    qs('.pizzaWindowArea').style.opacity = 1;
                }, 50);
            });

            qs('.pizza-area').append(pizzaItem);
        });
    })
    .catch(error => alert(error));

// MODAL EVENTS
function closeModal() {
    qs('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        qs('.pizzaWindowArea').style.display = 'none';
    }, 500);
}

qsa('.pizzaInfo--cancelMobileButton, .pizzaInfo--cancelButton').forEach((item) => {
    item.addEventListener('click', closeModal);
});

qs('.pizzaInfo--qtless').addEventListener('click', () => {
    if (modalQuantity > 1) {
        qs('.pizzaInfo--qt').innerHTML = --modalQuantity;
        modalPrice = pizzaJson[modalKey].prices[modalSizeIndex] * modalQuantity;
        qs('.pizzaInfo--totalPrice').innerHTML = `R$ ${modalPrice.toLocaleString('pt-br', { minimumFractionDigits: 2 })}`;
    }
});

qs('.pizzaInfo--qtmore').addEventListener('click', () => {
    qs('.pizzaInfo--qt').innerHTML = ++modalQuantity;
    modalPrice = pizzaJson[modalKey].prices[modalSizeIndex] * modalQuantity;
    qs('.pizzaInfo--totalPrice').innerHTML = `R$ ${modalPrice.toLocaleString('pt-br', { minimumFractionDigits: 2 })}`;
});

qsa('.pizzaInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', e => {
        modalSizeIndex = sizeIndex;
        modalPrice = pizzaJson[modalKey].prices[modalSizeIndex] * modalQuantity;
        qs('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
        qs('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[modalKey].prices[modalSizeIndex].toLocaleString('pt-br', { minimumFractionDigits: 2 })}`;
        qs('.pizzaInfo--totalPrice').innerHTML = `R$ ${modalPrice.toLocaleString('pt-br', { minimumFractionDigits: 2 })}`;
    });
});

qs('.pizzaInfo--addButton').addEventListener('click', () => {
    let size = parseInt(qs('.pizzaInfo--size.selected').getAttribute('data-key'));
    let identifier = pizzaJson[modalKey].id + '@' + size;
    let idHasInCart = cart.findIndex((item) => item.identifier == identifier);

    if (idHasInCart > -1) {
        cart[idHasInCart].quantity += modalQuantity;
    } else {
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size,
            quantity: modalQuantity
        });
    }

    updateCart();
    closeModal();
});

qs('.menu-openner').addEventListener('click', () => {
    if (cart.length > 0) {
        qs('aside').style.left = 0;
    }
});

qs('.menu-closer').addEventListener('click', () => {
    qs('aside').style.left = '100vw';
});

function updateCart() {
    qs('.menu-openner span').innerHTML = cart.length;

    if (cart.length > 0) {
        qs('aside').classList.add('show');
        qs('.cart').innerHTML = '';

        let subtotal = 0;
        let discount = 0;
        let total = 0;

        // WHATSAPP MESSAGE
        cartWhats = "*** MEU PEDIDO - Via Delivery Pizzas ***%0A";

        for (let i in cart) {

            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
            subtotal += pizzaItem.prices[cart[i].size] * cart[i].quantity;

            let cartItem = qs('.models .cart--item').cloneNode(true);
            let pizzaName = `${pizzaItem.name} - ${pizzaItem.sizes[cart[i].size]}`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome ').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt ').innerHTML = cart[i].quantity;
            cartItem.querySelector('.cart--item-qtless').addEventListener('click', () => {
                if (cart[i].quantity > 1) {
                    cart[i].quantity--;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmore').addEventListener('click', () => {
                cart[i].quantity++;
                updateCart();
            });

            qs('.cart').append(cartItem);

            // WHATSAPP MESSAGE
            cartWhats += `%0A${cart[i].quantity}un - ${pizzaItem.name} - ${pizzaItem.sizes[cart[i].size]}`;

        }

        discount = subtotal * 0.1;
        total = subtotal - discount;

        // WHATSAPP MESSAGE
        cartWhats += `%0A-------------------------------------`;
        cartWhats += `%0ATOTAL = R$${total.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        qs('.checkout--whatsapp').setAttribute('href', `https://api.whatsapp.com/send?phone=5553984486685&text=${cartWhats}`);

        qs('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        qs('.discount span:last-child').innerHTML = `R$ ${discount.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        qs('.total span:last-child').innerHTML = `R$ ${total.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    } else {
        qs('aside').classList.remove('show');
        qs('aside').style.left = '100vw';
    }

    localStorage.cart = JSON.stringify(cart);
}

qs('.cart--finish').addEventListener('click', () => {
    qs('aside.checkout').style.display = 'flex';
    setTimeout(() => {
        qs('aside.checkout').style.opacity = 1;
    }, 300);
});

qs('.checkout--menu-closer').addEventListener('click', () => {
    qs('aside.checkout').style.opacity = 0;
    setTimeout(() => {
        qs('aside.checkout').style.display = 'none';
    }, 300)

});