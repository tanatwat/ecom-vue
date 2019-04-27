<template>
  <section style="padding: 30px 0">
    <div :class="`product-${view}`">
      <div class="product-card" v-for="(item, index) in products">
        <div class="product-img-wrapper">
          <img :src="'https://s3-ap-southeast-1.amazonaws.com/images.peach/thumbnail/' + item.thumbnail" alt="">
        </div>
        <div class="product-card-sub">
          <div class="product-details-wrapper">
            <a class="product-link" @click.prevent="$emit('link-click', Object.assign(item, {index: index}))">{{ item.name }}</a>
            <p class="product-detail" v-show="!item.discount_price">{{ $number.format(item.price) + ' บาท' }}</p>
            <p class="product-detail" v-show="item.discount_price">
              <strike>{{$number.format(item.price)}}</strike>&nbsp;
              <span class="has-text-success">{{ $number.format(item.discount_price) + ' บาท' }}</span>
            </p>
          </div>
          <div class="product-action-wrapper" v-if="actionBar">
            <button class="btn-icon primary fas fa-pen" type="button" @click="edit(item.uid)"></button>
            <button class="btn-icon error fas fa-trash-alt" type="button" @click="remove(index, item.uid)"></button>
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
         default: 'grid'
      },
      products: {
         type: Array,
         required: true
      },
      actionBar: {
         type: Boolean,
         default: false
      }
   },
   methods: {
    saleCalc(price, discount) {
      var val = (price - discount) / ((price + discount) / 2);
      var result = val * 100;
      return Math.round(result);
    },
   },
}
</script>