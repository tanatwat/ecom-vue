<template>
  <div class="columns is-multiline">
    <div class="column is-full">
      <button class="btn primary" @click="$root.showModal = true">
        เพิ่มช่องทางชำระเงิน&nbsp;
        <i class="fas fa-plus"></i>
      </button>
    </div>

    <modal>
      <header slot="header" class="modal-card-head">
        <p class="modal-card-title">เพิ่มช่องทางชำระเงิน</p>
        <button class="btn primary fas fa-times" @click="$root.showModal = false" type="button"></button>
      </header>
      <form method="post" @submit.prevent="addPayment()" slot="body">
        <section class="modal-card-body">
          <div class="margin-center" style="max-width:350px">
            <label class="label">ประเภทบัญชี</label>
            <div class="field">
              <div class="control">
                <div class="select is-fullwidth">
                  <select required v-model="form.method">
                    <option value="account">บัญชีธนาคาร</option>
                    <option value="PromptPay">PromptPay</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="field">
              <label class="label">ธนาคาร</label>
              <div class="control">
                <div class="select is-fullwidth">
                  <select required v-model="form.provider">
                    <option :value="bank.name" v-for="bank in providers">{{ bank.name }}</option>
                  </select>
                </div>
              </div>
            </div>

            <form-input
              label="เลขบัญชี"
              name="name"
              type="text"
              validate="required"
              validate-as="เลขบัญชี"
              v-model="form.ref"
              placeholder="เช่น 123-456789-0"
            ></form-input>
          </div>
        </section>
        <footer class="modal-card-foot action-wrapper right has-margin" slot="footer">
          <button :disabled="errors.any()" class="btn success" type="submit">ยืนยัน</button>
          <button class="btn primary" type="button" @click="$root.showModal = false">ยกเลิก</button>
        </footer>
      </form>
    </modal>

    <div class="collection-list column" v-if="accounts.length">
      <div v-for="(account, index) in accounts">
        <div class="collection-title">{{ account.provider }}</div>
        <div class>{{ account.method == 'account' ? 'บัญชีธนาคาร' : 'PromptPay' }}</div>
        <div class>{{ account.ref }}</div>

        <div class="collection-action-bar">
          <button class="btn-flat primary fas fa-trash-alt" @click="remove(account.id, index)"></button>
        </div>
      </div>
    </div>
    <div class="column text-center" v-else>
      <h3 class="is-size-4">ไม่มีช่องทางการชำระเงิน</h3>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      accounts: [],
      form: {
        ref: null,
        method: null,
        provider: null
      },
      formVisible: false,
      providers: [
        {
          name: "ธนาคารกรุงเทพ",
          code: "BBL"
        },
        {
          name: "ธนาคารกสิกรไทย",
          code: "KBANK"
        },
        {
          name: "ธนาคารกรุงไทย",
          code: "KTB"
        },
        {
          name: "ธนาคารไทยพาณิชย์",
          code: "SCB"
        },
        {
          name: "ธนาคารทหารไทย",
          code: "TMB"
        },
        {
          name: "ธนาคารออมสิน",
          code: "GSB"
        },
        {
          name: "ธนาคารกรุงศรีอยุธยา",
          code: "BAY"
        }
      ]
    };
  },
  methods: {
    getPaymentMethod() {
      this.$http.get("/get/payment_methods").then(response => {
        this.accounts = response.data;
      });
    },
    addPayment() {
      this.$http
        .post("/payments", {
          ref: this.form.ref,
          method: this.form.method,
          provider: this.form.provider
        })
        .then(
          response => {
            this.accounts.push(response.data[0]);
            toastr.success("เพิ่มช่องทางชำระเงินแล้ว");
            this.form = {
              ref: null,
              method: null,
              provider: null
            };
          },
          response => {
            toastr.error("เกิดข้อผิดพลาด");
          }
        );
    },
    remove(id, index) {
      if (confirm("คุณแน่ใจหรือไม่ว่าจะลบ?")) {
        this.$http.delete("/payments/" + id).then(
          response => {
            this.accounts.splice(index, 1);
            toastr.success("ลบบัญชีเรียบร้อยแล้ว");
          },
          response => {
            toastr.error("เกิดข้อผิดพลาด");
          }
        );
      }
    }
  },
  created() {
    this.getPaymentMethod();
  }
};
</script>