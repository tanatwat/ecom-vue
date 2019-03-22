<template lang="html">
<div>
  <section class="columns">

  </section>

  <pagination :meta="meta" v-on:switched="changePage" v-show="products.length"></pagination>
</div>
</template>
<script>
import SearchFilter from '../../../components/Filter'
import Pagination from '../../../components/Pagination'
export default {
	components: {
		SearchFilter,
		Pagination
	},
	data() {
		return {
			products: [],
			meta: [],
			imgUrl: this.$root.url + '/file/product/thumbnail/',
			query: {
				name: null,
				orderBy: null,
				category: null,
				subcategory: null,
				maxPrice: null,
				minPrice: null,
				discount: null,
				page: null,
			},
			view: 'grid'
		}
	},
	methods: {
		addQueryParam(params) {
			_.mapValues(this.query, (val) => {
				val = null
			})
			this.query.name = params.name
			this.query.orderBy = params.order
			this.query.category = params.category
			this.query.subcategory = params.subcategory
			this.query.maxPrice = params.max
			this.query.minPrice = params.min
			this.query.discount = params.discount ? true : null
			this.query.page = null
			this.getProduct()
		},
		changePage(page) {
			this.query.page = page
			this.getProduct()
		},
		changeView(view) {
			this.view = view
		},
		getProduct() {
			this.$root.loading = true
			this.products = []
			axios.get(this.$root.url + '/api/get/products_paginate', {
				params: {
					name: this.query.name,
					order: this.query.orderBy,
					c: this.query.category,
					sub: this.query.subcategory,
					max: this.query.maxPrice,
					min: this.query.minPrice,
					dc: this.query.discount,
					page: this.query.page ? this.query.page : 1,
				}
			}).then(response => {
				this.products = response.data.data
				this.meta = response.data.meta
				this.$root.loading = false
			}, response => {
				this.$root.loading = false
				toastr.error('เกิดข้อผิดพลาด')
			})
		},
		remove(index, uid) {
			if (confirm('คุณแน่ใจหรือไม่ว่าต้องการจะลบสินค้านี้?')) {
				axios.delete(this.$root.url + '/admin/product/delete/' + uid).then(response => {
					toastr.success('ลบสินค้าแล้ว')
					this.products.splice(index, 1)
				}, response => {
					toastr.error('เกิดข้อผิดพลาด')
				})
			}
		},
		saleCalc(price, discount) {
			var val = (price - discount) / ((price + discount) / 2)
			var result = val * 100
			return Math.round(result);
		},
		addToHome(uid, index) {
			axios.put(this.$root.url + '/admin/product/feature/' + uid).then(response => {
				if (this.products[index].featured == true) {
					this.products[index].featured = false
					toastr.success('ลบออกจากหน้าแรกแล้ว')
				} else {
					this.products[index].featured = true
					toastr.success('เพิ่มในหน้าแรกแล้ว')
				}
			}, response => {
				toastr.error('เกิดข้อผิดพลาด')
			})
		}
	},
	created() {
		this.getProduct()
	}
}
</script>
