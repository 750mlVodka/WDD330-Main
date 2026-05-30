import { renderWithTemplate } from './utils.mjs';

function productCardTemplate(product) {
  let discountHtml = '';
  let originalPriceHtml = '';
  
  if (product.SuggestedRetailPrice > product.FinalPrice) {
    const discount = product.SuggestedRetailPrice - product.FinalPrice;
    const discountPercent = Math.round((discount / product.SuggestedRetailPrice) * 100);
    discountHtml = `<span class="product-discount">-${discountPercent}%</span>`;
    originalPriceHtml = `<p class="product-original-price list-original-price">SRP: <span class="strikethrough">$${product.SuggestedRetailPrice.toFixed(2)}</span></p>`;
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
    this.list = await this.dataSource.getData(this.category);
    
    // 2. Add event listener for sorting
    const sortElement = document.getElementById('sortList');
    if (sortElement) {
      sortElement.addEventListener('change', (e) => {
        this.sortList(e.target.value);
      });
      // Initial sort based on default value
      this.sortList(sortElement.value);
    } else {
      // Fallback if select doesn't exist
      this.renderList(this.list);
    }
    
    // 3. Set the title dynamically and add breadcrumbs
    const titleElement = document.querySelector('.products h2');
    if (titleElement && this.category) {
      // Capitalize first letter
      const formattedCategory = this.category.charAt(0).toUpperCase() + this.category.slice(1).replace('-', ' ');
      titleElement.textContent = `Top Products: ${formattedCategory}`;
      
      // Add breadcrumbs
      const mainElement = document.querySelector('main');
      const breadcrumbs = document.querySelector('.breadcrumbs'); // Check if exists to avoid duplicates
      if (!breadcrumbs) {
        const breadcrumbHtml = `<div class="breadcrumbs list-breadcrumbs">${formattedCategory} -> (${this.list.length} items)</div>`;
        mainElement.insertAdjacentHTML('afterbegin', breadcrumbHtml);
      }
    }
  }

  sortList(sortOption) {
    if (!this.list) return;
    
    const sortedList = [...this.list];
    
    switch (sortOption) {
      case 'name-asc':
        sortedList.sort((a, b) => a.NameWithoutBrand.localeCompare(b.NameWithoutBrand));
        break;
      case 'name-desc':
        sortedList.sort((a, b) => b.NameWithoutBrand.localeCompare(a.NameWithoutBrand));
        break;
      case 'price-asc':
        sortedList.sort((a, b) => a.FinalPrice - b.FinalPrice);
        break;
      case 'price-desc':
        sortedList.sort((a, b) => b.FinalPrice - a.FinalPrice);
        break;
    }
    
    this.renderList(sortedList);
  }
  
  renderList(list) {
    const htmlStrings = list.map(productCardTemplate);
    this.listElement.innerHTML = htmlStrings.join('');
  }
}
