<template>
<div class="column is-full">
  <div class="box">
    <div class="columns">
      <div class="column is-half">
        <p class="section-heading">ตัวเลือกของสินค้านี้</p>
        <div class="tags has-addons are-medium" v-for="(choice, index) in choices" style="margin-bottom:5px">
          <span class="tag is-primary">{{ choice.name }}</span>
          <a class="tag fas fa-times" @click.prevent="remove(index)"></a>
        </div>
        <p class="is-size-5" v-show="!choices.length">สินค้านี้ไม่มีตัวเลือก</p>
      </div>

      <div class="column is-half">
        <p class="section-heading">เพิ่มตัวเลือกสินค้า</p>
        <div class="field is-grouped">
          <p class="control is-expanded">
            <input class="input" type="text" v-model="form" placeholder="เช่น สี ไซส์">
          </p>
          <p class="control">
            <button :disabled="!form" class="btn success group" @click="add">เพิ่ม</button>
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      form: null,
      choices: this.data
    }
  },
  props: ['data'],
  methods: {
    add() {
      this.choices.push({
        name: this.form,
        qty: 1
      })
      this.submit('เพิ่มตัวเลือกแล้ว')
    },
    remove(index) {
      if (confirm('ลบตัวเลือกนี้?')) {
        this.choices.splice(index, 1)
        this.submit('ลบตัวเลือกแล้ว')
      }
    },
    submit(response) {
      this.$http.put('/product/' + this.$route.params.uid + '/edit/choice', {
        choice: JSON.stringify(this.choices)
      }).then(() => {
        toastr.success(response)
        this.form = null
      }, () => {
        toastr.error('เกิดข้อผิดพลาด')
      })
    }
  }
}
</script>
