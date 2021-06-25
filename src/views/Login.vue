<template>
<div class="container-scroller">
    <div class="container-fluid page-body-wrapper full-page-wrapper">
      <div class="main-panel">
        <div class="content-wrapper d-flex align-items-center auth">
          <div class="row w-100">
            <div class="col-lg-4 mx-auto">
              <div class="auth-form-light text-left p-5">
                <div class="navbar-brand brand-logo">
                  <img src="assets/img/logo.svg">
                </div>
                <h4>Selamat datang!</h4>
                <h6 class="font-weight-light">Login sebelum membuat pengaduan!</h6>
                <form v-on:submit.prevent="Login" class="pt-3" method="post" action="#">
                <div class="form-group">
                  <div class="input-group">
                    <div class="input-group-prepend bg-transparent">
                      <span class="input-group-text bg-transparent border-right-0">
                        <i class="mdi mdi-account-check text-primary"></i>
                      </span>
                    </div>
                    <input type="text" class="form-control form-control-lg border-left-0" id="input_username" v-model="username" name="username" placeholder="USERNAME" required>
                  </div>
                </div>
                <div class="form-group">
                  <div class="input-group">
                    <div class="input-group-prepend bg-transparent">
                      <span class="input-group-text bg-transparent border-right-0">
                        <i class="mdi mdi-key-variant text-primary"></i>
                      </span>
                    </div>
                    <input type="password" class="form-control form-control-lg border-left-0" name="password" id="input_password" v-model="password" placeholder="PASSWORD" required>                        
                  </div>
                </div>
                <div class="my-3">
                  <input type="submit" name="submit" class="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn" value="MASUK">
                </div>
              </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- content-wrapper ends -->
    </div>
    <!-- page-body-wrapper ends -->
  </div>
    
</template>
<script>
export default {
    data() {
      return {
        username: '',
        password: ''
      }
    },
    methods: {
        Login: function(){
            let username = this.username 
            let password = this.password
            this.$store.dispatch('login', { username, password })
            .then(() => this.$router.push('/Pengaduan'))
            .catch(err => console.log(err))
        }
    }
}
</script>