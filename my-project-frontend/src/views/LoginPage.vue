<template>
  <div class="bg-primary">
    <v-container class="fill-height d-flex align-center justify-center">
      <center>
        <v-card color="compliment" style="border: 1px solid black" width="370px" height="420px">

          <transition name="flip" mode="out-in">

            <div v-if="!isRegister" key="login">
              <v-img class="mt-8" height="180" src="logo.png"></v-img>

              <v-card-text>
                <v-text-field v-model="loginObj.UserName" variant="outlined" density="compact"
                  prepend-inner-icon="mdi-account" label="Username" />
                <v-text-field v-model="loginObj.Password" variant="outlined" density="compact" label="Password"
                  prepend-inner-icon="mdi-lock" :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPassword ? 'text' : 'password'" @click:append-inner="showPassword = !showPassword"
                  hide-details />
              </v-card-text>
              <v-card-actions class="pl-4 pr-4">
                <v-row>
                  <v-col cols="6">
                    <v-btn @click="isRegister = true" variant="elevated" block color="warning"
                      prepend-icon="mdi-account-plus">REGISTER
                    </v-btn>
                  </v-col>
                  <v-col cols="6">
                    <v-btn @click="login()" variant="elevated" block color="success" prepend-icon="mdi-login">LOGIN
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-actions>
            </div>

            <div v-else>

              <v-img class="mt-8" height="120" src="logo.png"></v-img>

              <v-card-text>
                <v-autocomplete v-model="UserObj.Role" :items="role" variant="outlined" density="compact" label="Role"
                  clearable />
                <v-text-field prepend-inner-icon="mdi-account" v-model="UserObj.UserName" variant="outlined"
                  density="compact" label="UserName" />
                <v-text-field v-model="UserObj.Password" variant="outlined" density="compact" label="Password"
                  prepend-inner-icon="mdi-lock" :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPassword ? 'text' : 'password'" @click:append-inner="showPassword = !showPassword"
                  hide-details />
              </v-card-text>
              <v-card-actions class="pl-4 pr-4">
                <v-row>
                  <v-col cols="6"> <v-btn block variant="elevated" color="warning"
                      @click="isRegister = false; UserObj = {}">Back</v-btn></v-col>
                  <v-col cols="6"> <v-btn block variant="elevated" color="success" @click="signupUser()">Sign
                      Up</v-btn></v-col>
                </v-row>
              </v-card-actions>
            </div>

          </transition>

        </v-card>
      </center>
    </v-container>

  </div>
</template>

<script>
import Swal from 'sweetalert2'
import api from '../services/api'
import { useMainStore } from '../stores';
export default {
  data() {
    return {
      showPassword: false,
      isRegister: false,
      UserObj: {},
      storedData: useMainStore(),
      loginObj: {},
      role: ['Customer', 'Admin'],
    }
  },
  methods: {
    async login() {

      console.log('Username:' + this.loginObj.UserName, 'Password:' + this.loginObj.Password)
      let checkExisting = await api.get(`User/getSpecificUser/${this.loginObj.UserName}/${this.loginObj.Password}`)

      if (checkExisting.data.length > 0) {
        this.storedData.$state.userInformation = checkExisting.data[0]
        setTimeout(() => {
          this.$router.push('/gamecenter')
        }, 800);

      } else {
        Swal.fire({
          toast: true,
          icon: "error",
          title: "Invalid Details.",
          showConfirmButton: false,
          timer: 500
        });

        this.UserObj = {}
        this.UserCode = ''
      }
    },


    async signupUser() {
      if (!this.UserObj.UserName || !this.UserObj.Password || !this.UserObj.Role) {
        Swal.fire({
          position: "center",
          toast: true,
          icon: "error",
          title: "Please input valid details.",
          showConfirmButton: false,
          timer: 500
        });

        return
      }

      Swal.fire({
        title: "Are you sure?",
        text: "You want to sign up?",
        icon: "info",
        toast: true,
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, confirm!"
      }).then(async (result) => {
        if (!result.isConfirmed) return

        const users = Array.isArray(this.storedData.$state.user) ? this.storedData.$state.user : []
        const checkExisting = users.filter((item) => item.UserName === this.UserObj.UserName)

        if (checkExisting.length > 0) {
          Swal.fire({
            toast: true,
            icon: "error",
            title: "Already Exist",
            showConfirmButton: false,
            timer: 500
          });
          this.UserObj = {}
          return
        }

        try {
          await api.post('User/createUser', this.UserObj)

          if (Array.isArray(this.storedData.$state.user)) {
            this.storedData.$state.user.push({ ...this.UserObj })
          } else {
            this.storedData.$state.user = [{ ...this.UserObj }]
          }

          Swal.fire({
            toast: true,
            icon: "success",
            title: "signed up successfully",
            showConfirmButton: false,
            timer: 500
          });

          this.isRegister = false
          this.UserObj = {}
        } catch (error) {
          Swal.fire({
            toast: true,
            icon: "error",
            title: "Unable to sign up. Try again.",
            showConfirmButton: false,
            timer: 1000
          });
        }
      });
    },

  },
}
</script>

<style>
.flip-enter-active,
.flip-leave-active {
  transition: all 0.5s ease;
}

.flip-enter-from {
  opacity: 0;
  transform: rotateY(-90deg);
}

.flip-leave-to {
  opacity: 0;
  transform: rotateY(90deg);
}

.flip-enter-to,
.flip-leave-from {
  opacity: 1;
  transform: rotate(0deg);
}

.flip-enter-active,
.flip-leave-active {
  backface-visibility: hidden;
}
</style>