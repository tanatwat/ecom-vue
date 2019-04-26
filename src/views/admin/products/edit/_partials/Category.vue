<template>
<div class="column is-6">
	<div class="box">
		<h3 class="section-heading">หมวดหมู่</h3>
		<strong class="font-success">หมวดหมู่ของสินค้านี้</strong>
		<br>
		<p>
			{{ $parent.product.category.name }}
			{{ $parent.product.subcategory ? $parent.product.subcategory.name : null }}
			{{ $parent.product.type ? $parent.product.type.name : null }}
		</p>
		<br>
		<strong>แก้ไขหมวดหมู่</strong>
		<form method="post" @submit.prevent="edit">
			<div class="field" v-show="categories.length" id="category">
				<label class="label">หมวดหมู่</label>
				<div class="select full">
					<select required v-model="category" @change="selectCategory(category)">
						<option :value="category" v-for="category in categories" :key="category.id">{{ category.name }}</option>
					</select>
				</div>
			</div>
			<div class="field" v-show="selectChoices.subcategories.length" id="subcategory">
				<label class="label">หมวดหมู่รอง</label>
				<div class="select full">
					<select v-model="subcategory" @change.prevent="selectSubcategory(subcategory)">
						<option :value="subcategory" v-for="subcategory in selectChoices.subcategories" :key="subcategory.id">{{ subcategory.name }}</option>
					</select>
				</div>
			</div>
			<div class="field" v-show="selectChoices.types.length" id="type">
        <label class="label">หมวดหมู่ย่อย</label>
				<div class="select full">
					<select v-model="type">
						<option :value="type" v-for="type in selectChoices.types" :key="type.id">{{ type.name }}</option>
					</select>
				</div>
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
			category: null,
			subcategory: null,
			type: null,
			selectChoices: {
				subcategories: [],
				types: [],
			},
		}
	},
	props: ['categories'],
	methods: {
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
		edit() {
			this.$http.put('/product/' + this.$parent.product.uid + '/edit/category', {
				category: this.category.id,
				subcategory: this.subcategory ? this.subcategory.id : null,
				type: this.type ? this.type.id : null
			}).then(() => {
				toastr.success('บันทึกหมวดหมู่แล้ว')
				// emit data to parent
				let data = {
					category: this.category.name,
					subcategory: this.subcategory ? this.subcategory.name : null,
					type: this.type ? this.type.name : null
				}
				this.$emit('category-change', data)
				// reset form
				this.category = null
				this.subcategory = null
				this.type = null
				this.selectChoices.subcategories = []
				this.selectChoices.types = []
			}, () => {
				toastr.error('เกิดข้อผิดพลาด')
			})
		}
	}
}
</script>
