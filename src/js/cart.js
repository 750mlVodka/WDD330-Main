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
  <p class="cart-card__quantity">qty: ${item.Quantity || 1}</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

renderCartContents();
loadHeaderFooter();
