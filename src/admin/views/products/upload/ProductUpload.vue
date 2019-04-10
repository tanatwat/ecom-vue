<template>
<div>
	<form method="post" class="columns is-multiline" @submit.prevent="submit">
		<section class="column is-full">
			<div class="box columns is-gapless">
				<div class="column">
					<h3 class="section-heading">รูปภาพขนาดย่อ</h3>
					<file-upload :allow-upload="false"></file-upload>
				</div>
				<div class="column is-hidden-touch">
					<div style="width:200px" class="margin-center">
						<div class="product-card">
							<div class="image-preview" :class="{'active' : image_preview}" style="border:none;min-width:auto">
								<i class="tag is-primary top-right">ตัวอย่าง</i>
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
			</div>
		</section>

		<section class="column is-full">
			<div class="box">
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
			<div class="box">
				<h3 class="section-heading">รายละเอียด</h3>
				<form-input label="ชื่อสินค้า" name="name" type="text" validate="required" validate-as="ชื่อสินค้า" v-model="name"></form-input>
				<form-input label="ราคา" name="price" type="text" validate="required|numeric" validate-as="ราคา" v-model="price"></form-input>
				<div class="field">
					<label class="label">แบรนด์</label>
					<div class="select full">
						<select required v-model="brand">
							<option :value="brand.id" v-for="brand in brands" :key="brand.id">{{ brand.name }}</option>
						</select>
					</div>
				</div>
			</div>
		</section>
		<!-- CATEGORY -->
		<section class="column is-half">
			<div class="box">
				<h3 class="section-heading">หมวดหมู่</h3>
				<div class="field" v-show="categories.length">
					<label class="label">หมวดหมู่</label>
					<div class="select full">
						<select required v-model="category" @change="selectCategory(category)">
							<option :value="category" v-for="category in categories" :key="category.id">{{ category.name }}</option>
						</select>
					</div>
				</div>
				<div class="field" v-show="selectChoices.subcategories.length">
					<label class="label">หมวดหมู่รอง</label>
					<div class="select full">
						<select v-model="subcategory" @change.prevent="selectSubcategory(subcategory)">
							<option :value="subcategory" v-for="subcategory in selectChoices.subcategories" :key="subcategory.id">{{ subcategory.name }}</option>
						</select>
					</div>
				</div>
				<div class="field" v-show="selectChoices.types.length">
					<label class="label">หมวดหมู่ย่อย</label>
					<div class="select full">
						<select v-model="type">
							<option :value="type" v-for="type in selectChoices.types" :key="type.id">{{ type.name }}</option>
						</select>
					</div>
				</div>
			</div>
		</section>
		<!-- DESCRIPTION -->
		<section class="column is-full">
			<div class="box">
				<div class="field">
					<h3 class="section-heading">คำอธิบายสินค้า</h3>
					<div class="control">
						<textarea class="textarea" placeholder="คำอธิบายสินค้าของคุณ..." v-model="description"></textarea>
					</div>
				</div>
			</div>
		</section>
		<section class="column is-half">
			<div class="box">
				<h3 class="section-heading">ตัวเลือกสินค้า</h3>
				<div class="field is-grouped">
					<p class="control is-expanded">
						<input class="input" type="text" v-model="form.choice" placeholder="เช่น สี ไซส์">
					</p>
					<p class="control">
						<button :disabled="!form.choice" class="btn success group" @click="addChoice">เพิ่ม</button>
					</p>
				</div>
			</div>
		</section>
		<section class="column is-half">
			<div class="box">
				<h3 class="section-heading">ตัวเลือกของสินค้านี้</h3>
				<div class="field is-grouped is-grouped-multiline">
					<div class="control" v-for="(item, index) in choices" :key="item.id">
						<div class="tags has-addons are-medium are-light">
							<span class="tag is-primary">{{ item.name }}</span>
							<a class="tag fas fa-times" @click="deleteChoice(index)"></a>
						</div>
					</div>
				</div>
				<p class="subtitle" v-show="!choices.length">ไม่มีตัวเลือก</p>
			</div>
		</section>
		<section class="column is-full">
			<button type="submit" class="btn success form-submit is-pulled-right">อัพโหลดสินค้า</button>
		</section>
	</form>
</div>
</template>
<script>
import Dropzone from 'dropzone'
import FileUpload from '../components/FileUpload'
Dropzone.autoDiscover = false
export default {
	components:{
		FileUpload
	},
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
							if (file.size > self.$root.photoSize.file) {
								alert('ขนาดรูปต้องไม่เกินรูปละ' + self.$root.photoSize.string);
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
						//document.location.href = '/admin/products/upload';
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
				if (this.errors.any()) {
					alert('โปรดแก้ไขแบบฟอร์มก่อน')
				} else {
					self.image.processQueue()
				}
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
			this.choices.push({
				name: this.form.choice,
				qty: 1
			})
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
