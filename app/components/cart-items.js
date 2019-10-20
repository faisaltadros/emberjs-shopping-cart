import Component from '@ember/component';
import { computed } from "@ember/object";

export default Component.extend({

    totalPrice: computed("items.[]", function() {
        let items = this.get("items");
        return Math.round((items.reduce((total, item) => parseFloat(total) + parseFloat(item.subTotal), 0)) * 100) / 100
      })
});
