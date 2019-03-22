<template>
  <div class="columns is-multiline">
    <div class="column is-full">
      <div class="tab">
        <button :class="{'active' : tab == 1}" @click="tab = 1">หมวดหมู่</button>
        <button :class="{'active' : tab == 2}" @click="tab = 2">แบรนด์</button>
      </div>
    </div>
    <!-- CATEGORY -->
    <section class="column is-half">
      <div class="section-wrapper">
        <h3 class="section-heading">หมวดหมู่สินค้าของร้าน</h3>
        <div class="data-list" v-for="(category, index) in categories">
          <p class="data-title">{{ category.name }}</p>
          <div class="data-text" v-for="(subcategory, index) in category.subcategory">
            <p>{{ subcategory.name }}</p>
            <p class="sub" v-for="(type, index) in subcategory.type">{{ type.name }}</p>
          </div>
          <div class="action-wrapper right action has-margin">
            <router-link :to="{ name: 'categoryEdit', params: { category: category.id }}" class="btn-icon primary fas fa-pen"></router-link>
            <button class="btn-icon error fas fa-trash-alt" @click="removeCategory(category.id, index)"></button>
          </div>
        </div>
      </div>
    </section>
    <!-- ADD CATEGORY -->
    <section class="column is-half">
      <div class="section-wrapper">
        <h3 class="section-heading">เพิ่มหมวดหมู่</h3>
        <form @submit.prevent="addCategory" method="post">
          <div class="form-group">
            <label>ชื่อหมวดหมู่</label>
            <input required type="text" v-model="category" placeholder="เช่น รองเท้า">
            <label>หมวดหมู่รอง<small class="optional">(ไม่มีก็ได้)</small></label>
            <div class="input-group">
              <input type="text" v-model="form.subcategory" placeholder="เช่น รองเท้าแตะ">
              <button :disabled="!form.subcategory" type="button" class="btn success group right-column" @click="addSubcategory">เพิ่ม</button>
            </div>
          </div>
          <!-- CATEGORY OVERVIEW -->
          <h3>ตัวอย่าง</h3>
          <div class="data-list">
            <p class="data-title">{{ category ? category : 'ชื่อหมวดหมู่' }}</p>
            <div class="data-text">
              <p v-for="(item, index) in subcategories">
                <a @click.prevent="removeSub(index)" class="btn-flat error fas fa-times"></a>
                &nbsp;{{ item.name }}
              </p>
              <p v-show="!subcategories.length">ไม่มีหมวดหมู่รอง</p>
            </div>
          </div>
          <div class="action-wrapper form-submit right">
            <button class="btn success action full-width-mobile" type="submit">เพิ่มหมวดหมู่</button>
          </div>
        </form>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tab: 1,
      categories: [],
      category: null,
      subcategories: [],
      form: {
        subcategory: null,
      }
    }
  },
  methods: {
    getCategory() {
      axios.get('/categories').then(response => {
        this.categories = response.data
      })
    },
    addCategory() {
      this.$root.loading = true
      axios.post('/categories', {
        category: this.category,
        subcategories: this.subcategories
      }).then(response => {
        this.categories.push(response.data)
        this.category = null
        this.subcategories = []
        this.$root.loading = false
      }, () => {
        this.$root.loading = false
      })
    },
    removeCategory(id, index) {
      if (confirm('คุณแน่ใจหรือไม่ว่าจะลบหมวดหมู่นี้?')) {
        this.$root.loading = true
        axios.delete('/categories/' + id).then(() => {
          this.categories.splice(index, 1)
          this.$root.loading = false
        }, () => {
          this.$root.loading = false
        })
      }
    },
    addSubcategory() {
      this.subcategories.push({name: this.form.subcategory})
      this.form.subcategory = null
    },
    removeSub(index) {
      this.subcategories.splice(index, 1)
    }
  },
  created() {
    this.getCategory()
  }
}
</script>
