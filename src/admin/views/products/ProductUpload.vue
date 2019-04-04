<template>
<div class="">
	<form method="post" class="columns is-multiline" @submit.prevent="submit">
		<section class="column is-half">
			<div class="section-wrapper">
				<h3 class="section-heading">ตัวอย่างสินค้า</h3>
				<div style="width:200px" class="margin-center">
					<div class="product-card">
						<div class="image-preview">
							<i class="fas fa-images" :class="{'is-hidden' : image_preview}"></i>
							<img :src="image_preview">
						</div>
						<div class="product-details-wrapper">
							<a class="product-link">{{ name ? name : 'ชื่อสินค้า' }}</a>
							<p class="product-detail">{{ price ? $number.format(price) + ' บาท' : 'ราคา' }}</p>
						</div>
					</div>
				</div>
			</div>
		</section>
		<section class="column is-half">
			<div class="section-wrapper">
				<h3 class="section-heading">รูปภาพขนาดย่อ<span class="optional">200*200</span></h3>
				<div class="is-flex-desktop">
					<div style="width:200px" class="margin-center">
						<div class="product-card">
							<div class="image-preview">
								<i class="fas fa-images" :class="{'is-hidden' : image_preview}"></i>
								<img :src="image_preview">
							</div>
						</div>
					</div>
					<div class="button-wrapper padding-laptop">
						<input class="file-input" ref="thumbnail" type="file" id="thumbnail" @change="preview">
						<label class="btn primary" for="thumbnail">เลือกรูปภาพ</label>
						<button class="btn error full-width" type="button" :disabled="!image_preview" @click="removeFile">ลบรูปภาพ</button>
					</div>
				</div>
			</div>
		</section>
		<section class="column is-full">
			<div class="section-wrapper">
				<div class="form-group">
					<h3 class="section-heading">รูปภาพสินค้า</h3>
					<div class="dropzone margin-15-v" id="uploader">
						<div class="dz-message" data-dz-message>
							<span>คลิกเพื่อเลือกรูปที่จะอัพโหลด</span><br>
							<span>อัพโหลดได้ไม่เกิน 7 รูป ไม่เกิน รูปละ 2 MB</span>
						</div>
					</div>
				</div>
			</div>
		</section>
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
						<option :value="brand.id" v-for="brand in brands" :key="brand.id">{{ brand.name }}</option>
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
		</section>
		<section class="column is-full">
			<div class="section-wrapper">
				<div class="form-group">
					<h3 class="section-heading">คำอธิบายสินค้า</h3>
					<textarea placeholder="คำอธิบายสินค้าของคุณ..." v-model="description"></textarea>
				</div>
			</div>
		</section>
		<section class="column is-half">
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
		</section>
		<section class="column is-full">
			<button class="btn success action is-pulled-right" type="submit" name="button">อัพโหลดสินค้า</button>
		</section>
	</form>
</div>
</template>
<script>
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
			image_preview: null
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
					parallelUploads: 7,
					maxFiles: 7,
					paramName: 'files',
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
						formData.append("name", self.name);
						formData.append("price", self.price);
						formData.append("description", self.description);
						formData.append("brand_id", self.brand);
						formData.append("category_id", self.category.id);
						if (self.subcategory) {
							formData.append("subcategory_id", self.subcategory.id);
							if (self.type) {
								formData.append("type_id", self.type.id);
							}
						}
						formData.append("choice", JSON.stringify(self.choices));
						formData.append("thumbnail", self.$refs.thumbnail.files[0]);
					},
					processing: function() {
						self.$Progress.start();
						self.$root.loading = true;
					},
					success: function() {
						toastr.success('อัพโหลดเรียบร้อย');
						this.removeFile(this.files[0]);
						self.$Progress.finish();
						self.$root.loading = false;
						document.location.href = '/admin/products/upload';
					},
					error: function() {
						self.$Progress.fail();
						self.$root.loading = false;
						toastr.error('เกิดข้อผิดพลาด');
						this.removeFile(this.files[0]);
					},
				});
			});
		},
		submit() {
			if (!this.$refs.thumbnail.files[0]) {
				alert('โปรดเลือกรูปภาพขนาดย่อ')
			} else {
				self.image.processQueue();
			}
		},
		get() {
			this.$http.get('/get/product_upload_data').then(response => {
				this.categories = response.data.categories
				this.brands = response.data.brands
			})
		},
		selectCategory(category) {
			this.selectChoices.subcategories = category.subcategory
			this.subcategory = null
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
			}
		},
		removeFile() {
			this.image_preview = null;
		},
	},
	created() {
		this.initDropzone()
		this.get()
	}
}
</script>
