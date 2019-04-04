<template>
  <div class="column is-6">
    <div class="section-wrapper">
      <h3 class="section-heading">แบรนด์</h3>
      <strong>แบรนด์ของสินค้านี้</strong>
      <br>
      <i>{{ $parent.product.brand ? $parent.product.brand.name : null }}</i>
      <br>
      <form method="post" @submit.prevent="edit">
        <div class="form-group">
          <strong>แก้ไขแบรนด์</strong>
          <label>แบรนด์</label>
          <select required v-model="brand">
            <option :value="brand" v-for="brand in brands" :key="brand.id">{{ brand.name }}</option>
          </select>
        </div>
        <div class="action-wrapper right form-submit">
          <button type="submit" class="btn success">บันทึก</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      brand: null
    }
  },
  props: ['brands'],
  methods: {
    edit() {
      this.$http.put('/product/' + this.$parent.product.uid + '/edit/brand', {
        brand: this.brand.id
      }).then(() => {
        toastr.success('บันทึกแบรนด์แล้ว')
        this.$emit('brand-change', this.brand.name)
        this.brand = null
      })
    }
  }
}
</script>
