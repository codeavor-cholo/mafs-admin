<template>
    <q-card class="my-card text-blackte" style="min-width: 430px; min-height: 600px">
      <q-card-section>  
          <div  class="text-subtitle2">SIGN UP</div>
      </q-card-section>
      <q-card-section>
        <q-input class="q-ma-sm" outlined rounded color="positive" full-width v-model="accountFirstName" label="Firt Name"/>
        <q-input class="q-ma-sm" outlined rounded color="positive" full-width v-model="accountLastName" label="Last Name"/>
        <q-select class="q-ma-sm" outlined rounded color="positive"  full-width  autofocus v-model="accountPosition" :options="positionOptions" emit-value map-options label="Position"/>
        <q-input outlined rounded color="positive" full-width v-model="email" type="email" prefix="Email:" suffix="@gmail.com">
            <template v-slot:prepend>
                <q-icon name="mail" />
            </template>
        </q-input>
        <q-input full-width class="q-mt-md" rounded outlined prefix="Password:" v-model="password" :type="isPwd ? 'password' : 'text'">
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
        <q-input class="q-mt-md" rounded outlined prefix="Confirm Password:" v-model="confirmpassword" full-width :type="isPwd ? 'password' : 'text'">
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
        <q-btn outline rounded color="positive" class="full-width q-mt-md" label="Register" @click="register" />
      </q-card-actions>
    </q-card>
</template>

<script>
    var actionCodeSettings = {
        url: 'localhost:8080/#/',
        handleCodeInApp: true
    }
export default {
    data () {
        return {
            data:'',
            email: '',
            Position: [],
            password: '',
            confirmpassword: '',
            accountFirstName: '',
            accountLastName: '',
            accountPosition: '',
            isPwd: false,
            actionCodeSettings: actionCodeSettings
        }
    },
    mounted() {
        this.$binding('Position', this.$firestoreApp.collection('Position'))
            .then(Position => {
            console.log(Position, 'Position')
        })
    },
    computed: {
        positionOptions(){
                let optionss = this.Position.map(Position => {
                    return {
                        label: Position.position,
                        value: Position.position
                    }
                })

                return optionss
            }
    },
    methods: {
        register () {
            if (this.password === this.confirmpassword){
                this.$firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
                .then(result => {
                    console.log(result, 'result')
                    let user = this.$firebase.auth().currentUser
                    console.log(user, 'users')
                    user.sendEmailVerification()
                    .then(() => {
                      console.log('email verification send')
                    })
                    .catch(err => {
                      console.log(err, 'email verify not send')
                    })
                })
                .catch(err => {
                    console.log(err, 'error')
                })

            }else{
                this.$q.notify('incorrect Pass and Email')
            }
        }
    }

}
</script>