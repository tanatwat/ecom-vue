<template>
  <div>
    <section style="margin-bottom:30px">
      <label class="label is-medium">ชื่อคอลเล็คชั่น</label>
      <div class="field is-grouped">
        <p class="control">
          <input class="input" type="text" placeholder="Find a repository" v-model="showcase.name">
        </p>
        <p class="control">
          <button :disabled="!showcase.name" class="btn group success" @click="updateName">แก้ไข</button>
        </p>
      </div>
    </section>

    <p></p>
    <section>
      <h2 class="is-size-4 section-heading" :class="{'no-margin' : showcase_products.length}">สินค้าในคอลเล็คชั่น</h2>
      <products
        view="row"
        :products="showcase_products"
        :action-bar="true"
        :action-button="showcaseProp"
        v-on:action-active="removeFromShowcase($event)"
      ></products>
      <div class="content text-center" v-show="!showcase_products.length">
        <h4>ไม่มีสินค้าในคอลเล็คชั่น</h4>
      </div>
    </section>

    <section v-show="products.length">
      <h2 class="content is-size-4 section-heading">สินค้าในร้าน</h2>
      <search-filter
        v-on:search="assignData($event)"
        v-on:changeView="view = $event"
        :parent-data="parentData"
        v-if="loaded"
      ></search-filter>
      <pagination :meta="meta"></pagination>
      <products
        :products="products"
        :view="view"
        :action-bar="true"
        action-bar-class="centered"
        :action-button="productsProp"
        v-on:action-active="addToShowcase($event)"
      ></products>
      <div class="content text-center" v-show="!products.length">
        <h4>ไม่มีสินค้า</h4>
      </div>
      <pagination :meta="meta"></pagination>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showcase: {},
      showcase_products: [],
      productsList: [],
      products: [],
      meta: [],
      showcaseProp: {
        enabled: true,
        title: "ลบออกจากคอลเล็คชั่น"
      },
      productsProp: {
        enabled: true,
        title: "ใส่ในคอลเล็คชั่น"
      },
      view: "row",
      queryString: {},
      loaded: false
    };
  },
  methods: {
    assignData(data) {
      this.products = data.products;
      this.meta = data.meta;
    },

    get() {
      this.$http.get("/showcases/" + this.$route.params.id).then(response => {
        this.showcase = response.data.showcase[0];
        this.showcase_products = response.data.products;
        this.productsList = response.data.showcase[0].products;
        this.parentData = {
          component: "showcase",
          query: this.productsList
        };
        this.loaded = true
      });
    },

    addToShowcase(product) {
      if (confirm("เพิ่มสินค้านี้ในคอลเล็คชั่น?")) {
        let newList = this.productsList.concat([product.id]);
        this.$http
          .put("/showcases/" + this.$route.params.id + "/update_product", {
            products: JSON.stringify(newList)
          })
          .then(
            () => {
              this.productsList = newList;
              this.showcase_products.push(product);
              this.products.splice(product.index, 1);
              toastr.success("เพิ่มในคอลเล็คชั่นแล้ว");
            },
            () => {
              toastr.error("เกิดข้อผิดพลาด");
            }
          );
      }
    },

    removeFromShowcase(product) {
      if (confirm("นำสินค้านี้ออกจากคอลเล็คชั่น?")) {
        let filtered = this.productsList.filter(function(value, index, arr) {
          return value !== product.id;
        });

        this.$http
          .put("/showcases/" + this.$route.params.id + "/update_product", {
            products: JSON.stringify(filtered)
          })
          .then(
            () => {
              this.productsList = filtered;
              this.showcase_products.splice(product.index, 1);
              this.products.push(product);
              toastr.success("ลบออกจากคอลเล็คชั่นแล้ว");
            },
            () => {
              toastr.error("เกิดข้อผิดพลาด");
            }
          );
      }
    },
    updateName() {
      this.$http
        .put("/showcases/" + this.$route.params.id + "/update_name", {
          name: this.showcase.name
        })
        .then(() => {
          toastr.success("แก้ไขชื่อคอลเล็คชั่นแล้ว");
        });
    }
  },
  created() {
    this.get();
  }
};
</script>
