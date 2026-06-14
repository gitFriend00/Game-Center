<template>
  <div class="bg-primary">
    <v-container class="fill-height d-flex align-center justify-center">
      <center>
        <v-card color="compliment" style="border: 1px solid black" width="450px" height="520px">

          <transition name="flip" mode="out-in">

            <div v-if="!isRegister" key="login">
              <v-img class="mt-8" height="180" src="management.png"></v-img>
              <br />
              <br />
              <v-card-text>
                <v-text-field v-model="loginObj.UserCode" variant="outlined" density="compact"
                  prepend-inner-icon="mdi-account" label="Username" />
                <v-text-field v-model="loginObj.Password" variant="outlined" density="compact" label="Password"
                  prepend-inner-icon="mdi-lock" :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPassword ? 'text' : 'password'" @click:append-inner="showPassword = !showPassword" hide-details/>
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

              <v-img v-if="EmployeeObj.EmployeeCode" class="mt-16" height="180" width="180px"
                style="border:1px solid black; border-radius: 100%;" cover
                :src="`http://hrd-adminweb/photos/${this.EmployeeObj.EmployeeCode}.jpg`">
              </v-img>
              <v-img v-else class="mt-10" height="180" src="management.png"></v-img>

              <br />
              <v-card-text>
                <v-text-field @keyup.enter="loadEmployeeData()" v-model="EmployeeCode" prepend-inner-icon="mdi-card-account-details" variant="outlined"
                  density="compact" label="EmployeeCode" type="number" hide-spin-buttons />
                <v-text-field readonly prepend-inner-icon="mdi-account" v-model="EmployeeObj.EmployeeName" variant="outlined" density="compact"
                  label="EmployeeName" />
                  <v-text-field variant="outlined" density="compact" label="Password"
                  prepend-inner-icon="mdi-lock" :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPassword ? 'text' : 'password'" @click:append-inner="showPassword = !showPassword" hide-details/>
              </v-card-text>
              <v-card-actions class="pl-4 pr-4">
                <v-row>
                  <v-col cols="6"> <v-btn block variant="elevated" color="warning"
                      @click="isRegister = false, EmployeeObj = {}, EmployeeCode = ''">Back</v-btn></v-col>
                  <v-col cols="6"> <v-btn block variant="elevated" color="success" @click="signupEmployee()">Sign
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
      EmployeeCode: '',
      EmployeeObj: {},
      storedData: useMainStore(),
      loginObj: {},
    }
  },
  methods: {
    async login() {
      // let checkExisting = this.storedData.$state.employees.filter((item) => {
      //   return item.EmployeeCode === this.loginObj.UserCode && item.EmployeeCode === this.loginObj.Password
      // })
        console.log('Username:'+ this.loginObj.UserCode, 'Password:'+ this.loginObj.Password)
      let checkExisting = await api.get(`Employees/getSpecificEmployee/${this.loginObj.UserCode}/${this.loginObj.Password}`)

      if (checkExisting.data.length > 0) {
        this.storedData.$state.userInformation = checkExisting.data[0]
        setTimeout(() => {
          this.$router.push('/employees')
        }, 800);

      } else {
        Swal.fire({
          toast: true,
          icon: "error",
          title: "Invalid Details.",
          showConfirmButton: false,
          timer: 500
        });

        this.EmployeeObj = {}
        this.EmployeeCode = ''
      }
    },

    async loadEmployeeData() {
      if (!this.EmployeeCode) return

      let result = await axios.get(`http://hrdapps79:9999/sharedAPI/getEmployeeCode/${this.EmployeeCode}`)
      if (result.data) {
        this.EmployeeObj = result.data[0]
      }
    },

    async signupEmployee() {
      if (!this.EmployeeObj.EmployeeName) {
        Swal.fire({
          position: "center",
          toast: true,
          icon: "error",
          title: "Please input valid details.",
          showConfirmButton: false,
          timer: 500
        });

      } else {
        Swal.fire({
          title: "Are you sure?",
          text: "You want to sign up?",
          icon: "info",
          toast: true,
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, confirm!"
        }).then((result) => {
          if (result.isConfirmed) {
            let checkExisting = this.storedData.$state.employees.filter((item) => {
              return item.EmployeeCode === this.EmployeeCode
            })

            if (checkExisting.length > 0) {
              Swal.fire({
                toast: true,
                icon: "error",
                title: "Already Exist",
                showConfirmButton: false,
                timer: 500
              });
              this.EmployeeObj = {}
              this.EmployeeCode = ''
            } else {
              this.storedData.$state.employees.push(this.EmployeeObj)

              Swal.fire({
                toast: true,
                icon: "success",
                title: "signed up successfully",
                showConfirmButton: false,
                timer: 500
              });

              this.isRegister = false
              this.EmployeeObj = {}
              this.EmployeeCode = ''
            }
          }
        });
      }
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