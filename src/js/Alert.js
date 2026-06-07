export default class Alert {
  constructor() {
    this.init();
  }

  async init() {
    try {
      const response = await fetch('/json/alerts.json');
      if (response.ok) {
        const alerts = await response.json();
        if (alerts && alerts.length > 0) {
          const section = document.createElement('section');
          section.classList.add('alert-list');
          
          alerts.forEach(alert => {
            const p = document.createElement('p');
            p.textContent = alert.message;
            p.style.backgroundColor = alert.background;
            p.style.color = alert.color;
            section.appendChild(p);
          });
          
          const main = document.querySelector('main');
          if (main) {
            main.prepend(section);
          }
        }
      }
    } catch (error) {
      console.error('Error loading alerts:', error);
    }
  }
}
