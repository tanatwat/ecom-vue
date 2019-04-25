<template lang="html">
<div>
  <search-filter :can-toggle-view="true" :include-discount="true" v-on:search="addQueryParam" v-on:changeView="changeView"></search-filter>
  <pagination :meta="meta" v-on:switched="changePage" v-show="products.length"></pagination>
  <section class="box text-center" v-if="!products.length">
    <h1 class="is-size-3">ไม่มีสินค้า</h1>
    <router-link class="is-size-4" to="/admin/products/upload">เพิ่มสินค้าที่นี่</router-link>
  </section>
  <section style="padding: 30px 0" v-else>
    <div :class="'product-' + view">
      <div class="product-card" v-for="(item, index) in products">
        <div class="product-img-wrapper">
          <img :src="'https://s3-ap-southeast-1.amazonaws.com/images.peach/thumbnail/' + item.thumbnail" alt="">
        </div>
        <div class="product-details-wrapper">
          <a class="product-link">{{ item.name }}</a>
          <p class="product-detail">{{ $number.format(item.price) + ' บาท' }}</p>
        </div>
      </div>
    </div>
  </section>
  <pagination :meta="meta" v-on:switched="changePage" v-show="products.length"></pagination>
</div>
</template>
<script>
import SearchFilter from "../../../../components/Filter";
import Pagination from "../../../../components/Pagination";
export default {
  components: {
    SearchFilter,
    Pagination
  },
  data() {
    return {
      products: [],
      meta: [],
      imgUrl: this.$root.url + "/file/product/thumbnail/",
      query: {
        name: null,
        orderBy: null,
        category: null,
        subcategory: null,
        type: null,
        maxPrice: null,
        minPrice: null,
        discount: null,
        page: null
      },
      view: 'row'
    };
  },
  methods: {
    addQueryParam(params) {
      _.mapValues(this.query, val => {
        val = null;
      });
      this.query.name = params.name;
      this.query.orderBy = params.order;
      this.query.category = params.category;
      this.query.subcategory = params.subcategory;
      this.query.type = params.type;
      this.query.maxPrice = params.max;
      this.query.minPrice = params.min;
      this.query.discount = params.discount ? true : null;
      this.query.page = null;
      this.getProduct();
    },
    changePage(page) {
      this.query.page = page;
      this.getProduct();
    },
    changeView(view) {
      this.view = view;
    },
    getProduct() {
      this.products = [];
      this.$http
        .get("/products", {
          params: {
            name: this.query.name,
            order: this.query.orderBy,
            c: this.query.category,
            sub: this.query.subcategory,
            type: this.query.type,
            max: this.query.maxPrice,
            min: this.query.minPrice,
            dc: this.query.discount,
            page: this.query.page ? this.query.page : 1,
            db: this.$root.database
          }
        })
        .then(
          response => {
            this.products = response.data.data;
            this.meta = {
              last_page: response.data.lastPage,
              current_page: response.data.page,
              total_items: response.data.total,
              page_items: response.data.perPage
            };
          },
          response => {
            toastr.error("เกิดข้อผิดพลาด");
          }
        );
    },
    remove(index, uid) {
      if (confirm("คุณแน่ใจหรือไม่ว่าต้องการจะลบสินค้านี้?")) {
        this.$http.delete("/products/" + uid).then(
          response => {
            toastr.success("ลบสินค้าแล้ว");
            this.getProduct();
          },
          response => {
            toastr.error("เกิดข้อผิดพลาด");
          }
        );
      }
    },
    saleCalc(price, discount) {
      var val = (price - discount) / ((price + discount) / 2);
      var result = val * 100;
      return Math.round(result);
    },
    edit(uid) {
      this.$router.replace("/admin/products/" + uid + "/edit");
    }
  },
  created() {
    this.getProduct();
  }
};
</script>
