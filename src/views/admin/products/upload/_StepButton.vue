<template>
   <div class="action-wrapper form-submit" :class="align">
      <button v-show="prevButton" type="button" class="btn primary" @click="prev">ย้อนกลับ</button>
      <button v-show="nextButton" :disabled="disable" type="button" class="btn success" @click="next">ต่อไป</button>
      <button v-show="submitButton" type="button" class="btn success" @click="submit">อัพโหลดสินค้า</button>
   </div>
</template>

<script>
export default {
   props: {
      nextButton: {
         type: Boolean,
         default: true
      },
      prevButton: {
         type: Boolean,
         default: true
      },
      submitButton: {
         type: Boolean,
         default: false
      },
      disable: {
         type: Boolean,
         default: false
      },
      align: {
         type: String,
         default: 'between'
      }
   },
   methods: {
      next() {
         this.$emit('next')
      },
      prev() {
         this.$emit('prev')
      },
      submit() {
         this.$emit('submit-form')
      }
   },
}
</script>