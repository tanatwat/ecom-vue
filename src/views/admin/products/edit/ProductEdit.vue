<template lang="html">
<div class="columns is-multiline">
  <section class="column is-half">
    <div class="box">
      <h3 class="section-heading">รูปภาพขนาดย่อ</h3>
      <file-upload :allow-upload="true" :image-src="image_preview" v-on:upload="editThumbnail"></file-upload>
    </div>
  </section>
  <div class="column is-6">
    <div class="box">
      <h3 class="section-heading">รายละเอียดสินค้า</h3>
      <form-input label="ชื่อสินค้า" name="name" type="text" validate="required" validate-as="ชื่อสินค้า" v-model="product.name"></form-input>
      <form-input label="ราคา" name="price" type="text" validate="required|numeric" validate-as="ราคา" v-model="product.price"></form-input>
      <div class="action-wrapper right form-submit">
        <button type="button" class="btn success" @click="editInfo">บันทึก</button>
      </div>
    </div>
  </div>
  <category :categories="properties.categories" v-on:category-change="updateCategory"></category>
  <brand :brands="properties.brands" v-on:brand-change="updateBrand"></brand>
  <photo :photos="properties.photos"></photo>
  <!-- <choice :data="JSON.parse(product.choice)"></choice> -->
</div>
</template>

<script>
import Category from './_partials/Category'
import Brand from './_partials/Brand'
import Photo from './_partials/Photo'
import Choice from './_partials/Choice'
import FileUpload from '../../_components/FileUpload'

export default {
  components: {
    Category,
    Brand,
    Photo,
    Choice,
    FileUpload
  },
  data() {
    return {
      product: null,
      image_preview: null,
      changed: false,
      thumbnail: null,
      properties: {
        categories: [],
        brands: [],
        photos: []
      }
    }
  },
  methods: {
    get() {
      this.$http.get('get/product/' + this.$route.params.uid).then(response => {
        this.product = response.data
        this.properties.photos = this.product.photos
        this.image_preview = 'https://s3-ap-southeast-1.amazonaws.com/images.peach/thumbnail/' + this.product.thumbnail
      })
    },
    getCategory() {
      this.$http.get('/get/product_upload_data').then(response => {
        this.properties.categories = response.data.categories
        this.properties.brands = response.data.brands
      })
    },
    editThumbnail() {
      this.$http.put('/product/' + this.product.uid + '/edit/thumbnail', {
        thumbnail: this.image_preview,
        fileToDelete: this.product.thumbnail
      }).then(() => {
        this.changed = false
        toastr.success('บันทึกรูปแล้ว')
      })
    },
    editInfo() {
      if (this.errors.first('price') || this.errors.first('name')) {
        alert('โปรดแก้ไขฟอร์มก่อน')
      } else {
        this.$http.put('/product/' + this.product.uid + '/edit/info', {
          name: this.product.name,
          price: this.product.price
        }).then(() => {
          toastr.success('บันทึกแล้ว')
        })
      }
    },
    updateCategory(value) {
      this.product.category.name = value.category
      if (!this.product.subcategory) {
        this.product.subcategory = {}
      }
      if (!this.product.type) {
        this.product.type = {}
      }
      Object.assign(this.product.subcategory, {name: value.subcategory})
      Object.assign(this.product.type, {name: value.type})
    },
    updateBrand(value) {
      if (!this.product.brand) {
        this.product.brand = {}
      }
      Object.assign(this.product.brand, {name: value})
    }
  },
  created() {
    this.get()
    this.getCategory()
  }
}
</script>
