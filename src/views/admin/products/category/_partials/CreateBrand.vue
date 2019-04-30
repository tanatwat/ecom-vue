<template lang="html">
  <div class="columns is-multiline is-mobile">
    <div class="column is-full">
      <button class="btn primary" @click="$root.showModal = true">
      เพิ่มแบรนด์สินค้า&nbsp;
      <i class="fas fa-plus"></i>
    </button>
    </div>
    <section class="column is-full-mobile order-1-mobile">
      <div class="box">
        <h3 class="section-heading">แบรนด์สินค้าในร้าน</h3>
        <label v-show="!brands.length">ไม่มีแบรนด์สินค้า</label>
        <div class="data-list" v-for="(brand, index) in brands">
          <div class="data-title">
            <label v-show="formVisible !== index">{{ brand.name }}</label>
            <div class="field has-addons" v-show="formVisible == index" style="padding:5px 0">
              <div class="control">
                <input class="input" type="text" placeholder="ชื่อแบรนด์" v-model="brand.name">
              </div>
              <div class="control">
                <button class="button is-success" @click="edit(brand)">
                  ยืนยัน
                </button>
              </div>
            </div>
          </div>
          <div class="action-wrapper right action has-margin">
            <button class="btn-icon primary fas fa-pen" @click="toggleForm(index)"></button>
            <button class="btn-icon error fas fa-trash-alt" @click="remove(brand.id, index)"></button>
          </div>
        </div>
      </div>
    </section>

    <modal>
      <header slot="header" class="modal-card-head">
        <p class="modal-card-title">เพิ่มแบรนด์สินค้า</p>
        <button class="btn primary fas fa-times" @click="$root.showModal = false" type="button"></button>
      </header>
      <form method="POST" slot="body" @submit.prevent="add">
        <section class="modal-card-body">
          <div class="margin-center" style="max-width: 350px">
            <div class="field">
              <label for class="label is-medium">แบรนด์</label>
              <p class="control">
                <input
                  required
                  class="input"
                  name="code"
                  type="text"
                  v-model="form.brand"
                  placeholder="ชื่อแบรนด์"
                  max="20"
                  min="1"
                  v-validate="'required'"
                  data-vv-as="โค๊ด"
                >
              </p>
              <p class="help is-danger text-center">{{ errors.first('code') }}</p>
            </div>
          </div>
        </section>
        <footer class="modal-card-foot action-wrapper right has-margin" slot="footer">
          <button :disabled="!form.brand" class="btn success" type="submit">ยืนยัน</button>
          <button class="btn primary" type="button" @click="$root.showModal = false">ยกเลิก</button>
        </footer>
      </form>
    </modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      brands: [],
      form: {
        brand: null
      },
      formVisible: null
    };
  },
  methods: {
    get() {
      this.$http.get("/brands").then(response => {
        this.brands = response.data;
      });
    },
    add() {
      if (confirm("เพิ่มแบรนด์สินค้านี้?")) {
        this.$http
          .post("/brands", {
            brand: this.form.brand
          })
          .then(response => {
            this.form.brand = null;
            this.brands.push(response.data);
            toastr.success("เพิ่มแบรนด์สินค้าแล้ว");
          });
      }
    },
    edit(brand) {
      if (confirm("แก้ไขชื่อแบรนด์นี้?")) {
        this.$http
          .put("/brands/" + brand.id, {
            brand: brand.name
          })
          .then(response => {
            this.formVisible = null;
            toastr.success("อัพเดทแบรนด์แล้ว");
          });
      }
    },
    remove(id, index) {
      if (confirm("คุณแน่ใจหรือไม่ว่าจะลบ?")) {
        this.$http.delete("/brands/" + id).then(() => {
          this.brands.splice(index, 1);
          toastr.success("ลบแบรนด์สินค้าแล้ว");
        });
      }
    },
    toggleForm(index) {
      if (this.formVisible == index) {
        this.formVisible = null;
      } else {
        this.formVisible = index;
      }
    }
  },
  created() {
    this.get();
  }
};
</script>
