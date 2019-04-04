<template lang="html">
<div class="columns is-multiline">
  <section class="column is-half">
    <div class="section-wrapper">
      <h3 class="section-heading">รูปภาพขนาดย่อ<span class="optional">200*200</span></h3>
      <div class="is-flex-desktop file-input-wrapper">
        <div style="width:200px" class="margin-center">
          <div class="image-preview">
            <i class="fas fa-images" :class="{'is-hidden' : image_preview}"></i>
            <img :src="image_preview">
          </div>
        </div>
        <div class="button-wrapper padding-laptop">
          <input class="file-input" ref="thumbnail" type="file" id="thumbnail" @change="preview">
          <label class="btn primary" for="thumbnail">เลือกรูปภาพ</label>
          <button class="btn error full-width" type="button" :disabled="!image_preview" @click="removeFile">ลบรูปภาพ</button>
          <button class="btn success full-width" type="button" :disabled="!image_preview || !changed" @click="editThumbnail">อัพโหลด</button>
        </div>
      </div>
    </div>
  </section>
  <div class="column is-6">
    <div class="section-wrapper">
      <div class="form-group">
        <h3 class="section-heading">รายละเอียดสินค้า</h3>
        <label for="name">ชื่อสินค้า</label>
        <input type="text" id="name" v-model="product.name">
        <label for="name">ราคา</label>
        <input type="text" id="name" v-model="product.price">
      </div>
      <div class="action-wrapper right form-submit">
        <button type="button" class="btn success" @click="editInfo">บันทึก</button>
      </div>
    </div>
  </div>
  <category :categories="properties.categories" v-on:category-change="updateCategory"></category>
  <brand :brands="properties.brands" v-on:brand-change="updateBrand"></brand>

</div>
</template>

<script>
import Category from './Category'
import Brand from './Brand'

export default {
  components: {
    Category,
    Brand
  },
  data() {
    return {
      product: null,
      image_preview: null,
      changed: false,
      thumbnail: null,
      properties: {
        categories: [],
        brands: []
      }
    }
  },
  methods: {
    get() {
      this.$http.get('get/product/' + this.$route.params.uid).then(response => {
        this.product = response.data
        this.image_preview = 'https://s3-ap-southeast-1.amazonaws.com/images.peach/thumbnail/' + this.product.thumbnail
      })
    },
    getCategory() {
      this.$http.get('/get/product_upload_data').then(response => {
        this.properties.categories = response.data.categories
        this.properties.brands = response.data.brands
      })
    },
    preview(event) {
			var input = event.target;
			if (input.files && input.files[0]) {
				if (input.files[0].size > 1048576) {
					alert('ขนาดไฟล์ต้องไม่เกิน 1 MB');
					this.removefile()
				}
				var reader = new FileReader();
				var vm = this;
				reader.onload = function(e) {
					vm.image_preview = e.target.result;
				}
				reader.readAsDataURL(input.files[0]);
        this.changed = true
			}
		},
		removeFile() {
			this.image_preview = null;
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
      this.$http.put('/product/' + this.product.uid + '/edit/info', {
        name: this.product.name,
        price: this.product.price
      }).then(() => {
        toastr.success('บันทึกแล้ว')
      })
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
