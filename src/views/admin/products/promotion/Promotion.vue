<template>
  <div>
    <div class="columns">
      <div class="column is-full">
        <div class="tab">
          <button :class="{'active' : tab == 1}" @click="tab = 1">ลดราคาสินค้า</button>
          <button :class="{'active' : tab == 2}" @click="tab = 2">โค๊ดส่วนลด</button>
        </div>
      </div>
    </div>
    <discount v-if="tab == 1"></discount>
    <discount-code v-if="tab == 2"></discount-code>
  </div>
</template>
<script>
import Discount from "./_Discount";
import DiscountCode from "./_DiscountCode";
export default {
  components: {
    Discount,
    DiscountCode
  },
  data() {
    return {
      tab: 1
    }
  }
};
</script>