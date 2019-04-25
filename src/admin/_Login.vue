<template>
  <div class="background">
    <div class="container login-window">
      <div style="text-align:center; padding:10px">
        <img src="../assets/Ecom.svg" alt="" style="max-width:60%">
      </div>
      <form class="" method="post" @submit.prevent="login">
        <form-input label="Email" name="email" type="email" validate="required|email" validate-as="ข้อมูล"
          v-model="email" placeholder="example@gmail.com"></form-input>
        <form-input label="รหัสผ่าน" name="password" type="password" validate="required" validate-as="รหัสผ่าน"
          v-model="password"></form-input>
        <div class="action-wrapper right form-submit">
          <button type="submit" class="button is-success form-submit is-pulled-right full-width" :class="{'is-loading' : loading}">ลงชื่อเข้าใช้</button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      email: 'test@gmail.com',
      password: '159352',
      loading: false
    }
  },
  methods: {
    login() {
      this.loading = true
      this.$http.post('/login_client', {
        email: this.email,
        password: this.password
      }).then(response => {
        localStorage.token = response.data.token
        localStorage.role = 'admin'
        this.check()
        this.$router.go()
        this.loading = false
      }, () => {
        this.loading = false
        toastr.error('ไม่สามารถล็อกอินได้')
      })
    },
    check() {
      this.$http.post('/check_client', {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.token}`
        }
      }).then(response => {
        localStorage.client = response.data.id
      })
    }
  }
}
</script>

<style media="screen" lang="sass">
  .login-window
    max-width: 500px !important
    margin: 0 auto !important
    padding: 10px !important
    border-radius: 5px
    border: 1px solid #eee
    background: #fff
  .background
    padding: 5rem 0
    min-height: 100vh
    background: linear-gradient(180deg, rgba(156,186,255,1) 0%, rgba(255,202,244,1) 100%)
</style>
