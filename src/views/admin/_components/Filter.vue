<template>
  <div>
    <div class="action-wrapper between" style="margin-bottom:15px">
      <div>
        <button class="btn primary" @click.prevent="formVisible = !formVisible">
          ตัวกรอง&nbsp;
          <i class="fas fa-filter"></i>
        </button>
      </div>
      <div class="action-wrapper has-margin">
        <button
          v-show="canToggleView"
          class="btn-icon fas fa-th-list"
          :class="{'active' : view == 'row'}"
          @click="$emit('changeView', 'row'), view = 'row'"
        ></button>
        <button
          v-show="canToggleView"
          class="btn-icon fas fa-th-large"
          :class="{'active' : view == 'grid'}"
          @click="$emit('changeView', 'grid'), view = 'grid'"
        ></button>
      </div>
    </div>
    <transition name="fade">
      <div v-show="formVisible" class="box columns is-multiline filter is-marginless">
        <div class="column is-6">
          <div class="form-group">
            <label class="is-size-5">ชื่อสินค้า</label>
            <input class="full-width" type="text" v-model="name">
          </div>
        </div>

        <div class="column is-6">
          <div class="form-group">
            <label class="is-size-5">เรียงตาม</label>
            <select class="select-input full-width" v-model="orderBy">
              <option value="min">ราคาต่ำสุดก่อน</option>
              <option value="max">ราคาสูงสุดก่อน</option>
            </select>
          </div>
        </div>

        <div class="column is-12">
          <label class="is-size-5">หมวดหมู่</label>
          <div class="categories">
            <div class="category">
              <li
                :key="category.id"
                v-for="category in categories"
                @click.prevent="selectCategory(category)"
                :class="{'active': category.id == selected.c }"
              >{{ category.name }}</li>
            </div>
            <div class="category" v-show="selected.c && subcategories.length">
              <li
                :key="subcategory.id"
                v-for="subcategory in subcategories"
                @click.prevent="selectSubcategory(subcategory)"
                :class="{'active': subcategory.id == selected.sub }"
              >{{ subcategory.name }}</li>
            </div>
            <div class="category" v-show="selected.sub && types.length">
              <li
                :key="type.id"
                v-for="type in types"
                @click.prevent="selectType(type)"
                :class="{'active': type.id == selected.type }"
              >{{ type.name }}</li>
            </div>
          </div>
        </div>

        <div class="column is-12">
          <div class="form-group">
            <label class="is-size-5">ราคา</label>
            <div class="columns">
              <div class="column is-3 is-12-mobile">
                <input
                  class
                  type="number"
                  min="0"
                  max="9999999"
                  v-model="min"
                  autocomplete="off"
                  placeholder="ต่ำสุด"
                >
              </div>
              <div class="column is-3 is-12-mobile">
                <input
                  class
                  type="number"
                  min="0"
                  max="9999999"
                  v-model="max"
                  autocomplete="off"
                  placeholder="สูงสุด"
                >
              </div>
            </div>
          </div>
          <div v-show="includeDiscount">
            <label class="is-size-5 checkbox" :class="{'active' : selected.discount}">
              เฉพาะสินค้าลดราคา&nbsp;
              <input class type="checkbox" name="discount" v-model="selected.discount">
            </label>
          </div>
        </div>

        <transition name="fade">
          <div class="breadcrumb column is-12" v-show="activated">
            <p class="is-size-5">คุณกำลังค้นหา</p>
            <span v-show="name">
              <strong>ชื่อสินค้า</strong>
              &nbsp;{{ name }}
            </span>
            <div v-show="selected.c">
              <strong>หมวดหมู่&nbsp;</strong>
              <span>{{ breadcrumb.category }}</span>
              <span>{{ breadcrumb.subcategory }}</span>
              <span>{{ breadcrumb.type }}</span>
            </div>
            <span v-show="orderBy">{{ orderBy == 'min' ? 'ราคาต่ำสุดก่อน' : 'ราคาสูงสุดก่อน' }}</span>
            <span v-show="min">ราคาต่ำสุด&nbsp;{{ $number.format(min) }}&nbsp;</span>
            <span v-show="max">ราคาสูงสุด&nbsp;{{ $number.format(max) }}</span>
            <span class="font-green" v-show="selected.discount">สินค้าลดราคาเท่านั้น</span>
          </div>
        </transition>
        <div class="action-wrapper column has-margin is-flex right">
          <button class="btn primary" @click.prevent="clearFilter()">ล้างการค้นหา</button>
          <button class="btn success" @click="applyFilter()" style="margin-right:0">ค้นหา</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      categories: [],
      subcategories: [],
      types: [],
      products: [],
      name: null,
      orderBy: null,
      min: null,
      max: null,
      formVisible: false,
      breadcrumb: {},
      selected: {
        discount: false
      },
      view: "grid"
    };
  },
  props: ["canToggleView", "includeDiscount"],
  computed: {
    activated() {
      if (
        this.selected.c ||
        this.min ||
        this.max ||
        this.selected.discount ||
        this.name ||
        this.orderBy
      ) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    getCategory() {
      this.$root.loading = true;
      this.$Progress.start();
      this.$http.get("/categories").then(response => {
        this.categories = response.data;
        this.$root.loading = false;
        this.$Progress.finish();
      });
    },
    applyFilter() {
      this.$emit("search", {
        category: this.selected.c,
        subcategory: this.selected.sub,
        type: this.selected.type,
        discount: this.selected.discount,
        min: this.min,
        max: this.max,
        name: this.name,
        order: this.orderBy
      });
    },
    clearFilter() {
      this.name = null;
      this.orderBy = null;
      this.min = null;
      this.max = null;
      this.selected.discount = false;
      this.selected.c = null;
      this.selected.sub = null;
    },
    selectCategory(category) {
      this.subcategories = category.subcategory;
      this.breadcrumb = Object.assign({}, this.breadcrumb, {
        category: category.name,
        subcategory: null,
        type: null
      });
      this.selected = Object.assign({}, this.selected, {
        c: category.id,
        sub: null,
        type: null
      });
    },
    selectSubcategory(subcategory) {
      this.types = subcategory.type;
      this.breadcrumb = Object.assign({}, this.breadcrumb, {
        subcategory: subcategory.name,
        type: null
      });
      this.selected = Object.assign({}, this.selected, {
        sub: subcategory.id,
        type: null
      });
    },
    selectType(type) {
      this.breadcrumb = Object.assign({}, this.breadcrumb, {
        type: type.name
      });
      this.selected = Object.assign({}, this.selected, {
        type: type.id
      });
    }
  },
  created() {
    this.getCategory();
  }
};
</script>
