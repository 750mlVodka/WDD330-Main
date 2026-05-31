import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const myCheckout = new CheckoutProcess("so-cart", ".checkout-summary");
myCheckout.init();

document.querySelector("#zip").addEventListener("blur", (e) => {
  if(e.target.value !== "") {
    myCheckout.calculateOrderTotal();
  }
});
