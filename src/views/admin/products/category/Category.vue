<template>
  <div class="">
    <div class="columns">
      <div class="column is-full">
        <div class="tab">
          <button :class="{'active' : tab == 1}" @click="tab = 1">หมวดหมู่</button>
          <button :class="{'active' : tab == 2}" @click="tab = 2">แบรนด์</button>
        </div>
      </div>
    </div>
    <category v-if="tab == 1"></category>
    <brand v-else></brand>
  </div>
</template>

<script>
import Category from './_partials/CreateCategory'
import Brand from './_partials/CreateBrand'
export default {
  components: {
    'category': Category,
    'brand': Brand
  },
  data() {
    return {
      tab: 1
    }
  }
}
</script>
