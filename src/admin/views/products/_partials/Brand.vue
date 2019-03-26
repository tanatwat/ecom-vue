<template lang="html">
  <div class="columns is-multiline is-mobile">
    <section class="column is-full-mobile order-1-mobile">
      <div class="section-wrapper">
        <h3 class="section-heading">แบรนด์สินค้าในร้าน</h3>
        <label v-show="!brands.length">ไม่มีแบรนด์สินค้า</label>

        <div class="data-list" v-for="(brand, index) in brands">
          <div class="data-title">
            <label v-show="formVisible !== index">{{ brand.name }}</label>
            <div class="input-group"  v-show="formVisible == index" style="padding: 5px 2px">
              <input type="text" v-model="brand.name">
              <button class="btn success group" type="button" @click="edit(brand)">ยืนยัน</button>
            </div>
          </div>
          <div class="action-wrapper right action has-margin">
            <button class="btn-icon primary fas fa-pen" @click="toggleForm(index)"></button>
            <button class="btn-icon error fas fa-trash-alt" @click="remove(brand.id, index)"></button>
          </div>
        </div>

      </div>
    </section>
    <section class="column is-full-mobile order-1-mobile">
      <div class="section-wrapper">
        <h3 class="section-heading">เพิ่มแบรนด์สินค้า</h3>
        <div class="form-group">
          <label>ชื่อแบรนด์</label>
          <div class="input-group">
            <input type="text" placeholder="ชื่อแบรนด์สินค้า" v-model="form.brand">
            <button :disabled="!form.brand" type="button" class="btn success group right-column" @click="add">ยืนยัน</button>
          </div>
        </div>
      </div>
    </section>
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
    }
  },
  methods: {
    get() {
      axios.get('/brands').then(response => {
        this.brands = response.data
      })
    },
    add() {
      if (confirm('เพิ่มแบรนด์สินค้านี้?')) {
        axios.post('/brands', {
          brand: this.form.brand
        }).then(response => {
          this.form.brand = null
          this.brands.push(response.data)
          toastr.success('เพิ่มแบรนด์สินค้าแล้ว')
        })
      }
    },
    edit(brand) {
      if (confirm('แก้ไขชื่อแบรนด์นี้?')) {
        axios.put('/brands/' + brand.id, {
          brand: brand.name
        }).then(response => {
          toastr.success('อัพเดทแบรนด์แล้ว')
        })
      }
    },
    remove(id, index) {
      if (confirm('คุณแน่ใจหรือไม่ว่าจะลบ?')) {
        axios.delete('/brands/' + id).then(() => {
          this.brands.splice(index, 1)
          toastr.success('ลบแบรนด์สินค้าแล้ว')
        })
      }
    },
    toggleForm(index) {
      if (this.formVisible == index) {
        this.formVisible = null
      } else {
        this.formVisible = index
      }
    }
  },
  created() {
    this.get()
  }
}
</script>
