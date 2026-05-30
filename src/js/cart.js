import { getLocalStorage, setLocalStorage, loadHeaderFooter, updateCartCount } from './utils.mjs';

function renderCartContents() {
  const cartItems = getLocalStorage('so-cart');
  if (cartItems && cartItems.length > 0) {
    const htmlItems = cartItems.map((item) => cartItemTemplate(item));
    document.querySelector('.product-list').innerHTML = htmlItems.join('');
    
    // Total
    let total = 0;
    cartItems.forEach(item => {
      const qty = item.Quantity || 1;
      total += item.FinalPrice * qty;
    });
    
    // New total
    const cartFooter = document.querySelector('.cart-footer');
    const cartTotal = document.querySelector('.cart-total');
    cartTotal.innerHTML = `Total: $${total.toFixed(2)}`;
    cartFooter.classList.remove('hide');
    
    // Add event listeners to remove buttons
    const removeButtons = document.querySelectorAll('.cart-card__remove');
    removeButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        removeItemFromCart(id);
      });
    });
    
    // Add event listeners to quantity inputs
    const qtyInputs = document.querySelectorAll('.cart-qty-input');
    qtyInputs.forEach(input => {
      input.addEventListener('change', (e) => {
        const id = e.currentTarget.dataset.id;
        const newQty = parseInt(e.currentTarget.value, 10);
        changeItemQuantity(id, newQty);
      });
    });
  } else {
    document.querySelector('.product-list').innerHTML = '<p>Your cart is empty.</p>';
    document.querySelector('.cart-footer').classList.add('hide');
  }
}

function removeItemFromCart(id) {
  let cartItems = getLocalStorage('so-cart');
  const itemIndex = cartItems.findIndex(item => item.Id === id);
  if (itemIndex > -1) {
    cartItems.splice(itemIndex, 1);
    setLocalStorage('so-cart', cartItems);
    renderCartContents();
    updateCartCount();
  }
}

function changeItemQuantity(id, newQty) {
  if (newQty < 1) return;
  let cartItems = getLocalStorage('so-cart');
  const itemIndex = cartItems.findIndex(item => item.Id === id);
  if (itemIndex > -1) {
    cartItems[itemIndex].Quantity = newQty;
    setLocalStorage('so-cart', cartItems);
    renderCartContents();
    updateCartCount();
  }
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <span class="cart-card__remove" data-id="${item.Id}"><i class="fa-solid fa-x"></i></span>
  <a href="#" class="cart-card__image">
    <img
      src="${item.Images ? item.Images.PrimaryMedium : item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: <input type="number" class="cart-qty-input" data-id="${item.Id}" value="${item.Quantity || 1}" min="1" style="width: 45px;"></p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

renderCartContents();
loadHeaderFooter();
