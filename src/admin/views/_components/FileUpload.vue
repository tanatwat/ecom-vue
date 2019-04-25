<template>
  <div class="columns">
    <div class="column">
      <div class="image-preview" :class="{'active' : image_preview}">
        <i class="fas fa-images" :class="{'is-hidden' : image_preview}"></i>
        <img :src="image_preview">
      </div>
    </div>
    <div class="column button-wrapper">
      <input class="file-input" ref="thumbnail" type="file" id="thumbnail" @change="preview">
      <label class="btn primary" for="thumbnail">เลือกรูปภาพ</label>
      <button class="btn error full-width" type="button" :disabled="!image_preview || !changed" @click="removeFile">ลบรูปภาพ</button>
      <button class="btn success full-width" type="button" :disabled="!image_preview || !changed" @click="$emit('upload')" v-show="allowUpload">อัพโหลด</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      image_preview: this.imageSrc,
      changed: false
    }
  },
  props: {
    allowUpload: {
      default: false
    },
    imageSrc: {
      default: null
    }
  },
  methods: {
    preview(event) {
      var input = event.target;
      if (input.files && input.files[0]) {
        if (input.files[0].size > self.$root.thumbnailSize.file) {
          alert('ขนาดไฟล์ต้องไม่เกิน' + self.$root.thumbnailSize.string);
          this.removefile()
        }
        var reader = new FileReader();
        var vm = this;
        reader.onload = function(e) {
          vm.image_preview = e.target.result;
          vm.$parent.image_preview = vm.image_preview
        }
        reader.readAsDataURL(input.files[0]);
        this.changed = true
      }
    },
    removeFile() {
      this.image_preview = null;
      this.$parent.image_preview = null;
    },
    returnFile() {
      return this.$refs.thumbnail.files[0]
    }
  }
}
</script>
