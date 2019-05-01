<template>
  <div id="stock">
    <search-filter
      :can-toggle-view="true"
      :include-discount="true"
      v-on:search="assignData($event)"
      v-on:changeView="view = $event"
    ></search-filter>
    <pagination :meta="meta" v-show="products.length"></pagination>
    <p v-show="products.length">
      <i class="fas fa-asterisk"></i>&nbsp;คลิกที่ชื่อสินค้าเพื่อจัดการสต๊อก
    </p>
    <p><i class="fas fa-circle font-success"></i>&nbsp;มีสินค้า&nbsp;&nbsp;<i class="fas fa-circle font-error"></i>&nbsp;สินค้าหมด</p>
    <products
      ref="child"
      :products="products"
      :view="view"
      :show-stock="true"
      v-on:link-click="modalToggle($event)"
    ></products>
    <pagination :meta="meta" v-show="products.length"></pagination>
    <div class="content text-center" v-show="!products.length">
      <h3>ไม่มีสินค้า</h3>
    </div>
    <modal>
      <header slot="header" class="modal-card-head">
        <p class="modal-card-title">จัดการสต๊อกสินค้า</p>
        <button
          class="btn primary fas fa-times"
          aria-label="close"
          @click="modalToggle"
          type="button"
        ></button>
      </header>
      <form method="POST" slot="body" @submit.prevent="updateStock(data.uid, data.index)">
        <section class="modal-card-body">
          <div class="content text-center">
            <h4>{{ data.name }}</h4>
            <div class="field has-addons has-addons-centered">
              <div class="control">
                <a class="button is-static">สต็อกสินค้า</a>
              </div>
              <div class="control">
                <input required name="stock" class="input" v-model="form.stock" type="number" placeholder="จำนวน" min="0" data-vv-as="สต็อก">
              </div>
            </div>
          </div>
        </section>
        <footer class="modal-card-foot action-wrapper right has-margin" slot="footer">
          <button class="btn success" type="submit">ยืนยัน</button>
          <button class="btn primary" type="button" @click="modalToggle()">ยกเลิก</button>
        </footer>
      </form>
    </modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      products: [],
      view: "row",
      data: {},
      meta: {},
      form: {
        stock: null
      }
    };
  },
  methods: {
    updateStock(uid, index) {
      this.$http.put('/product/' + uid + '/stock/update', {
        qty: this.form.stock
      }).then(() => {
        this.products[index].stock = this.form.stock
        this.modalToggle()
        toastr.success('อัพเดทสต็อกเรียบร้อยแล้ว')
      }, () => {
        toastr.error('เกิดข้อผิดพลาด')
      })
    },
    assignData(data) {
      this.products = data.products;
      this.meta = data.meta;
    },
    modalToggle(data) {
      if (this.$root.showModal) {
         var cleared = _.mapValues(data, () => null)
        this.form.stock = null;
        this.data = cleared;
        this.$root.showModal = false;
      } else {
        this.$root.showModal = true;
        this.form.stock = data.stock;
        this.data = data;
      }
    }
  }
};
</script>

