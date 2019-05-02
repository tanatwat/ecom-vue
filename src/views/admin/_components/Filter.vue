<template>
  <div>
    <div class="action-wrapper between">
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
          :class="{'active' : $parent.view == 'row'}"
          @click="$emit('changeView', 'row')"
        ></button>
        <button
          v-show="canToggleView"
          class="btn-icon fas fa-th-large"
          :class="{'active' : $parent.view == 'grid'}"
          @click="$emit('changeView', 'grid')"
        ></button>
      </div>
    </div>
    <transition name="fade">
      <div v-show="formVisible" class="box columns is-multiline filter is-marginless" style="margin-top:15px !important">
        <div class="column is-6">
          <div class="form-group">
            <label class="is-size-5">ชื่อสินค้า</label>
            <input class="full-width" type="text" v-model="query.name">
          </div>
        </div>

        <div class="column is-6">
          <div class="form-group">
            <label class="is-size-5">เรียงตาม</label>
            <select class="select-input full-width" v-model="query.order">
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
                :class="{'active': category.id == query.c }"
              >{{ category.name }}</li>
            </div>
            <div class="category" v-show="query.c && subcategories.length">
              <li
                :key="subcategory.id"
                v-for="subcategory in subcategories"
                @click.prevent="selectSubcategory(subcategory)"
                :class="{'active': subcategory.id == query.sub }"
              >{{ subcategory.name }}</li>
            </div>
            <div class="category" v-show="query.sub && types.length">
              <li
                :key="type.id"
                v-for="type in types"
                @click.prevent="selectType(type)"
                :class="{'active': type.id == query.type }"
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
                  v-model="query.min"
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
                  v-model="query.max"
                  autocomplete="off"
                  placeholder="สูงสุด"
                >
              </div>
            </div>
          </div>
          <div v-show="includeDiscount">
            <label class="is-size-5 checkbox" :class="{'active' : query.dc}">
              เฉพาะสินค้าลดราคา&nbsp;
              <input
                class
                type="checkbox"
                name="discount"
                @click.prevent="toggleDiscount"
              >
            </label>
          </div>
        </div>

        <transition name="fade">
          <div class="breadcrumb column is-12" v-show="activated">
            <p class="is-size-5">คุณกำลังค้นหา</p>
            <span v-show="query.name">
              <strong>ชื่อสินค้า</strong>
              &nbsp;{{ query.name }}
            </span>
            <div v-show="query.c">
              <strong>หมวดหมู่&nbsp;</strong>
              <span>{{ breadcrumb.category }}</span>
              <span>{{ breadcrumb.subcategory }}</span>
              <span>{{ breadcrumb.type }}</span>
            </div>
            <span v-show="query.order">{{ query.order == 'min' ? 'ราคาต่ำสุดก่อน' : 'ราคาสูงสุดก่อน' }}</span>
            <span v-show="query.min">ราคาต่ำสุด&nbsp;{{ $number.format(query.min) }}&nbsp;</span>
            <span v-show="query.max">ราคาสูงสุด&nbsp;{{ $number.format(query.max) }}</span>
            <span class="font-green" v-show="query.dc">สินค้าลดราคาเท่านั้น</span>
          </div>
        </transition>
        <div class="action-wrapper column has-margin is-flex right">
          <button type="button" class="btn primary" @click.prevent="clearFilter()">ล้างการค้นหา</button>
          <button type="button" class="btn success" @click.prevent="search(1)" style="margin-right:0">ค้นหา</button>
        </div>
      </div>
    </transition>

    <p style="margin-top:20px">สินค้า&nbsp;{{ $parent.meta.total_items }}&nbsp;รายการ&nbsp;ทั้งหมด&nbsp;{{ $parent.meta.last_page }}&nbsp;หน้า</p>

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
      formVisible: false,
      breadcrumb: {},
      query: {
        name: null,
        order: null,
        c: null,
        sub: null,
        type: null,
        max: null,
        min: null,
        dc: this.includeDiscount ? null : false,
        except: this.parentData.component == 'showcase' ? JSON.stringify(this.parentData.query) : null,
        page: 1
      },
      view: this.$parent.view
    };
  },
  watch: {
    "$parent.meta.current_page": {
      handler() {
        this.query.page = this.$parent.meta.current_page
        this.search(2)
      }
    }
  },
  props: {
    canToggleView: {
      type: Boolean,
      default: true
    },
    includeDiscount: {
      type: Boolean,
      default: true
    },
    parentData: {
      type: Object,
      default:() => {
        return {
          component: null,
          query: null
        }
      }
    },
    url: {
      default: '/get/products'
    }
  },
  computed: {
    activated() {
      if (
        this.query.c ||
        this.query.min ||
        this.query.max ||
        this.query.dc ||
        this.query.name ||
        this.query.order
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
    search(type) {
      this.products = [];
      if(type == 1) {
        this.query.page = 1
      }
      this.$http
        .get(this.url, {
          params: this.query
        })
        .then(
          response => {
            let products = response.data.data;
            let meta = {
              last_page: response.data.lastPage,
              current_page: response.data.page,
              total_items: response.data.total,
              page_items: response.data.perPage
            };
            this.$emit("search", {products, meta});
          },
          () => {
            toastr.error("เกิดข้อผิดพลาด");
          }
        );
    },
    clearFilter() {
      var cleared = _.mapValues(this.query, () => null)
      this.query = cleared
      this.query.page = 1;
    },
    selectCategory(category) {
      this.subcategories = category.subcategory;
      this.breadcrumb = Object.assign({}, this.breadcrumb, {
        category: category.name,
        subcategory: null,
        type: null
      });
      this.query = Object.assign({}, this.query, {
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
      this.query = Object.assign({}, this.query, {
        sub: subcategory.id,
        type: null
      });
    },
    selectType(type) {
      this.breadcrumb = Object.assign({}, this.breadcrumb, {
        type: type.name
      });
      this.query = Object.assign({}, this.query, {
        type: type.id
      });
    },
    toggleDiscount() {
      if(this.query.dc) {
        this.query.dc = null
      } else {
        this.query.dc = true
      }
    }
  },
  created() {
    this.getCategory();
    this.search(1)
  }
};
</script>
