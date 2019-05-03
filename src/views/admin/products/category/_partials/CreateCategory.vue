<template>
  <div class="columns is-multiline">
    <div class="column is-full">
      <button class="btn primary" @click="formVisible = !formVisible">
        เพิ่มหมวดหมู่&nbsp;
        <i class="fas fa-plus"></i>
      </button>
    </div>
    <!-- ADD CATEGORY -->
    <transition name="fade">
      <section class="column is-full" v-show="formVisible">
        <div class="box">
          <h3 class="section-heading">สร้างหมวดหมู่</h3>
          <ul class="list-unstyled multi-steps" style="padding:10px 0">
            <li :class="{'is-active' : steps == 1}">หมวดหมู่หลัก</li>
            <li :class="{'is-active' : steps == 2}">หมวดหมู่รอง</li>
            <li :class="{'is-active' : steps == 3}">หมวดหมู่ย่อย</li>
          </ul>
          <!-- CATEGORY FORM -->
          <div class="field" v-show="!confirmed.category.name">
            <label class="label">ชื่อหมวดหมู่</label>
            <div class="field is-grouped">
              <p class="control is-expanded">
                <input
                  class="input"
                  type="text"
                  v-model="form.category"
                  placeholder="ชื่อหมวดหมู่หลัก"
                >
              </p>
              <div class="control">
                <button
                  :disabled="!form.category"
                  class="btn success group"
                  @click="confirmCategory"
                >ต่อไป</button>
              </div>
            </div>
          </div>
          <!-- SUBCATEGORY FORM -->
          <div
            class="field"
            v-show="confirmed.category.name && !confirmed.category.subcategories.length && steps == 2"
          >
            <div style="padding-bottom:8px">
              <small>*หากไม่ต้องการเพิ่มให้คลิก สร้างหมวดหมู่ด้านล่างได้เลย</small>
              <br>
            </div>
            <div class="field is-grouped">
              <p class="control is-expanded">
                <input
                  class="input"
                  type="text"
                  v-model="form.subcategory"
                  placeholder="ชื่อหมวดหมู่รอง"
                >
              </p>
              <p class="control">
                <button
                  :disabled="!form.subcategory"
                  class="btn success group"
                  @click="addSubcategory"
                >เพิ่ม</button>
              </p>
            </div>
            <div class="subcategories-form" v-show="form.subcategories.length">
              <div
                class="tags has-addons are-medium"
                v-for="(item, index) in form.subcategories"
                style="margin-bottom:5px"
              >
                <span class="tag is-primary">{{ item.name }}</span>
                <a class="tag fas fa-times" @click.prevent="removeSub(index)"></a>
              </div>
              <div class="action-wrapper form-submit right">
                <button
                  class="btn primary action full-width-mobile"
                  type="button"
                  @click="confirmSubcategory"
                >ต่อไป</button>
              </div>
            </div>
          </div>

          <!-- TYPES FORM -->
          <div
            class="field"
            v-show="confirmed.category.subcategories.length && !formFilled && steps == 3"
          >
            <div class="types-form">
              <div style="padding-bottom:8px">
                <small>*หากไม่ต้องการเพิ่มให้คลิก สร้างหมวดหมู่ด้านล่างได้เลย</small>
                <br>
                <small>
                  *คลิก&nbsp;
                  <i class="fas fa-plus"></i>&nbsp;เพื่อเพิ่มหมวดหมู่ย่อย
                </small>
              </div>
              <div v-for="(item, index) in confirmed.category.subcategories">
                <div class="tags has-addons are-medium" style="margin-bottom:3px">
                  <span
                    class="tag"
                    :class="{'is-success' : typeForm == index, 'is-primary' : typeForm !== index}"
                  >{{ item.name }}</span>
                  <a
                    class="tag fas"
                    :class="{'fa-plus' : typeForm !== index, 'fa-caret-down' : typeForm == index}"
                    @click.prevent="toggleTypeForm(index)"
                  ></a>
                </div>
                <div class="field is-grouped" v-show="typeForm == index" style="margin-bottom:10px">
                  <p class="control is-expanded">
                    <input
                      class="input"
                      type="text"
                      v-model="form.type"
                      placeholder="ชื่อหมวดหมู่ย่อย"
                    >
                  </p>
                  <p class="control">
                    <button
                      :disabled="!form.type"
                      class="btn success group"
                      @click="addType(index)"
                    >เพิ่ม</button>
                  </p>
                </div>
                <div
                  class="tags has-addons are-medium are-light"
                  style="margin-bottom:3px"
                  v-for="(type, index) in confirmed.category.subcategories[index].types"
                >
                  <span class="tag">{{ type.name }}</span>
                  <a class="tag fas fa-times" @click.prevent="removeType(index)"></a>
                </div>
              </div>
              <div class="action-wrapper form-submit right">
                <button
                  class="btn primary action full-width-mobile"
                  type="button"
                  @click="confirmType"
                >ต่อไป</button>
              </div>
            </div>
          </div>
          <!-- CATEGORY OVERVIEW -->
          <div class v-show="confirmed.category.name">
            <h3 class="section-heading">หมวดหมู่ที่จะสร้าง</h3>
            <p v-show="steps == 4">*เมื่อเรียบร้อยแล้วคลิก สร้างหมวดหมู่</p>
            <div class="data-list">
              <p
                class="data-title"
              >{{ confirmed.category.name ? confirmed.category.name : 'ชื่อหมวดหมู่' }}</p>
              <div class="data-text">
                <div class v-for="subcategory in confirmed.category.subcategories">
                  <p>{{ subcategory.name }}</p>
                  <p
                    class="sub"
                    v-for="type in subcategory.types"
                    v-show="formFilled"
                  >{{ type.name }}</p>
                </div>
                <p v-show="!confirmed.category.subcategories.length">ไม่มีหมวดหมู่รอง</p>
              </div>
            </div>
            <div class="action-wrapper form-submit right has-margin">
              <button
                class="btn success action full-width-mobile"
                type="button"
                @click.prevent="addCategory()"
              >สร้างหมวดหมู่</button>
              <button
                class="btn error action full-width-mobile"
                type="button"
                @click.prevent="cancle"
              >ยกเลิก</button>
            </div>
          </div>
        </div>
      </section>
    </transition>
    <!-- CATEGORY -->
    <div class="collection-list column" v-if="categories.length">
      <div v-for="(category, index) in categories">
        <div class="collection-categories">
          <p class="category">{{ category.name }}</p>
          <div v-for="(subcategory, index) in category.subcategory">
            <p class="subcategory">{{ subcategory.name }}</p>
            <p class="type" v-for="(type, index) in subcategory.type">{{ type.name }}</p>
          </div>
        </div>
        <div class="collection-action-bar">
          <!-- <router-link :to="{ name: 'categoryEdit', params: { category: category.id }}" class="btn-icon primary fas fa-pen"></router-link> -->
          <button
            class="btn-flat primary fas fa-trash-alt"
            @click="removeCategory(category.id, index)"
          ></button>
        </div>
      </div>
    </div>
    <div class="column text-center" v-else>
      <h3 class="is-size-4">ไม่มีหมวดหมู่</h3>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      categories: [],
      typeForm: null,
      form: {
        category: null,
        subcategory: null,
        subcategories: [],
        type: null
      },
      confirmed: {
        category: {
          name: null,
          subcategories: []
        }
      },
      formFilled: false,
      steps: 1,
      formVisible: false
    };
  },
  methods: {
    getCategory() {
      this.$http.get("/categories").then(response => {
        this.categories = response.data;
      });
    },
    addCategory() {
      if (confirm("ยืนยันหมวดหมู่นี้?")) {
        const category = this.confirmed.category.name;
        const subcategories = this.confirmed.category.subcategories;
        this.$http
          .post("/categories", {
            category: category,
            subcategories: subcategories,
            formFilled: this.formFilled
          })
          .then(
            response => {
              this.categories.push(response.data);
              this.resetForm();
              this.formVisible = false;
              toastr.success("สร้างหมวดหมู่แล้ว");
            },
            () => {
              toastr.error("เกิดข้อผิดพลาด");
            }
          );
      }
    },
    removeCategory(id, index) {
      if (confirm("คุณแน่ใจหรือไม่ว่าจะลบหมวดหมู่นี้?")) {
        this.$http.delete("/categories/" + id).then(() => {
          this.categories.splice(index, 1);
          toastr.success("ลบหมวดหมู่แล้ว");
        });
      }
    },
    confirmCategory() {
      this.confirmed.category.name = this.form.category;
      this.form.category = null;
      this.steps++;
    },
    addSubcategory() {
      this.form.subcategories.push({
        name: this.form.subcategory,
        types: []
      });
      this.form.subcategory = null;
    },
    confirmSubcategory() {
      if (confirm("คุณจะไม่สามารถแก้ไขหมวดหมู่รองได้อีก คุณแน่ใจหรือไม่?")) {
        this.confirmed.category.subcategories = this.form.subcategories;
        this.form.subcategories = [];
        this.steps++;
      }
    },
    removeSub(index) {
      this.form.subcategories.splice(index, 1);
    },
    toggleTypeForm(index) {
      if (this.typeForm == index) {
        this.typeForm = null;
      } else {
        this.typeForm = index;
      }
    },
    addType(index) {
      this.confirmed.category.subcategories[index].types.push({
        name: this.form.type
      });
      this.form.type = null;
    },
    removeType(index) {
      this.confirmed.category.subcategories[this.typeForm].types.splice(
        index,
        1
      );
      toastr.success("ลบหมวดหมู่ย่อยแล้ว");
    },
    confirmType() {
      if (confirm("คุณจะไม่สามารถแก้ไขหมวดหมู่ได้อีก คุณแน่ใจหรือไม่?")) {
        this.formFilled = true;
        this.steps++;
      }
    },
    cancle() {
      if (confirm("ยกเลิกการเพิ่มหมวดหมู่?")) {
        this.resetForm();
        toastr.success("ยกเลิกการสร้างหมวดหมู่แล้ว");
      }
    },
    resetForm() {
      this.confirmed.category = {
        name: null,
        subcategories: []
      };
      this.form = {
        category: null,
        subcategory: null,
        subcategories: [],
        type: null
      };
      this.formFilled = false;
    }
  },
  created() {
    this.getCategory();
  }
};
</script>
