<template>
<div class="columns is-multiline is-mobile">
	<!-- CATEGORY -->
	<section class="column is-full-mobile order-2-mobile">
		<div class="section-wrapper">
			<h3 class="section-heading">หมวดหมู่สินค้าของร้าน</h3>
			<label v-show="!categories.length">ไม่มีหมวดหมู่</label>
			<div class="data-list" v-for="(category, index) in categories">
				<p class="data-title">{{ category.name }}</p>
				<div class="data-text" v-for="(subcategory, index) in category.subcategory">
					<p>{{ subcategory.name }}</p>
					<p class="sub" v-for="(type, index) in subcategory.type">{{ type.name }}</p>
				</div>
				<div class="action-wrapper right action has-margin">
					<!-- <router-link :to="{ name: 'categoryEdit', params: { category: category.id }}" class="btn-icon primary fas fa-pen"></router-link> -->
					<button class="btn-icon error fas fa-trash-alt" @click="removeCategory(category.id, index)"></button>
				</div>
			</div>
		</div>
	</section>
	<!-- ADD CATEGORY -->
	<section class="column is-full-mobile order-1-mobile">
		<div class="section-wrapper">
			<h3 class="section-heading">สร้างหมวดหมู่</h3>

			<!-- CATEGORY FORM -->
			<div class="form-group" v-show="!confirmed.category.name">
				<label>ชื่อหมวดหมู่</label>
				<div class="input-group">
					<input type="text" v-model="form.category" placeholder="ชื่อหมวดหมู่หลัก">
					<button :disabled="!form.category" type="button" class="btn success group right-column" @click="confirmCategory">ยืนยัน</button>
				</div>
			</div>
			<!-- SUBCATEGORY FORM -->
			<div class="form-group" v-show="confirmed.category.name && !confirmed.category.subcategories.length">
				<label>หมวดหมู่หลัก&nbsp;<i class="fas fa-caret-right"></i>&nbsp;หมวดหมู่รอง</label>
				<p class="section-heading">หมวดหมู่รอง<small class="optional">(ไม่มีก็ได้)</small></p>
				<div style="padding-bottom:8px">
					<small>*หากไม่ต้องการเพิ่มให้คลิก เพิ่มหมวดหมู่ด้านล่างได้เลย</small><br>
				</div>
				<div class="input-group">
					<input type="text" v-model="form.subcategory" placeholder="ชื่อหมวดหมู่รอง">
					<button :disabled="!form.subcategory" type="button" class="btn success group right-column" @click="addSubcategory">เพิ่ม</button>
				</div>
				<div class="subcategories-form" v-show="form.subcategories.length">
					<div class="tags has-addons are-medium" v-for="(item, index) in form.subcategories" style="margin-bottom:5px">
						<span class="tag is-primary">{{ item.name }}</span>
						<a class="tag fas fa-times" @click.prevent="removeSub(index)"></a>
					</div>
					<div class="action-wrapper form-submit right">
						<button class="btn primary action full-width-mobile" type="button" @click="confirmSubcategory">ยืนยันหมวดหมู่รอง</button>
					</div>
				</div>
			</div>

			<!-- TYPES FORM -->
			<div class="form-group" v-show="confirmed.category.subcategories.length && !formFilled">
				<label>หมวดหมู่หลัก&nbsp;<i class="fas fa-caret-right"></i>&nbsp;หมวดหมู่รอง&nbsp;<i class="fas fa-caret-right"></i>&nbsp;หมวดหมู่ย่อย</label>
				<div class="types-form">
					<p class="section-heading">หมวดหมู่ย่อย<small class="optional">(ไม่มีก็ได้)</small></p>
					<div style="padding-bottom:8px">
						<small>*หากไม่ต้องการเพิ่มให้คลิก เพิ่มหมวดหมู่ด้านล่างได้เลย</small><br>
						<small>*คลิก&nbsp;<i class="fas fa-plus"></i>&nbsp;เพื่อเพิ่มหมวดหมู่ย่อย</small>
					</div>
					<div v-for="(item, index) in confirmed.category.subcategories">
						<div class="tags has-addons are-medium" style="margin-bottom:3px">
							<span class="tag" :class="{'is-success' : typeForm == index, 'is-primary' : typeForm !== index}">{{ item.name }}</span>
							<a class="tag fas" :class="{'fa-plus' : typeForm !== index, 'fa-caret-down' : typeForm == index}" @click.prevent="toggleTypeForm(index)"></a>
						</div>
						<div class="input-group" v-show="typeForm == index">
							<input type="text" v-model="form.type" placeholder="ชื่อหมวดหมู่ย่อย">
							<button :disabled="!form.type" type="button" class="btn success group right-column" @click="addType(index)">เพิ่ม</button>
						</div>
						<div class="tags has-addons are-medium are-light" style="margin-bottom:3px" v-for="(type, index) in confirmed.category.subcategories[index].types">
							<span class="tag">{{ type.name }}</span>
							<a class="tag fas fa-times" @click.prevent="removeType(index)"></a>
						</div>
					</div>
					<div class="action-wrapper form-submit right">
						<button class="btn primary action full-width-mobile" type="button" @click="confirmType">ยืนยันหมวดหมู่ย่อย</button>
					</div>
				</div>
			</div>

			<!-- CATEGORY OVERVIEW -->
			<div class="" v-show="confirmed.category.name">
				<h3 class="section-heading">ตัวอย่าง</h3>
				<div class="data-list">
					<p class="data-title">{{ confirmed.category.name ? confirmed.category.name : 'ชื่อหมวดหมู่' }}</p>
					<div class="data-text">
						<div class="" v-for="subcategory in confirmed.category.subcategories">
							<p>{{ subcategory.name }}</p>
							<p class="sub" v-for="type in subcategory.types" v-show="formFilled">{{ type.name }}</p>
						</div>
						<p v-show="!confirmed.category.subcategories.length">ไม่มีหมวดหมู่รอง</p>
					</div>
				</div>
				<div class="action-wrapper form-submit right has-margin">
					<button class="btn success action full-width-mobile" type="button" @click.prevent="addCategory()">สร้างหมวดหมู่</button>
					<button class="btn error action full-width-mobile" type="button" @click.prevent="cancle">ยกเลิก</button>
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
			categories: [],
			typeForm: null,
			form: {
				category: null,
				subcategory: null,
				subcategories: [],
				type: null
			},
			confirmed: {
				category: {
					name: null,
					subcategories: []
				}
			},
			formFilled: false
		}
	},
	methods: {
		getCategory() {
			axios.get('/categories').then(response => {
				this.categories = response.data
			})
		},
		addCategory() {
			if (confirm('ยืนยันหมวดหมู่นี้?')) {
				const category = this.confirmed.category.name
				const subcategories = this.confirmed.category.subcategories
				axios.post('/categories', {
					category: category,
					subcategories: subcategories,
					formFilled: this.formFilled
				}).then(response => {
					this.categories.push(response.data)
					this.resetForm()
					toastr.success('สร้างหมวดหมู่แล้ว')
				}, () => {
					toastr.error('เกิดข้อผิดพลาด')
				})
			}
		},
		removeCategory(id, index) {
			if (confirm('คุณแน่ใจหรือไม่ว่าจะลบหมวดหมู่นี้?')) {
				axios.delete('/categories/' + id).then(() => {
					this.categories.splice(index, 1)
					toastr.success('ลบหมวดหมู่แล้ว')
				})
			}
		},
		confirmCategory() {
			this.confirmed.category.name = this.form.category
			this.form.category = null
		},
		addSubcategory() {
			this.form.subcategories.push({
				name: this.form.subcategory,
				types: []
			})
			this.form.subcategory = null
		},
		confirmSubcategory() {
			if (confirm('คุณจะไม่สามารถแก้ไขหมวดหมู่รองได้อีก คุณแน่ใจหรือไม่?')) {
				this.confirmed.category.subcategories = this.form.subcategories
				this.form.subcategories = []
			}
		},
		removeSub(index) {
			this.form.subcategories.splice(index, 1)
		},
		toggleTypeForm(index) {
			if (this.typeForm == index) {
				this.typeForm = null
			} else {
				this.typeForm = index
			}
		},
		addType(index) {
			this.confirmed.category.subcategories[index].types.push({
				name: this.form.type
			})
			this.form.type = null
		},
		removeType(index) {
			this.confirmed.category.subcategories[this.typeForm].types.splice(index, 1)
			toastr.success('ลบหมวดหมู่ย่อยแล้ว')
		},
		confirmType() {
			if (confirm('คุณจะไม่สามารถแก้ไขหมวดหมู่ได้อีก คุณแน่ใจหรือไม่?')) {
				this.formFilled = true
			}
		},
		cancle() {
			if (confirm('ยกเลิกการเพิ่มหมวดหมู่?')) {
				this.resetForm()
				toastr.success('ยกเลิกการสร้างหมวดหมู่แล้ว')
			}
		},
		resetForm() {
			this.confirmed.category = {
				name: null,
				subcategories: []
			}
			this.form = {
				category: null,
				subcategory: null,
				subcategories: [],
				type: null
			}
			this.formFilled = false
		}
	},
	created() {
		this.getCategory()
	}
}
</script>
