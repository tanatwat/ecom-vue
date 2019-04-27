<template>
<div>
  <search-filter
    :can-toggle-view="true"
    :include-discount="includeDiscount"
    v-on:search="assignData($event)"
    v-on:changeView="view = $event"
  ></search-filter>
  <pagination :meta="meta" v-on:switched="changePage($event)" v-show="products.length"></pagination>
  <products :products="products" :view="view" v-on:link-click="$emit('link-click', $event)"></products>
  <pagination :meta="meta" v-on:switched="changePage($event)" v-show="products.length"></pagination>
</div>

</template>
<script>
export default {
  data() {
    return {
      products: [],
      meta: {},
      view: this.viewProp
    };
  },
  props: {
     viewProp: {
        default: 'grid'
     },
     includeDiscount: {
        default: true
     }
  },
  methods: {
     assignData(data) {
        this.products = data.products
        this.meta = data.meta
     },
     changePage(page) {
        this.meta.current_page = page
     }
  }
};
</script>