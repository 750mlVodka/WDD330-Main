import { setLocalStorage, getLocalStorage, updateCartCount } from './utils.mjs';

function productDetailsTemplate(product) {
  let discountHtml = '';
  let originalPriceHtml = '';
  
  if (product.SuggestedRetailPrice > product.FinalPrice) {
    const discount = product.SuggestedRetailPrice - product.FinalPrice;
    const discountPercent = Math.round((discount / product.SuggestedRetailPrice) * 100);
    discountHtml = `<span class="product-discount">-${discountPercent}%</span>`;
    originalPriceHtml = `<p class="product-original-price">Suggested Retail Price : <span class="strikethrough">$${product.SuggestedRetailPrice.toFixed(2)}</span></p>`;
  }

  return `
    <h3>${product.Brand.Name}</h3>
    <h2 class="divider">${product.NameWithoutBrand}</h2>
    <img
      class="divider"
      src="${product.Images.PrimaryLarge}"
      alt="${product.NameWithoutBrand}"
    />
    <p class="product-card__price">${discountHtml} $${product.FinalPrice.toFixed(2)}</p>
    ${originalPriceHtml}
    <p class="product__color">${product.Colors[0].ColorName}</p>
    <p class="product__description">${product.DescriptionHtmlSimple}</p>
    <div class="product-detail__add">
      <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
    </div>
  `;
}

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails('main');
    
    // add listener to Add to Cart button
    document
      .getElementById('addToCart')
      .addEventListener('click', this.addToCart.bind(this));
  }

  addToCart() {
    let cart = getLocalStorage('so-cart');
    if (!Array.isArray(cart)) {
      cart = [];
    }
    
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.Id === this.product.Id);
    if (existingItem) {
      existingItem.Quantity = (existingItem.Quantity || 1) + 1;
    } else {
      this.product.Quantity = 1;
      cart.push(this.product);
    }
    
    setLocalStorage('so-cart', cart);
    updateCartCount();
  }

  renderProductDetails(selector) {
    const element = document.querySelector(selector);
    element.insertAdjacentHTML('afterBegin', productDetailsTemplate(this.product));
  }
}
