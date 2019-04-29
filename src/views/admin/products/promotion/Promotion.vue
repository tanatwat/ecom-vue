<template>
  <div>
    <div v-show="discountProducts.length">
      <h2 class="content is-size-4">สินค้าลดราคา</h2>
      <button class="btn error" @click="cancleAllPromotion">ยกเลิกโปรโมชั่นทั้งหมด</button>
      <products
        view="row"
        :products="discountProducts"
        v-on:remove-discount="canclePromotion($event)"
        :action-bar="true"
        :remove-discount="true"
      ></products>
    </div>
    <h2 class="content is-size-4">สินค้าในร้าน</h2>
    <div v-show="products.length">
      <search-filter
        :can-toggle-view="true"
        :include-discount="false"
        v-on:search="assignData($event)"
        v-on:changeView="view = $event"
      ></search-filter>
      <pagination :meta="meta"></pagination>
      <p v-show="products.length">
        <i class="fas fa-asterisk"></i>&nbsp;คลิกที่ชื่อสินค้าเพื่อทำการลดราคาสินค้า
      </p>
      <products ref="child" :products="products" :view="view" v-on:link-click="modalToggle($event)"></products>
      <pagination :meta="meta"></pagination>

    </div>
      <div class="content text-center" v-show="!products.length">
        <h3>ไม่มีสินค้า</h3>
      </div>
    <modal>
      <header slot="header" class="modal-card-head">
        <p class="modal-card-title">Modal title</p>
        <button
          class="btn primary fas fa-times"
          aria-label="close"
          @click="$root.showModal = false"
          type="button"
        ></button>
      </header>
      <form method="POST" slot="body" @submit.prevent="submit(data, data.index)">
        <section class="modal-card-body">
          <div class="content text-center">
            <h4>{{ data.name }}</h4>
            <h5>
              ราคา&nbsp;{{ $number.format(data.price) }}&nbsp;
              <span
                class="has-text-success"
                v-show="discount"
              >
                <i class="fas fa-caret-right"></i>
                &nbsp;{{ $number.format(discounted) }}
              </span>
            </h5>
          </div>
          <div class="field has-addons has-addons-centered">
            <p class="control">
              <input
                required
                class="input"
                type="number"
                name="discount"
                placeholder="ส่วนลด"
                v-model="discount"
                min="1"
                :max="data.price - 1"
                v-validate="`max_value:${data.price - 1}|min_value:1`"
                data-vv-as="ส่วนลด"
              >
            </p>
            <p class="control">
              <a class="button is-static">บาท</a>
            </p>
          </div>
          <p class="help is-danger text-center">{{ errors.first('discount') }}</p>
        </section>
        <footer class="modal-card-foot action-wrapper right has-margin" slot="footer">
          <button class="btn success" type="submit">ยืนยัน</button>
          <button class="btn primary" type="button" @click="modalToggle">ยกเลิก</button>
        </footer>
      </form>
    </modal>
  </div>
</template>
<script>
import ProductView from "../Products";
export default {
  components: {
    ProductView
  },
  data() {
    return {
      discountProducts: [],
      products: [],
      meta: {},
      discount: null,
      data: [],
      view: "row"
    };
  },
  computed: {
    discounted() {
      if (this.discount) {
        return this.data.price - this.discount;
      } else {
        return null;
      }
    }
  },
  methods: {
    assignData(data) {
      this.products = data.products;
      this.meta = data.meta;
    },
    modalToggle(item) {
      if (!this.$root.showModal) {
        this.$root.showModal = true;
        this.data = item;
      } else {
        this.$root.showModal = false;
        this.data = [];
      }
    },
    getDiscountProduct() {
      this.$http.get("/get/product_discount").then(response => {
        this.discountProducts = response.data;
      });
    },
    submit(item, index) {
      this.$http
        .put("/promotions/discount/" + item.uid, {
          discount: this.discounted
        })
        .then(
          response => {
            this.$root.showModal = false;
            this.products.splice(index, 1);
            item.discount_price = this.discounted;
            this.discountProducts.push(item);
            this.data = [];
            this.discount = null;
            toastr.success("ลดราคาสินค้าแล้ว");
          },
          () => {
            toastr.error("เกิดข้อผิดพลาด");
          }
        );
    },
    canclePromotion(item) {
      if (confirm("ยกเลิกโปรโมชั่นนี้?")) {
        this.$http.put("/promotions/discount/" + item.uid + "/cancle").then(
          () => {
            this.discountProducts.splice(item.index, 1);
            item.discount_price = null;
            this.products.push(item);
            toastr.success("ยกเลิกโปรโมชั่นแล้ว");
          },
          () => {
            toastr.error("เกิดข้อผิดพลาด");
          }
        );
      }
    },
    cancleAllPromotion() {
      if (confirm("ยกเลิกโปรโมชั่นทั้งหมด?")) {
        this.$http.put("/promotions/discount/cancle_all").then(
          () => {
            this.discountProducts = [];
            toastr.success("ยกเลิกโปรโมชั่นแล้ว");
            document.location.reload();
          },
          () => {
            toastr.error("เกิดข้อผิดพลาด");
          }
        );
      }
    }
  },
  created() {
    this.getDiscountProduct();
  }
};
</script>