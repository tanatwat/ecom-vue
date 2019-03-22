<template>
  <div class="columns is-multiline">
    <!-- DROPZONE -->
    <section class="column is-full">
      <div class="section-wrapper">
        <div class="form-group">
          <label>รูปภาพสินค้า</label>
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
    <section class="column is-half">
      <div class="section-wrapper">
        <h3 class="section-heading">รายละเอียด</h3>
        <div class="form-group">
          <label>ชื่อสินค้า</label>
          <input type="text" v-model="name">
          <label>ราคา</label>
          <input type="text" v-model="price">
          <label>แบรนด์</label>
          <select v-model="brand">
            <option value="1">BRAND</option>
          </select>
        </div>
      </div>
    </section>
    <section class="column is-half">
      <div class="section-wrapper">
        <h3 class="section-heading">หมวดหมู่</h3>
        <div class="form-group">
          <label>หมวดหมู่</label>
          <select v-model="category">
            <option value="1">BRAND</option>
          </select>
          <label>หมวดหมู่รอง</label>
          <select v-model="subcategory">
            <option value="1">BRAND</option>
          </select>
          <label>หมวดหมู่ย่อย</label>
          <select v-model="type">
            <option value="1">BRAND</option>
          </select>
        </div>
      </div>
    </section>
    <!-- DESCRIPTION -->
    <section class="column is-full">
      <div class="section-wrapper">
        <div class="form-group">
          <h3 class="section-heading">คำอธิบายสินค้า</h3>
          <textarea placeholder="คำอธิบายสินค้าของคุณ..."></textarea>
        </div>
      </div>
    </section>
    <!-- CHOICE -->
    <section class="column is-half">
      <div class="section-wrapper">
        <h3 class="section-heading">ตัวเลือกสินค้า</h3>
        <div class="form-group">
          <label>เพิ่มตัวเลือก</label>
          <div class="input-group">
              <input type="text" v-model="form.choice" placeholder="เช่น สี ไซส์">
              <button class="btn success group right-column" @click="addChoice">เพิ่ม</button>
          </div>
        </div>
      </div>
    </section>
    <section class="column is-half">
      <div class="section-wrapper">
        <h3 class="section-heading">ตัวเลือกของสินค้านี้</h3>
        <div class="badge info" v-for="(item, index) in choices">
          {{ item }}<button class="delete" @click="deleteChoice(index)"></button>
        </div>
        <p class="subtitle" v-show="!choices.length">ไม่มีตัวเลือก</p>
      </div>
    </section>
    <section class="column is-full">
      <button class="btn success action is-pulled-right" type="button" name="button">อัพโหลดสินค้า</button>
    </section>
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
			dropzoneOptions: {
        method: 'post',
        url: this.$root.backendUrl,
        autoProcessQueue: false,
        uploadMultiple: true,
        parallelUploads: 6,
        maxFiles: 6,
        maxFilesize: 2,
        acceptedFiles: '.jpg',
        addRemoveLinks: true,
        paramName: 'image',
        dictRemoveFile: '×',
        dictCancelUpload: '×',
				headers: {
					"My-Awesome-Header": "header value"
				}
			}
		}
	},
  methods: {
    initDropzone: function() {
      self = this;
      self.$nextTick(function() {
        self.image = new Dropzone('#uploader', {
          method: 'post',
          url: self.$root.backendUrl,
          autoProcessQueue: false,
          uploadMultiple: true,
          parallelUploads: 6,
          maxFiles: 6,
          maxFilesize: 2,
          acceptedFiles: '.jpg',
          addRemoveLinks: true,
          paramName: 'image',
          dictRemoveFile: '×',
          dictCancelUpload: '×',
          headers: {
            'x-csrf-token': '123'
          },
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
            formData.append("name", self.name);
            formData.append("price", self.price);
            formData.append("description", self.description);
            formData.append("category_id", self.category.id);
            formData.append("subcategory_id", self.subcategory.id);
            formData.append("type_id", self.type.id);
            formData.append("choices", JSON.stringify(self.choices));
          },
          processing: function() {
            self.$Progress.start();
          },
          success: function() {
            // toastr.success('อัพโหลดเรียบร้อย');
            this.removeFile(this.files[0]);
            self.$Progress.finish();
            document.location.href = self.$root.url + '/admin/product';
          },
          error: function() {
            self.$Progress.fail();
            // toastr.error('เกิดข้อผิดพลาด');
            this.removeFile(this.files[0]);
          },
        });
      });
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
  }
}
</script>
