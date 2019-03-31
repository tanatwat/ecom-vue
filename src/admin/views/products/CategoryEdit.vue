<template>
  <div class="columns is-multiline">
    <div class="column is-full">
      <div class="section-wrapper">
        {{ category.name }}
      </div>
    </div>
    <div class="column is-full">
      <div class="section-wrapper">
        <div class="action-wrapper between v-center">
          <h2 class="section-heading">หมวดหมู่รอง & ย่อย</h2>
          <button class="btn success group" name="button">บันทึก</button>
        </div>
      </div>
    </div>
    <div class="column is-half" v-for="(subcategory, index) in category.subcategory">
      <div class="data-wrapper">
        <ul class="nested-list">
          {{ subcategory.name }}
          <li v-for="type in subcategory.type">{{ type.name}}</li>
          <li v-show="!subcategory.type.length">ไม่มีหมวดหมู่ย่อย</li>
        </ul>
        <div class="action-wrapper right action">
          <button class="btn-icon primary fas" :class="{'fa-plus' : formVisible != index, 'fa-times' : formVisible == index}" @click="toggleForm(index)"></button>
          <button class="btn-icon primary fas fa-pen"></button>
        </div>
        <div class="data-list" v-show="formVisible == index">
          <div class="data-text">
            <div class="input-group" style="padding:10px 0">
              <input type="text" v-model="type" placeholder="ชื่อหมวดหมู่ย่อย">
              <button :disabled="!type" class="btn success group" @click="addType(index)">เพิ่ม</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      category: null,
      type: null,
      formVisible: null
    }
  },
  methods: {
    getCategory() {
      this.$root.loading = true
      this.$http.get('/category/' + this.$route.params.category).then(response => {
        this.category = response.data
        this.$root.loading = false
      })
    },
    toggleForm(index) {
      this.type = null
      if (this.formVisible == index) {
        this.formVisible = null
      } else {
        this.formVisible = index
      }
    },
    addType(index) {
      this.category.subcategory[index].type.push({name: this.type})
      this.type = null
    },
    saveChanges() {
      this.$http.put('/category/' + this.$route.params.category).then(response => {

      })
    }
  },
  created() {
    this.getCategory()
  }
}
</script>
