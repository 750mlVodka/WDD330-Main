import { renderWithTemplate } from './utils.mjs';

function productCardTemplate(product) {
  let discountHtml = '';
  let originalPriceHtml = '';
  
  if (product.SuggestedRetailPrice > product.FinalPrice) {
    const discount = product.SuggestedRetailPrice - product.FinalPrice;
    const discountPercent = Math.round((discount / product.SuggestedRetailPrice) * 100);
    discountHtml = `<span class="product-discount">-${discountPercent}%</span>`;
    originalPriceHtml = `<p class="product-original-price" style="margin-top: 0; font-size: 0.8em;">SRP: <span class="strikethrough">$${product.SuggestedRetailPrice.toFixed(2)}</span></p>`;
  }

  return `<li class="product-card">
    <a href="../product_pages/index.html?product=${product.Id}">
      <img src="${product.Images.PrimaryMedium}" alt="Image of ${product.Name}" />
      <h3 class="card__brand">${product.Brand.Name}</h3>
      <h2 class="card__name">${product.NameWithoutBrand}</h2>
      <p class="product-card__price">${discountHtml} $${product.FinalPrice.toFixed(2)}</p>
      ${originalPriceHtml}
    </a>
  </li>`;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }
  
  async init() {
    // 1. Fetch the data from the API
    const list = await this.dataSource.getData(this.category);
    
    // 2. Render the list
    this.renderList(list);
    
    // 3. Set the title dynamically
    const titleElement = document.querySelector('.products h2');
    if (titleElement && this.category) {
      // Capitalize first letter
      const formattedCategory = this.category.charAt(0).toUpperCase() + this.category.slice(1).replace('-', ' ');
      titleElement.textContent = `Top Products: ${formattedCategory}`;
    }
  }
  
  renderList(list) {
    const htmlStrings = list.map(productCardTemplate);
    this.listElement.innerHTML = htmlStrings.join('');
  }
}
