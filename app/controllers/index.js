import Controller from "@ember/controller";
import { set } from "@ember/object";
import items from "../data/items";

export default Controller.extend({
  showModal: false,
  init() {
    this._super();
    this.set("availableProducts", items);
    this.set("addedProducts", []);
    this.set("totalItems", 0);
    this.set("totalDiscount", 0);
  },
  actions: {
    add: function(item) {
      let newObject = [];
      let subTotal = parseFloat(item.subTotal);
      // add one to the quantity of that item
      set(item, "quantity", item.quantity + 1);
      // if statement to calculate what price should be used
      // it will differ depending on discounts applied
      if (item.productName === "Green Tea") {
        if (parseFloat(item.quantity) % 2 !== 0) {          
          subTotal =
            Math.round(
              (parseFloat(item.subTotal) + parseFloat(item.price)) * 100
            ) / 100;  
        } else {
          set(item, "discount", true);
        }
      } else if (item.productName === "Strawberries") {
        if (parseFloat(item.quantity) <= 2) {
          subTotal = Math.round(item.quantity * item.price * 1000) / 1000;
        } else {
          set(item, "discount", true);
          set(item, "price", 4.5);
          subTotal = Math.round(item.quantity * item.price * 1000) / 1000;
        }
      } else if (item.productName === "Coffee") {
        if (parseFloat(item.quantity) === 3) {
          set(item, "discount", true);
          set(item, "price", Math.round((item.price / 3) * 2 * 100) / 100);
          subTotal = Math.round(item.quantity * item.price * 1000) / 1000;
        } else {
          subTotal = Math.round(item.quantity * item.price * 1000) / 1000;
        }
      }
      // discount action is called with the item
      this.send("discount", item, "add")
      // item subtotal is set
      set(item, "subTotal", subTotal);
      // total quantity of items is calculated and set
      // to display in the nav
      this.set(
        "totalItems",
        items.reduce((total, item) => total + item.quantity, 0)
      );
      // a new object is created based on what is available in the cart
      newObject = this.get("availableProducts").filter(
        item => item.quantity > 0
      );
      this.set("addedProducts", newObject);
    },
    remove: function(item) {
      let newObject = [];
      let subTotal = parseFloat(item.subTotal);
      // if statement to calculate what price should be used
      // calculates new subtotal based on new quantity
      // it will differ depending on discounts applied
      if (item.productName === "Green Tea") {
        if (parseFloat(item.quantity) % 2 !== 0) {
          subTotal =
            Math.round(
              (parseFloat(item.subTotal) - parseFloat(item.price)) * 100
            ) / 100;
        } else if (item.quantity === 2) {
          set(item, "discount", false);
        }
      } else if (item.productName === "Strawberries") {
        if (parseFloat(item.quantity) === 3) {
          set(item, "discount", false);
          set(item, "price", 5);
          subTotal = Math.round(item.quantity * item.price * 1000) / 1000;
        } else {
          subTotal = Math.round(item.quantity * item.price * 1000) / 1000;
        }
      } else if (item.productName === "Coffee") {
        if (parseFloat(item.quantity) === 3) {
          set(item, "discount", false);
          set(item, "price", Math.floor((item.price / 2) * 3 * 100) / 100);
          subTotal = Math.round(item.quantity * item.price * 1000) / 1000;
        } else {
          subTotal = Math.round(item.quantity * item.price * 1000) / 1000;
        }
      }
      // discount action called with the item
      this.send("discount", item, "remove")
      // new subtotal set
      set(item, "subTotal", subTotal);
      // total is calculated for the cart
      this.set(
        "totalItems",
        items.reduce((total, item) => total + item.quantity, 0)
      );
      // remove one from quantity of the item
      set(item, "quantity", item.quantity - 1);
      // a new object is created based on what is available in the cart
      newObject = this.get("availableProducts").filter(
        item => item.quantity > 0
      );
      this.set("addedProducts", newObject);
    },
    delete: function(item) {
      let newObject = [];
      // reset quantity
      set(item, "quantity", 0);
      // reset price
      if (item.productName === "Strawberries") {
        set(item, "discount", false);
        set(item, "price", 5);
      } else if (item.productName === "Coffee") {
        set(item, "discount", false);
        set(item, "price", Math.floor((item.price / 2) * 3 * 100) / 100);
      }
      // reset subtotal
      set(item, "subTotal", 0);
      // adjust total pricing of items in cart
      this.set(
        "totalItems",
        items.reduce((total, item) => total + item.quantity, 0)
      );
      // reset item amountSaved to 0
      set(item, "totalSaved", 0);
      // adjust total totalDiscount amount saved
      this.set(
        "totalDiscount",
        Math.round(items.reduce((total, item) => total + item.totalSaved, 0) * 1000) / 1000
      );
      // adjust items in the cart
      newObject = this.get("availableProducts").filter(
        item => item.quantity > 0
      );
      this.set("addedProducts", newObject);
    },
    discount: function(item, type) {
      let newDiscount = 0;
      let amountSaved = 0;
      // if statement to calculate how much has been saved from the items discount
      if (item.productName === "Green Tea" && parseFloat(item.quantity) % 2 === 0) {
        amountSaved = parseFloat(item.price);
      } else if (item.productName === "Strawberries") {
        amountSaved = 0.5
      } else if (item.productName === "Coffee") {
        amountSaved = parseFloat(item.price / 3)
      }
      // checks if items discount is true, if not, 0 is saved
      if(item.discount){
        if(type === "add"){
          newDiscount = parseFloat(item.totalSaved) + amountSaved
        } else {
          newDiscount = parseFloat(item.totalSaved) - amountSaved
        }
        set(item, "totalSaved", newDiscount);
      } else {
        set(item, "totalSaved", 0);
      }
      // calculate total amount saved from all discounts in the cart
      this.set(
        "totalDiscount",
        Math.round(items.reduce((total, item) => total + item.totalSaved, 0) * 1000) / 1000
      );
    },
    toggleModal(val) {
      this.set("showModal", val);
    }
  }
});