<template>
  <div class="">
    <form class="" method="post" enctype="multipart/form-data" :action="$root.backendUrl + '/products'">
      <input type="file" name="file[]" value="" multiple>
      <button type="submit" name="button" class="button success">SUBMIT</button>
    </form>
    <form method="post" class="columns is-multiline" @submit.prevent="submit">
        <!-- DROPZONE -->
        <section class="column is-full">
          <div class="section-wrapper">
            <div class="form-group">
              <h3 class="section-heading">รูปภาพสินค้า</h3>
              <div class="dropzone margin-15-v" id="uploader">
                <div class="dz-message" data-dz-message>
                  <span>คลิกเพื่อเลือกรูปที่จะอัพโหลด</span><br>
                  <span>อัพโหลดได้ไม่เกิน 6 รูป ไม่เกิน รูปละ 2 MB</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <!-- CATEGORY -->
        <!-- <section class="column is-half">
          <div class="section-wrapper">
            <h3 class="section-heading">รายละเอียด</h3>
            <div class="form-group">
              <label>ชื่อสินค้า</label>
              <input type="text" v-model="name">
              <label>ราคา</label>
              <input type="text" v-model="price">
              <label>แบรนด์</label>
              <select v-model="brand" :required="brands.length">
                <option value="1" v-for="brand in brands" :key="brand.id">{{ brand.name }}</option>
              </select>
            </div>
          </div>
        </section>
        <section class="column is-half">
          <div class="section-wrapper">
            <h3 class="section-heading">หมวดหมู่</h3>
            <div class="form-group">
              <div id="category" v-show="categories.length">
                <label>หมวดหมู่</label>
                <select required v-model="category" @change="selectCategory(category)">
                  <option :value="category" v-for="category in categories" :key="category.id">{{ category.name }}</option>
                </select>
              </div>
              <div id="subcategory" v-show="selectChoices.subcategories.length">
                <label>หมวดหมู่รอง</label>
                <select v-model="subcategory" @change.prevent="selectSubcategory(subcategory)">
                  <option :value="subcategory" v-for="subcategory in selectChoices.subcategories" :key="subcategory.id">{{ subcategory.name }}</option>
                </select>
              </div>
              <div id="type" v-show="selectChoices.types.length">
                <label>หมวดหมู่ย่อย</label>
                <select v-model="type">
                  <option :value="type" v-for="type in selectChoices.types" :key="type.id">{{ type.name }}</option>
                </select>
              </div>
            </div>
          </div>
        </section> -->
        <!-- DESCRIPTION -->
        <!-- <section class="column is-full">
          <div class="section-wrapper">
            <div class="form-group">
              <h3 class="section-heading">คำอธิบายสินค้า</h3>
              <textarea placeholder="คำอธิบายสินค้าของคุณ..."></textarea>
            </div>
          </div>
        </section> -->
        <!-- CHOICE -->
        <!-- <section class="column is-half">
          <div class="section-wrapper">
            <h3 class="section-heading">ตัวเลือกสินค้า</h3>
            <div class="form-group">
              <label>เพิ่มตัวเลือก</label>
              <div class="input-group">
                  <input type="text" v-model="form.choice" placeholder="เช่น สี ไซส์">
                  <button :disabled="!form.choice" class="btn success group right-column" @click="addChoice">เพิ่ม</button>
              </div>
            </div>
          </div>
        </section>
        <section class="column is-half">
          <div class="section-wrapper">
            <h3 class="section-heading">ตัวเลือกของสินค้านี้</h3>
            <div class="badge info" v-for="(item, index) in choices" :key="item.id">
              {{ item }}<button class="delete" @click="deleteChoice(index)"></button>
            </div>
            <p class="subtitle" v-show="!choices.length">ไม่มีตัวเลือก</p>
          </div>
        </section> -->
        <section class="column is-full">
          <button class="btn success action is-pulled-right" type="submit" name="button">อัพโหลดสินค้า</button>
        </section>
      </form>
  </div>

</template>
<script>
/* eslint-disable */
import Dropzone from 'dropzone'
Dropzone.autoDiscover = false
export default {
	data() {
		return {
			name: null,
			price: null,
			brand: null,
			description: null,
			category: null,
			subcategory: null,
			type: null,
      choices: [],
      form: {
        choice: null
      },
      brands: [],
      categories: [],
      selectChoices: {
        subcategories: [],
        types: [],
      },
      files: []
		}
	},
  methods: {
    initDropzone: function() {
      self = this;
      self.$nextTick(function() {
        self.image = new Dropzone('#uploader', {
          method: 'post',
          url: self.$root.backendUrl + '/products',
          autoProcessQueue: false,
          uploadMultiple: true,
          parallelUploads: 6,
          maxFiles: 6,
          paramName: 'file',
          maxFilesize: 2,
          acceptedFiles: 'image/*',
          addRemoveLinks: true,
          dictRemoveFile: '×',
          dictCancelUpload: '×',
          init: function() {
            this.on('addedfile', function(file) {
              if (this.files.length > 6) {
                this.removeFile(this.files[0]);
              }
              if (file.size > 2097152) {
                alert('ขนาดรูปต้องไม่เกินรูปละ 2 MB');
                this.removeFile(file)
              }
            });
          },
          sendingmultiple: function(data, xhr, formData) {
            // formData.append("name", self.name);
            // formData.append("price", self.price);
            // formData.append("description", self.description);
            // formData.append("category_id", self.category.id);
            // formData.append("subcategory_id", self.subcategory.id);
            // formData.append("type_id", self.type.id);
            // formData.append("choices", self.choices);
            formData.append("files", data);
            formData.append("fileCount", this.files.length);
          },
          processing: function() {
            // self.$Progress.start();
          },
          success: function() {
            toastr.success('อัพโหลดเรียบร้อย');
            this.removeFile(this.files[0]);
            // self.$Progress.finish();
            //document.location.href = '/admin/product';
          },
          error: function() {
            // self.$Progress.fail();
            toastr.error('เกิดข้อผิดพลาด');
            this.removeFile(this.files[0]);
          },
        });
      });
    },
    submit() {
      self.image.processQueue();
    },
    get() {
      this.$http.get('/get/product_upload_data').then(response => {
        this.categories = response.data.categories
        this.brands = response.data.brands
      })
    },
    selectCategory(category) {
      this.selectChoices.subcategories = category.subcategory
      this.subcategory = []
      this.type = null
      this.selectChoices.types = []
    },
    selectSubcategory(subcategory) {
      this.selectChoices.types = subcategory.type
      this.type = null
    },
    addChoice() {
      this.choices.push(this.form.choice)
      this.form.choice = null
    },
    deleteChoice(index) {
      this.choices.splice(index, 1)
    }
  },
  created() {
    this.initDropzone()
    this.get()
  }
}
</script>
