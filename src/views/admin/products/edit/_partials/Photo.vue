<template>
  <div class="column is-full">
    <div class="box">
      <section>
        <h3 class="section-heading">รูปภาพสินค้า</h3>
        <p
          class="is-size-4 text-center"
          style="padding:15px 0"
          v-if="!photos.length"
        >สินค้านี้ไม่มีรูปภาพ</p>
        <div class="product-grid" style="padding:15px 0" v-else>
          <div class="image-preview" v-for="(photo, index) in photos">
            <img :src="photoUrl + photo">
            <a
              class="btn error top-right fas fa-trash-alt"
              @click.prevent="remove(photo, index)"
              v-show="photos.length > 1"
            ></a>
          </div>
        </div>
      </section>
      <section>
        <div class="form-group">
          <h3 class="section-heading">อัพโหลดรูปภาพเพิ่ม</h3>
          <div class="dropzone margin-15-v" id="uploader">
            <div class="dz-message" data-dz-message>
              <span>คลิกเพื่อเลือกรูปที่จะอัพโหลด</span>
              <br>
              <span>อัพโหลดได้ไม่เกิน 7 รูป ไม่เกิน รูปละ 2 MB</span>
            </div>
          </div>
        </div>
      </section>
      <div class="action-wrapper right form-submit">
        <button
          class="btn success action is-pulled-right"
          type="button"
          @click="submit"
        >อัพโหลดสินค้า</button>
      </div>
    </div>
  </div>
</template>
<script>
import Dropzone from "dropzone";
Dropzone.autoDiscover = false;
export default {
  data() {
    return {
      photoUrl: "https://s3-ap-southeast-1.amazonaws.com/images.peach/photo/",
      filesCount: 0
    };
  },
  props: ["photos"],
  methods: {
    initDropzone: function() {
      self = this;
      self.$nextTick(function() {
        self.image = new Dropzone("#uploader", {
          method: "post",
          url:
            self.$root.backendUrl +
            "/product/" +
            self.$route.params.uid +
            "/edit/photo/upload",
          autoProcessQueue: false,
          uploadMultiple: true,
          parallelUploads: 7,
          maxFiles: 7,
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
              if (
                this.files.length > self.$root.photoLimit ||
                self.photos.length + this.files.length > self.$root.photoLimit
              ) {
                this.removeFile(this.files[0]);
              }
              if (file.size > self.$root.photoSize.file) {
                alert("ขนาดรูปต้องไม่เกินรูปละ " + self.$root.photoSize.string);
                this.removeFile(file);
              }
              if (self.photos.length >= self.$root.photoLimit) {
                alert("สามารถมีรูปได้ไม่เกิน " + self.$root.photoLimit);
                this.removeFile(file);
              }
              if (this.files.length >= 1) {
                self.filesCount = this.files.length;
              }
            });
          },
          sendingmultiple: function(data, xhr, formData) {
            formData.append("photos", self.photos);
          },
          processingmultiple: function() {
            self.$Progress.start();
            self.$root.loading = true;
          },
          success(file) {
            this.removeFile(this.files[0]);
          },
          successmultiple: function(file, response) {
            toastr.success("อัพโหลดเรียบร้อย");
            self.$Progress.finish();
            self.$root.loading = false;
            for (var photo of response.values()) {
              self.photos.push(photo );
            }
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
    remove(filename, index) {
      if (confirm("ลบรูปภาพนี้?")) {
        let filtered = this.photos.filter(function(value, index, arr) {
          return value !== filename;
        });
        this.$http
          .put("product/" + this.$route.params.uid + "/edit/photo/delete", {
            photo: filename,
            files: filtered
          })
          .then(
            () => {
              toastr.success("ลบรูปภาพแล้ว");
              this.photos.splice(index, 1);
            },
            () => {
              toastr.error("เกิดข้อผิดพลาด");
            }
          );
      }
    }
  },
  created() {
    this.initDropzone();
  }
};
</script>
