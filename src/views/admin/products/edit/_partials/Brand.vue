<template>
  <div class="column is-6">
    <div class="box">
      <h3 class="section-heading">แบรนด์</h3>
      <strong class="font-success">แบรนด์ของสินค้านี้</strong>
      <br>
      <p>{{ $parent.product.brand ? $parent.product.brand.name : null }}</p>
      <br>
      <form method="post" @submit.prevent="edit">
        <strong>แก้ไขแบรนด์</strong>
        <label class="label">แบรนด์</label>
        <div class="select full">
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
