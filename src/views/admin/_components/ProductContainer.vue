<template>
  <section style="padding: 30px 0" v-show="products.length">
    <div :class="`product-${view}`">
      <div class="product-card" v-for="(item, index) in products">
        <div class="product-img-wrapper">
          <img
            :src="'https://s3-ap-southeast-1.amazonaws.com/images.peach/thumbnail/' + item.thumbnail"
            alt
          >
        </div>
        <div class="product-card-sub">
          <div class="product-details-wrapper">
            <a
              class="product-link"
              @click.prevent="$emit('link-click', Object.assign(item, {index: index}))"
            >{{ item.name }}</a>
            <p
              class="product-detail"
              v-show="!item.discount_price"
            >{{ $number.format(item.price) + ' บาท' }}</p>
            <p class="product-detail" v-show="item.discount_price">
              <strike>{{$number.format(item.price)}}</strike>&nbsp;
              <span
                class="has-text-success"
              >{{ $number.format(item.discount_price) + ' บาท' }}</span>
            </p>
          </div>
          <div class="product-action-wrapper" v-if="actionBar">
            <button
              class="btn-icon primary fas fa-pen"
              type="button"
              @click="$router.replace('/admin/products/' + item.uid + '/edit')"
              v-show="editButton"
            ></button>
            <button
              class="btn-icon error fas fa-trash-alt"
              type="button"
              @click="remove(item.uid, index)"
              v-show="removeButton"
            ></button>
            <button
              class="btn-flat secondary no-margin no-padding"
              type="button"
              @click="$emit('remove-discount', Object.assign(item, {index: index}))"
              v-show="removeDiscount"
            >ยกเลิกโปรโมชั่น</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  props: {
    view: {
      type: String,
      default: "grid"
    },
    products: {
      type: Array,
      required: true
    },
    removeOptions: {
      type: Object,
      default: () => {
        return {
          success: 'ลบสินค้าแล้ว',
          confirm: 'คุณต้องการลบสินค้านี้?'
        };
      }
    },
    actionBar: {
      default: false
    },
    editButton: {
      default: false
    },
    removeButton: {
      default: false
    },
    removeDiscount: {
      default: false
    },
  },
  methods: {
    saleCalc(price, discount) {
      var val = (price - discount) / ((price + discount) / 2);
      var result = val * 100;
      return Math.round(result);
    },
    remove(uid, index) {
      if (confirm(this.removeOptions.confirm)) {
        this.$http.delete('/products/' + uid).then(
          () => {
            this.$parent.products.splice(index, 1);
            toastr.success(this.removeOptions.success);
          },
          () => {
            toastr.error("เกิดข้อผิดพลาด");
          }
        );
      }
    }
  }
};
</script>