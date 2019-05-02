<template lang="html">
  <div class="columns is-multiline is-mobile">
    <div class="column is-full">
      <button class="btn primary" @click="$root.showModal = true">
      สร้างคอลเล็คชั่น&nbsp;
      <i class="fas fa-plus"></i>
    </button>
    </div>

    <div class="collection-list column" v-if="showcases.length">
      <div v-for="(showcase, index) in showcases">
        <div class="collection-title" v-show="formVisible !== index">{{ showcase.name }}</div>
            <div class="field has-addons no-margin" v-show="formVisible == index">
              <div class="control is-expanded">
                <input class="input" type="text" placeholder="ชื่อแบรนด์" v-model="form.name">
              </div>
              <div class="control">
                <button class="button is-success" @click="edit(showcase.id)">
                  ยืนยัน
                </button>
              </div>
            </div>
        <div class="collection-action-bar">
            <button class="btn-flat primary fas fa-pen" @click="edit(showcase.id)"></button>
            <button class="btn-flat primary fas fa-trash-alt" @click="remove(showcase.id, index)"></button>
        </div>
      </div>
    </div>
    <div class="column text-center" v-else>
      <h3 class="is-size-4">ไม่มีคอลเล็คชั่น</h3>
    </div>

    <modal>
      <header slot="header" class="modal-card-head">
        <p class="modal-card-title">สร้างคอลเล็คชั่น</p>
        <button class="btn primary fas fa-times" @click="$root.showModal = false" type="button"></button>
      </header>
      <form method="POST" slot="body" @submit.prevent="create">
        <section class="modal-card-body">
          <div class="margin-center" style="max-width: 350px">
            <div class="field">
              <label for class="label is-medium">ชื่อคอลเล็คชั่น</label>
              <p class="control">
                <input
                  required
                  class="input"
                  name="code"
                  type="text"
                  v-model="form.name"
                  placeholder="คอลเล็คชั่น"
                  max="20"
                  min="1"
                  v-validate="'required'"
                  data-vv-as="ชื่อคอลเล็คชั่น"
                >
              </p>
              <p class="help is-danger text-center">{{ errors.first('code') }}</p>
            </div>
          </div>
        </section>
        <footer class="modal-card-foot action-wrapper right has-margin" slot="footer">
          <button :disabled="!form.name" class="btn success" type="submit">ยืนยัน</button>
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
      showcases: [],
      form: {
        name: null
      },
      formVisible: null
    };
  },
  methods: {
    get() {
      this.$http.get("/showcases").then(response => {
        this.showcases = response.data;
      });
    },
    create() {
      this.$http
        .post("/showcases", {
          name: this.form.name
        })
        .then(
          response => {
            let showcase = this.form;
            Object.assign(showcase, response.data);
            this.form = {
              name: null
            };
            this.showcases.push(showcase);
            this.$root.showModal = false
            toastr.success("เพิ่มตู้แสดงสินค้าแล้ว");
          },
          response => {
            toastr.error("เกิดข้อผิดพลาด");
          }
        );
    },
    edit(id) {
      this.$router.replace('/admin/showcase/' + id)
    },
    remove(id, index) {
      if (confirm("คุณแน่ใจหรือไม่ว่าจะลบ?")) {
        this.$http.delete("/showcases/" + id).then(() => {
          this.showcases.splice(index, 1);
          toastr.success("ลบแบรนด์สินค้าแล้ว");
        });
      }
    }
  },
  created() {
    this.get();
  }
};
</script>
