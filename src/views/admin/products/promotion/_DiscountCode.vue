<template>
  <div class="columns is-multiline" id="code">
    <div class="column is-full">
      <button class="btn primary" @click="$root.showModal = true">
        เพิ่มโค๊ดส่วนลด&nbsp;
        <i class="fas fa-plus"></i>
      </button>
    </div>
    <section class="collection-list column" v-if="codes.length">
      <div v-for="(code, index) in codes">
        <div class="collection-title">{{ code.code }}</div>
        <div>ลด&nbsp;{{ code.value }}{{ code.type == 'cost' ? ' บาท' : '%' }}</div>
        <div class="collection-action-bar">
          <button class="btn-flat primary fas fa-trash-alt" @click="removeCode(code.id, index)"></button>
        </div>
      </div>
    </section>
    <div class="column text-center" v-else>
      <h3 class="is-size-4">ไม่มีโค๊ดลดราคา</h3>
    </div>
    <modal>
      <header slot="header" class="modal-card-head">
        <p class="modal-card-title">เพิ่มโค๊ดส่วนลด</p>
        <button class="btn primary fas fa-times" @click="$root.showModal = false" type="button"></button>
      </header>
      <form method="POST" slot="body" @submit.prevent="createCode">
        <section class="modal-card-body">
          <div class="margin-center" style="max-width: 350px">
            <div class="field">
              <label for class="label is-medium">โค๊ดส่วนลด</label>
              <p class="control">
                <input
                  required
                  class="input"
                  name="code"
                  type="text"
                  v-model="form.code"
                  placeholder="ตัวอักษรอังกฤษ หรือ ตัวเลขเท่านั้น"
                  max="20"
                  min="1"
                  v-validate="'max:20|min:1|required|alpha_num'"
                  data-vv-as="โค๊ด"
                >
              </p>
              <p class="help is-danger text-center">{{ errors.first('code') }}</p>
            </div>
            <div class="field has-addons has-addons-centered">
              <div class="control is-expanded">
                <input
                  id="discount"
                  required
                  class="input"
                  type="number"
                  name="discount"
                  placeholder="ส่วนลด"
                  v-model="form.value"
                  min="1"
                  :max="maxDiscount"
                  v-validate="`max_value:${maxDiscount}|min_value:1`"
                  data-vv-as="ส่วนลด"
                >
              </div>
              <div class="control is-expanded">
                <div class="select is-fullwidth">
                  <select required name="type" v-model="form.type">
                    <option value="percent">เปอร์เซนต์</option>
                    <option value="cost">บาท</option>
                  </select>
                </div>
              </div>
            </div>
            <p class="help is-danger text-center">{{ errors.first('discount') }}</p>
          </div>
        </section>
        <footer class="modal-card-foot action-wrapper right has-margin" slot="footer">
          <button class="btn success" type="submit" :disabled="!form.value || !form.code">ยืนยัน</button>
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
      codes: [],
      form: {
        code: null,
        value: null,
        type: "cost"
      }
    };
  },
  computed: {
    maxDiscount: function() {
      if (this.form.type == "percent") {
        return 99;
      } else {
        return 9999999;
      }
    }
  },
  methods: {
    getCode() {
      this.$http.get("/promotions/codes").then(response => {
        this.codes = response.data;
      });
    },
    createCode() {
      this.$http
        .post("/promotions/codes", {
          code: this.form.code,
          value: this.form.value,
          type: this.form.type
        })
        .then(
          response => {
            this.$root.showModal = false;
            let code = this.form
            Object.assign(code, response.data)
            this.form = {
              code: null,
              discount: null,
              type: "percent"
            };
            this.codes.push(code)
            toastr.success("เพิ่มโค๊ดส่วนลดแล้ว");
          },
          error => {
            toastr.error(error.response.data);
          }
        );
    },
    removeCode(id, index) {
      if (confirm("ลบโค๊ดส่วนลดนี้?")) {
        this.$http.delete("/promotions/codes/" + id).then(
          () => {
            this.codes.splice(index, 1);
            toastr.success("ลบโค๊ดส่วนลดแล้ว");
          },
          () => {
            toastr.error("เกิดข้อผิดพลาด");
          }
        );
      }
    }
  },
  created() {
    this.getCode();
  }
};
</script>