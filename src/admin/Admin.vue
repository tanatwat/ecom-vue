<template>
<div>
	<nav class="menu">
		<div class="logo">
			<img src="../assets/Ecom.svg" alt="">
		</div>
    <router-link to="/admin" exact>Home</router-link>
    <router-link to="/admin/products">Product</router-link>
		<div class="menu-dropdown" v-show="$router.path == products">
			<router-link to="/admin/products/upload">เพิ่มสินค้า</router-link>
			<router-link to="/admin/products/category">หมวดหมู่ & แบรนด์</router-link>
			<router-link to="/admin/products/promotions">โปรโมชั่น</router-link>
			<router-link to="/admin/products/stock">สต๊อก</router-link>
		</div>
		<router-link to="/admin/orders">orders</router-link>
		<router-link to="/admin/banner">Banner</router-link>
		<router-link to="/admin/showcase">Showcase</router-link>
		<router-link to="/admin/payment">Payment</router-link>
		<router-link to="/admin/settings">Settings</router-link>
		<router-link to="/admin/shipping">Shipping</router-link>
  </nav>
	<nav class="mobile-menu">
		<div class="logo">
			<img src="../assets/Ecom.svg" alt="">
		</div>
		<i class="fas fa-bars menu-btn"></i>
	</nav>
  <div class="dashboard">
    <div class="container">
      <router-view />
    </div>
  </div>

</div>
</template>

<style lang="sass">
  @import './sass/admin.sass'
</style>
