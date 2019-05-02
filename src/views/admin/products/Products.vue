<template>
  <div>
    <search-filter
      :can-toggle-view="true"
      :include-discount="true"
      v-on:search="assignData($event)"
      v-on:changeView="view = $event"
    ></search-filter>
    <pagination
      :meta="meta"
      v-show="products.length"
    ></pagination>
    <products
      ref="child"
      :products="products"
      :view="view"
      v-on:link-click="$emit('link-click', $event)"
      :action-bar="true"
      :remove-button="true"
      :edit-button="true"
    ></products>
    <pagination
      :meta="meta"
      v-show="products.length"
    ></pagination>
    <div class="content text-center" v-show="!products.length">
       <h4>ไม่มีสินค้า</h4>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      products: [],
      meta: {},
      view: 'grid'
    };
  },
  methods: {
    assignData(data) {
      this.products = data.products;
      this.meta = data.meta;
    }
  }
};
</script>