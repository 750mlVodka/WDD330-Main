const baseURL = import.meta.env.VITE_SERVER_URL;

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error('Bad Response');
  }
}

export default class ExternalServices {
  constructor() {}
  
  getData(category) {
    let formattedCategory = category ? category.toLowerCase().trim() : '';
    
    // Map common variations to exact API categories
    const categoryMap = {
      'tent': 'tents',
      'backpack': 'backpacks',
      'sleeping bag': 'sleeping-bags',
      'sleeping bags': 'sleeping-bags',
      'sleeping-bag': 'sleeping-bags',
      'hammock': 'hammocks'
    };
    
    if (categoryMap[formattedCategory]) {
      formattedCategory = categoryMap[formattedCategory];
    }

    return fetch(baseURL + `products/search/${formattedCategory}`)
      .then(convertToJson)
      .then((data) => data.Result);
  }
  
  async findProductById(id) {
    const response = await fetch(baseURL + `product/${id}`);
    const data = await convertToJson(response);
    return data.Result;
  }
}
