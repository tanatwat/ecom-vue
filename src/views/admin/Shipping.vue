<template>
  <div class="columns is-multiline">
    <div class="column is-full">
      <button class="btn primary" @click="$root.showModal = true">
        เพิ่มช่องทางส่งสินค้า&nbsp;
        <i class="fas fa-plus"></i>
      </button>
    </div>
    <modal>
      <header slot="header" class="modal-card-head">
        <p class="modal-card-title">เพิ่มช่องทางส่งสินค้า</p>
        <button class="btn primary fas fa-times" @click="$root.showModal = false" type="button"></button>
      </header>
      <form slot="body" @submit.prevent="create()">
        <section class="modal-card-body">
          <form-input
            label="ชื่อการจัดส่ง"
            name="name"
            type="text"
            validate="required"
            validate-as="ชื่อการจัดส่ง"
            v-model="form.method"
            placeholder="EMS Kerry อื่นๆ"
          ></form-input>

          <label class="checkbox padding" :class="{'active' : free }">
            ส่งสินค้าฟรี?
            <input type="checkbox" name="free" v-model="free">
          </label>

          <transition name="fade">
            <div class="field" v-show="!free">
              <label class="label">ค่าส่งสินค้า</label>
              <div class="field has-addons">
                <p class="control">
                  <input
                    :required="!free"
                    name="fee"
                    class="input"
                    v-validate="'numeric'"
                    data-vv-as="ค่าส่งสินค้า"
                    type="number"
                    v-model="form.fee"
                  >
                </p>
                <p class="control">
                  <a class="button is-static">บาท</a>
                </p>
              </div>
            </div>
          </transition>

          <transition name="fade">
            <label class="checkbox padding" :class="{'active' : multiply }" v-show="!free">
              คิดค่าขนส่งต่อชิ้นเมื่อซื้อชิ้นที่สองขึ้นไป?
              <input
                type="checkbox"
                name="free"
                v-model="multiply"
              >
            </label>
          </transition>

          <transition name="fade">
            <div class="field" v-show="multiply && !free">
              <label class="label">ค่าส่งเพิ่ม</label>
              <div class="field has-addons">
                <p class="control">
                  <input
                    :required="multiply && !free"
                    name="multiply"
                    class="input"
                    v-validate="'numeric'"
                    data-vv-as="ค่าส่งเพิ่ม"
                    type="number"
                    v-model="form.multiply"
                  >
                </p>
                <p class="control">
                  <a class="button is-static">ต่อชิ้น</a>
                </p>
              </div>
            </div>
          </transition>

          <transition name="fade">
            <div>
              <label class="checkbox padding" :class="{'active' : promotion }" v-show="!free">
                ส่งฟรีเมื่อซื้อถึงขั้นต่ำ?
                <input type="checkbox" name="free" v-model="promotion">
              </label>
            </div>
          </transition>

          <transition name="fade">
            <div class="field" v-show="promotion && !free">
              <label class="label">ส่งฟรีเมื่อซื้อ</label>
              <div class="field has-addons">
                <p class="control">
                  <input
                    :required="promotion && !free"
                    name="multiply"
                    class="input"
                    v-validate="'numeric'"
                    data-vv-as="จำนวนสินค้า"
                    type="number"
                    v-model="form.promotion.amount"
                    placeholder="จำนวน"
                  >
                </p>
                <div class="control">
                  <div class="select">
                    <select :required="promotion && !free" v-model="form.promotion.type">
                      <option value="qty">ชิ้น</option>
                      <option value="cost">บาท</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </section>
        <footer class="modal-card-foot action-wrapper right has-margin" slot="footer">
          <button :disabled="errors.any()" class="btn success" type="submit">ยืนยัน</button>
          <button class="btn primary" type="button" @click="$root.showModal = false">ยกเลิก</button>
        </footer>
      </form>
    </modal>

    <div class="collection-list column" v-if="shippings.length">
      <div v-for="(shipping, index) in shippings">
        <div class="collection-title">{{ shipping.method }}</div>
        <div
          class="font-success"
        >ค่าส่ง&nbsp;{{ shipping.fee ? shipping.fee + ' บาท' : 'FREE' }}&nbsp;</div>
        <div v-show="shipping.multiply">เพิ่มค่าส่ง&nbsp;{{ shipping.multiply }}&nbsp;บาท/ชิ้น</div>
        <div
          v-show="shipping.promotion.type"
        >ส่งฟรีเมื่อซื้อครบ&nbsp;{{ shipping.promotion.amount }}&nbsp;{{ shipping.promotion.type == 'qty' ? 'ชิ้น' : 'บาท' }}</div>
        <div class="collection-action-bar">
          <button class="btn-flat primary fas fa-trash-alt" @click="remove(shipping.id, index)"></button>
        </div>
      </div>
    </div>
    <div class="column text-center" v-else>
      <h3 class="is-size-4">ไม่มีช่องทางส่งสินค้า</h3>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      shippings: [],
      form: {
        method: null,
        fee: null,
        multiply: null,
        promotion: {
          amount: null,
          type: null
        }
      },
      free: false,
      multiply: false,
      promotion: false,
      formVisible: false
    };
  },
  watch: {
    free: function() {
      this.form.fee = null;
      this.multiply = false;
      this.promotion = false;
    },
    multiply: function() {
      this.form.multiply = null;
    },
    promotion: function() {
      this.form.promotion.amount = null;
      this.form.promotion.type = null;
    }
  },
  methods: {
    getShipping() {
      this.$http.get("/get/shippings").then(response => {
        this.shippings = response.data;
      });
    },
    create() {
      this.$http
        .post("/shippings", {
          method: this.form.method,
          fee: this.form.fee,
          multiply: this.form.multiply,
          promotion: this.form.promotion
        })
        .then(
          response => {
            let created = {
              id: response.data[0].id,
              fee: response.data[0].fee,
              method: response.data[0].method,
              multiply: response.data[0].multiply,
              promotion: response.data[0].promotion
            };
            this.shippings.push(created);
            this.$root.showModal = false;
            this.resetForm()
            toastr.success("เพิ่มช่องทางการส่งสินค้าแล้ว");
          },
          response => {
            toastr.error("เกิดข้อผิดพลาด");
          }
        );
    },
    remove(id, index) {
      if (confirm("คุณแน่ใจหรือไม่ว่าจะลบ?")) {
        this.$http.delete("/shippings/" + id).then(
          response => {
            this.shippings.splice(index, 1);
            toastr.success("ลบเรียบร้อยแล้ว");
          },
          response => {
            toastr.error("เกิดข้อผิดพลาด");
          }
        );
      }
    },
    resetForm() {
      this.form = {
        method: null,
        fee: null,
        multiply: null,
        promotion: {
          amount: null,
          type: null
        }
      };
      this.free = false;
      this.multiply = false;
      this.promotion = false;
    }
  },
  created() {
    this.getShipping();
  }
};
</script>