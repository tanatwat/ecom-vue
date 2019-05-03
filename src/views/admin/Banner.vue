<template>
  <div class="columns is-multiline is-mobile">
    <div class="column is-full">
      <button class="btn primary" @click="formVisible = !formVisible">
        อัพโหลดแบนเนอร์&nbsp;
        <i class="fas fa-plus"></i>
      </button>
    </div>
    <transition name="fade">
      <section class="column is-full" v-show="formVisible">
        <div class="box">
          <div class="form-group">
            <h3 class="section-heading">รูปภาพสินค้า</h3>
            <div class="dropzone margin-15-v" id="uploader">
              <div class="dz-message" data-dz-message>
                <span>คลิกเพื่อเลือกรูปที่จะอัพโหลด</span>
                <br>
                <span>อัพโหลดได้ไม่เกิน 7 รูป ไม่เกิน รูปละ 1 MB</span>
              </div>
            </div>
          </div>
          <div class="action-wrapper form-submit right">
            <button class="btn success" @click="submit">อัพโหลดแบนเนอร์</button>
          </div>
        </div>
      </section>
    </transition>

    <div class="product-grid" style="padding:15px 0" v-if="banners.length">
      <div class="image-preview" v-for="(banner, index) in banners">
        <img :src="photoUrl + banner">
        <a class="btn error top-right fas fa-trash-alt" @click.prevent="remove(banner, index)"></a>
      </div>
    </div>

    <div class="column text-center" v-else>
      <h3 class="is-size-4">ไม่มีแบนเนอร์</h3>
    </div>
  </div>
</template>

<script>
import Dropzone from "dropzone";
Dropzone.autoDiscover = false;
export default {
  data() {
    return {
      banners: [],
      filesCount: 0,
      photoUrl: "https://s3-ap-southeast-1.amazonaws.com/images.peach/banners/",
      formVisible: false
    };
  },
  methods: {
    initDropzone: function() {
      self = this;
      self.$nextTick(function() {
        self.image = new Dropzone("#uploader", {
          method: "post",
          url: self.$root.backendUrl + "/banners/upload",
          autoProcessQueue: false,
          uploadMultiple: true,
          parallelUploads: 5,
          maxFiles: 5,
          paramName: "files",
          maxFilesize: 2,
          acceptedFiles: "image/*",
          addRemoveLinks: true,
          dictRemoveFile: "×",
          dictCancelUpload: "×",
          headers: {
            Authorization: `Bearer ${localStorage.token}`,
            Client: localStorage.client,
            FilesCount: `${self.filesCount}`
          },
          init: function() {
            this.on("addedfile", function(file) {
              if (this.files.length > 5) {
                this.removeFile(this.files[0]);
              }
              if (file.size > self.$root.photoSize.file) {
                alert("ขนาดรูปต้องไม่เกินรูปละ" + self.$root.photoSize.string);
                this.removeFile(file);
              }
              if (this.files.length >= 1) {
                self.filesCount = this.files.length;
              }
            });
          },
          sendingmultiple: function(data, xhr, formData) {
            formData.append("banners", self.banners);
          },
          processing: function() {
            self.$Progress.start();
            self.$root.loading = true;
          },
          success: function() {
            toastr.success("อัพโหลดเรียบร้อย", {
              preventDuplicates: true
            });
            this.removeFile(this.files[0]);
            self.$Progress.finish();
            document.location.reload();
            self.$root.loading = false;
          },
          error: function() {
            self.$Progress.fail();
            self.$root.loading = false;
            toastr.error("เกิดข้อผิดพลาด");
            this.removeFile(this.files[0]);
          }
        });
      });
    },
    submit() {
      self.image.options.headers.FilesCount = this.filesCount;
      self.image.processQueue();
    },
    get() {
      this.$http.get("/banners").then(response => {
        this.banners = JSON.parse(response.data[0].files);
      });
    },
    remove(banner, index) {
      if (confirm("ลบแบนเนอร์นี้?")) {
        let filtered = this.banners.filter(function(value, index, arr) {
          return value !== banner;
        });
        this.$http
          .put("/banners/remove", {
            files: filtered,
            banner: banner
          })
          .then(response => {
            toastr.success("ลบแบนเนอร์แล้ว");
            this.banners.splice(index, 1);
          });
      }
    }
  },
  created() {
    this.get();
    this.initDropzone();
  }
};
</script>
