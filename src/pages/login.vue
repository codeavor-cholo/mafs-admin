<template>
<q-layout View: lHh Lpr fFf>
<q-page-container>
    <q-page style="background-image: url('statics/bg/bg.jpg'); background-color: #cccccc; height: 500px; background-position: center; background-repeat: no-repeat; background-size: cover; position: relative;">
    <div>
    <q-card class="my-card fixed-center" style="position:absolute; top:50%; left:50%; transform: translate(-50%, -50%); width:400px; height:440px; padding:80px 40px; box-sizing: border-box; background:rgba(0,0,0,0.5) ;">
        <div>
          <q-img src="statics/bg/2.jpg" style="width:100px; height:100px;  overflow:hidden; position:absolute; top:calc(-100px/2); left:calc(50% - 50px); border-radius:50%;" :ratio="1" basic spinner-color="white"></q-img>
        </div>
        <div style="margin:0; padding:0 0 20px; color:#1E90FF; text-align:center;" class="text-h6">LOGIN HERE</div>
      <q-card-section>
        <q-input outlined style="width:100%; margin-bottom: 20px; border: none; border-bottom: 1px solid #fff; background: white; outline:none; height:50px; color:#fff; font-size: 16px;" v-model="email" type="email" prefix="Email:">
        <template v-slot:append>
          <q-avatar>
            <q-icon name="mail" />
          </q-avatar>
        </template>
      </q-input>
      <q-input outlined style="width:100%; margin-bottom: 20px; border: none; border-bottom: 1px solid #fff; background: white; outline:none; height:50px; color:#fff; font-size: 16px;" class="q-mt-md" prefix="Password:" v-model="password" :type="isPwd ? 'password' : 'text'">
        <template v-slot:append>
          <q-avatar>
            <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
          </q-avatar>
        </template>
      </q-input>
      </q-card-section>
      <q-card-actions>
        <q-btn style="border:none; outline:none; height: 40px; color:#fff; font-size:16px; background: rgb(255,38,126); cursor:pointer; border-radius:20px;" label="Login"  class="full-width" @click="login2" />
        <q-btn style="border:none; outline:none; height: 40px; color:#fff; font-size:16px; background: rgb(255,38,126); cursor:pointer; border-radius:20px;" rounded color="primary" class="full-width q-mt-md" label="Register" @click="showRegisterDialog" />
      </q-card-actions>
    </q-card>

    <q-dialog v-model="registerDialog">
    <register data=""></register>   
    </q-dialog>
</div>
</q-page>
</q-page-container>    
</q-layout>    
</template>

<script>
import Register from '../pages/signup.vue'

export default {
    components: {
      Register
    },
    data () {
        return {
            Accounts: [],
            email: 'rap@rap.com',
            password: '123456',
            isPwd: true,
            registerDialog: false,
            isLoading: false
        }
    },
    mounted() {
        this.$binding('Accounts', this.$firestoreApp.collection('Accounts'))
            .then(Accounts => {
            console.log(Accounts, 'Accounts')
        })
    },
    
  created(){
          let self = this
          this.$firebase.auth().onAuthStateChanged(function(user) {
              
              if (user) {
                console.log('createdUser',user)
                  self.$router.push('/home')
              } else {
                  // No user is signed in.
                  self.$router.push('/')
              }
          })
      },
    methods: {
        login2(){
          let self = this
          this.$firebase.auth().signInWithEmailAndPassword(this.email, this.password)
            .then(result => {
             console.log(result, 'result')
             self.$firebase.auth().setPersistence(this.$firebase.auth.Auth.Persistence.LOCAL)
                .then(function() {
                  console.log('setPersistence!')
                  // Existing and future Auth states are now persisted in the current
                  // session only. Closing the window would clear any existing state even
                  // if a user forgets to sign out.
                  // ...
                  // New sign-in will be persisted with session persistence.
                  return self.$firebase.auth().signInWithEmailAndPassword(email, password);
                })
                .catch(function(error) {
                  // Handle Errors here.
                  
                  var errorCode = error.code;
                  var errorMessage = error.message;
                  console.log(errorMessage)
                });
              self.$router.push('/home')
            })
            .catch(err =>{
              console.log(err, 'error')
              self.$router.push('/')
              //this.isLoading = false
            })

        },
        login () {
            this.$q.loading.show({
                message: 'Some important <b>process</b> is in progress.<br/><span class="text-primary">Hang on...</span>'
              })
            console.log(this.$firebase, 'firebaseApp')
            this.$firebase.auth().signInWithEmailAndPassword(this.email, this.password)
            .then(result => {
             console.log(result, 'result')
            //  this.isLoading = false
             let optionss = this.$lodash.filter(this.Accounts, m => {
                            return m.accountEmailAdd == this.email    
              })
              console.log(optionss[0],'optionss')
             // code for checkinh of activated
              // if (result.user.emailVerified === true){
              if (optionss[0].activated === true){
                this.$router.push('/')
              }
              else {
                this.$q.notify('Accounts not yet Activated')
                console.log('email is not verified')
              }
            })
            .catch(err =>{
              console.log(err, 'error')
              this.$q.notify({
                    message: `Incorrect Email and Password`,
                    type: 'negative',
                    color: 'negative',
                    textColor: 'white',
                    icon: 'warning'
              })
            }) 
              // hiding in 3s
              this.timer = setTimeout(() => {
              this.$q.loading.hide()
              this.timer = void 0
              }, 2000)
        },
        showRegisterDialog (){
          this.registerDialog = true
        }
    }

}
</script>