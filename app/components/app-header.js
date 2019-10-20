import Component from '@ember/component';
import { computed } from "@ember/object";

export default Component.extend({

    totalItems: computed("items.[]", function() {
        let items = this.get("items");
        return items.reduce((total, item) => parseFloat(total) + parseFloat(item.quantity), 0);
      })

});
