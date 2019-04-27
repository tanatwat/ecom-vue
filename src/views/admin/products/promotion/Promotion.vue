<template>
  <div>
    <products view="row" :products="discountProducts"></products>

    <product-view :include-discount="false" view-prop="row" v-on:link-click="modalToggle($event)"></product-view>

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
      <form method="POST" slot="body" @submit.prevent="submit(data.uid, data.index)">
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
import ProductView from '../Products'
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
      view: 'row'
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
    submit(uid, index) {
      this.$http
        .put("/promotions/discount/" + uid, {
          discount: this.discounted
        })
        .then(
          response => {
            this.$root.showModal = false;
            this.data = [];
            this.discount = null;
            this.$refs.child.removeFromArray(index);
            toastr.success("ลดราคาสินค้าแล้ว");
          },
          () => {
            toastr.error("เกิดข้อผิดพลาด");
          }
        );
    }
  },
  created() {
    this.getDiscountProduct();
  }
};
</script>