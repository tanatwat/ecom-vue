<template>
<div>
	<vue-progress-bar></vue-progress-bar>
	<nav class="menu">
		<div class="logo">
			<img src="../../assets/imgs/Ecom.svg" alt="">
		</div>
		<router-link to="/admin" exact><i class="fas fa-home"></i>หน้าแรก</router-link>
		<hr>
		<i class="menu-title">จัดการสินค้า</i>
		<div>
			<router-link to="/admin/products" exact><i class="fas fa-box"></i>สินค้าในร้าน</router-link>
			<router-link to="/admin/products/upload"><i class="fas fa-plus"></i>เพิ่มสินค้า</router-link>
			<router-link to="/admin/products/category"><i class="fas fa-th-large"></i>หมวดหมู่ & แบรนด์</router-link>
			<router-link to="/admin/products/promotions"><i class="fas fa-receipt"></i>โปรโมชั่น</router-link>
			<router-link to="/admin/products/stock"><i class="fas fa-boxes"></i>สต๊อก</router-link>
		</div>
		<hr>
		<i class="menu-title">จัดการหน้าร้าน</i>
		<div>
			<router-link to="/admin/banner"><i class="fas fa-ad"></i>แบนเนอร์</router-link>
			<router-link to="/admin/showcase"><i class="fas fa-table"></i>คอลเล็คชั่น</router-link>
			<router-link to="/admin/settings"><i class="fas fa-user"></i>ข้อมูลร้าน</router-link>
		</div>
		<hr>
		<router-link to="/admin/orders"><i class="fas fa-list"></i>รายการสั่งซื้อ</router-link>
		<router-link to="/admin/payment"><i class="fas fa-dollar-sign"></i>ช่องทางชำระเงิน</router-link>
		<router-link to="/admin/shipping"><i class="fas fa-truck"></i>การจัดส่ง</router-link>
		<a @click.prevent="logout"><i class="fas fa-door-open"></i>ออกจากระบบ</a>

	</nav>
	<nav class="mobile-menu">
		<div class="logo">
			<img src="../../assets/imgs/Ecom.svg" alt="">
		</div>
		<i class="fas fa-bars menu-btn"></i>
	</nav>
	<div class="dashboard">
		<div class="load-overlay" v-show="$root.loading">
			<div class="roller-wrapper">
				<div class="lds-roller">
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
				</div>
			</div>
		</div>

		<div class="container">
			<div class="page-title">
				<h1 class="title">Title</h1>
				<h2 class="subtitle">SubTitle</h2>
			</div>
			<router-view />
		</div>
	</div>

</div>
</template>
<script>
export default {
	data() {
		return {
			dropdown: false
		};
	},
	methods: {
		dropdownToggle(id) {
			if (this.dropdown == id) {
				this.dropdown = null
			} else {
				this.dropdown = id
			}
		},
		logout() {
			this.$root.loading = true
			localStorage.removeItem('token')
      this.$router.go()
		}
	},
	created() {
		this.$http.interceptors.request.use((config) => {
			// trigger 'loading=true' event here
			this.$Progress.start();
			this.$root.loading = true
			return config;
		}, (error) => {
			// trigger 'loading=false' event here
			this.$Progress.fail();
			this.$root.loading = false
			return Promise.reject(error);
		});

		this.$http.interceptors.response.use((response) => {
			// trigger 'loading=false' event here
			this.$Progress.finish();
			this.$root.loading = false
			return response;
		}, (error) => {
			// trigger 'loading=false' event here
			this.$Progress.fail();
			this.$root.loading = false
			return Promise.reject(error);
		});
	}
}
</script>
<style lang="sass">
  @import '../../assets/sass/admin.sass'
</style>
