import Component from "@ember/component";
import { computed } from "@ember/object";

export default Component.extend({

  publishedProducts: computed("items.[]", function() {
    let items = this.get("items");
    return items;
  })
});
