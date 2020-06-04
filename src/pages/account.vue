<template>
    <q-page>
        <q-table title="" :data="getUsers" :columns="columns" :filter="filter" row-key="name">
            <template v-slot:body="props">
                <q-tr :props="props">
                    <q-td key="accountFirstName" :props="props">{{props.row.accountFirstName}}&nbsp;{{props.row.accountLastName}}</q-td>
                    <q-td key="accountEmailAdd" :props="props">{{props.row.accountEmailAdd}}</q-td>
                    <q-td key="activated" :props="props">
                         <q-toggle v-if="props.row.accountPosition != 'Admin'" @input="activate(props.row)" v-model="props.row.activated" color="green"/>
                    </q-td>
                    <q-td key="accountPosition" :props="props">{{props.row.accountPosition}}</q-td>
                    <q-td key="userAccess" :props="props">
                        <ul v-for="(value, key) in props.row.userAccess" :key="key" >
                            <li v-if="value">{{key}}</li>
                        </ul>
                    </q-td>
                    <q-td key="action" :props="props">
                        <q-btn v-if="props.row.accountPosition != 'admin'" icon="edit" size="sm" color="secondary" label="edit" @click="editUser(props.row)" />
                        <q-btn v-if="props.row.role != 'admin'" color='negative' size="sm" label="remove" icon="delete" @click="removeUser(props)"></q-btn>
                    </q-td>  
                </q-tr>
            </template>
            <template v-slot:top-right>
                <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
                    <template v-slot:append>
                        <q-icon name="search" />
                    </template>
                </q-input>
            </template>  
        </q-table>
        <!--FLOATING BUTTON-->
        <q-page-sticky position="top-left" :offset="[18, 18]">
            <q-btn fab icon="mdi-account-plus-outline" color="accent" @click="addAccountDialog = true, clear()" />
                <q-tooltip>
                    Create New Account
                </q-tooltip>
        </q-page-sticky>
        <!--Modal For add Food-->
        <q-dialog v-model="addAccountDialog" persistent>
            <q-card style="min-width: 600px">
                <q-card-section>
                    <div class="text-h6">New Account</div>
                </q-card-section>

                <q-card-section>
                    <div class="q-pa-md row" dense>
                        <q-input class="q-ma-sm" style="width: 240px" v-model="newUser.accountFirstName" label="Firt Name"/>
                        <q-input class="q-ma-sm" style="width: 240px" v-model="newUser.accountLastName" label="Last Name"/>
                    </div>
                    <div style="margin-top: -20px">
                    <q-select class="q-ma-sm" style="width: 530px" filled autofocus v-model="newUser.accountPosition" :options="positionOptions" emit-value map-options label="Position"/>
                    </div>
                    <div>
                        <q-input :disable="isEdit" v-model="newUser.accountEmailAdd" type="email" prefix="Email:" suffix="@gmail.com" style="width: 530px; margin-left: 10px">
                            <template v-slot:prepend>
                                <q-icon name="mail" />
                            </template>
                        </q-input>
                    </div>
                    <div>
                        <q-input class="q-mt-md" rounded outlined prefix="Password:" v-show="!isEdit" v-model="newUser.accountPassword" style="width: 545px" :type="isPwd ? 'password' : 'text'">
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
                    <q-input class="q-mt-md" rounded outlined prefix="Confirm Password:" v-show="!isEdit" v-model="newUser.accountConfirmPassword" style="width: 545px" :type="isPwd ? 'password' : 'text'">
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
                    </div>
                    <div class="q-pa-md">
                        <div class="q-gutter-sm">
                        <h6 style="margin-bottom: -10px">User Access</h6>
                                <q-checkbox v-model="newUser.userAccess.userWalkIn" label="Walk in Reservation" />
                                <q-checkbox v-model="newUser.userAccess.userDashboard" label="DashBoard" />
                                <q-checkbox v-model="newUser.userAccess.userReservation" label="Reservation" />
                                <q-checkbox v-model="newUser.userAccess.userCalendar" label="Calendar" />
                                <q-checkbox v-model="newUser.userAccess.userPackManage" label="Package Management" />
                                <q-checkbox v-model="newUser.userAccess.userIncManage" label="Inclusion Management" />
                                <q-checkbox v-model="newUser.userAccess.userOtherManage" label="Other Management" />
                                <q-checkbox v-model="newUser.userAccess.userAssignedReserve" label="Assigned Reservation" />
                                <q-checkbox v-model="newUser.userAccess.userPlaceTracker" label="Place Tracker" />
                                <q-checkbox v-model="newUser.userAccess.userAccountManage" label="Account Management" />
                                <q-checkbox v-model="newUser.userAccess.userReports" label="Reports" />
                                <q-checkbox v-model="newUser.userAccess.userTodayReserve" label="Today's Reserve" />
                                <q-checkbox v-model="newUser.userAccess.userCancelEvents" label="Cancel Event" />
                                <q-checkbox v-model="newUser.userAccess.userEventsToday" label="Events Today" />
                                <q-checkbox v-model="newUser.userAccess.userFinishedEvent" label="Finished Events" />
                                <q-checkbox v-model="newUser.userAccess.userSettledPayment" label="Settled Payments" />
                                <q-checkbox v-model="newUser.userAccess.userMaps" label="Map" />
                        </div>
                    </div>
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                    <q-btn flat label="Cancel" v-close-popup />
                    <q-btn flat label="Add Account" v-if="!isEdit" v-close-popup @click="addNewUser" />
                    <q-btn v-if="isEdit" flat v-close-popup @click="updateUser" label="Update"/>
                </q-card-actions>
                <q-inner-loading :visible="loading">
                        <q-spinner-gears size="50px" color="primary"></q-spinner-gears>
                </q-inner-loading>
            </q-card>
        </q-dialog>
    </q-page>
</template>
<script>
export default {
    data() {
        return {
    			isEdit: false,
                Accounts: [],
                loading: false,
                addAccountDialog: false,
                Position: [],
            newUser: {
                accountFirstName: '',
                accountLastName: '',
                accountPosition: '',
                accountPassword: '',
                accountEmailAdd: '',
                accountConfirmPassword: '',
                activated: false,
                userAccess: {
                    userWalkIn: false,
                    userDashboard: false,
                    userReservation: false,
                    userCalendar: false,
                    userPackManage: false,
                    userIncManage: false,
                    userOtherManage: false,
                    userAssignedReserve: false,
                    userPlaceTracker: false,
                    userAccountManage: false,
                    userReports: false,
                    userTodayReserve: false,
                    userCancelEvents: false,
                    userEventsToday: false,
                    userFinishedEvent: false,
                    userSettledPayment: false,
                    userMaps: false,
                }
            },
            filter: '',
            columns: [
                { name: 'accountFirstName', required: true, label: 'Full Name', align: 'center', field: 'accountFirstName', sortable: true },
                { name: 'accountEmailAdd', required: true, label: 'Email Address', align: 'center', field: 'accountEmailAdd', sortable: true },
                { name: 'activated', required: true, label: 'Account Status', align: 'center', field: 'activated', sortable: true },
                { name: 'accountPosition', required: true, label: 'Account Position', align: 'center', field: 'accountPosition', sortable: true },
                { name: 'userAccess', required: true, label: 'Account Access', align: 'center', field: 'userAccess', sortable: true },
                { name: 'action', label: 'Action' }
            ]
        }
    },
    mounted() {
        this.$binding('Position', this.$firestoreApp.collection('Position'))
            .then(Position => {
            console.log(Position, 'Position')
        }),
        this.$binding('Accounts', this.$firestoreApp.collection('Accounts'))
            .then(Accounts => {
            console.log(Accounts, 'Accounts')
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
            },
        getUsers () {
			try {
				let filterUsers = this.$lodash.filter(this.Accounts, u => {
					return u.accountPosition !== 'Admin'
                })
                console.log(filterUsers, 'users')
				return filterUsers
			} catch {
				return []
			}
		}
    },
    methods: {
        clear(){
            this.isEdit = false
            this.newUser.accountFirstName = ''
            this.newUser.accountLastName = ''
            this.newUser.accountPosition = ''
            this.newUser.accountPassword = ''
            this.newUser.accountEmailAdd = ''
            this.newUser.accountConfirmPassword = ''
            this.newUser.userAccess.userWalkIn = false
            this.newUser.userAccess.userDashboard = false
            this.newUser.userAccess.userReservation = false
            this.newUser.userAccess.userCalendar = false
            this.newUser.userAccess.userPackManage = false
            this.newUser.userAccess.userIncManage = false
            this.newUser.userAccess.userOtherManage = false
            this.newUser.userAccess.userAssignedReserve = false
            this.newUser.userAccess.userPlaceTracker = false
        },
        removeUser (p) {
                this.$q.dialog({
                title: 'REMOVE THIS ACCOUNT??',
                message: 'Delete Account??',
                type: 'negative',
                color: 'negative',
                textColor: 'red',
                icon: 'info',
                ok: 'Ok',
                cancel: 'Cancel'
            }).onOk(()=>{
			console.log('p', p)
			let lName = p.row.accountLastName
            let userKey = p.row['.key']
            this.$firestoreApp.collection('Accounts').doc(userKey).delete()
			//this.$database.ref(`users`).child(userKey).remove()
				.then(() => {
					this.$q.notify({
                    message: `${lName} has been deleted`,
                    type: 'info',
                    color: 'info',
                    textColor: 'white',
                    icon: 'info'
                })
          }).onCancel(()=>{
              addAccountDialog = true
          })
          this.$forceUpdate()
				})
				.catch(err => {
					this.$q.notify({
            message: `An error occur ${err}`,
            type: 'negative',
            color: 'negative',
            textColor: 'white',
            icon: 'info'
          })
				})
		},
        updateUser () {
			this.$q.dialog({
				title: 'Confirm',
			  message: 'Do you want to update user?',
			  ok: 'Update',
			  cancel: 'Cancel'
			})
			//   .then(() => {
			    // Picked "OK"
			//   })
			//   .catch(() => {
			    // Picked "Cancel" or dismissed
            //   })
            // let key = data['.key']
            // let update = {...data}
            // delete update['.key']
			let data = {...this.newUser}
			var key = data['.key']
			delete data.__index
			delete data['.key']
            console.log('user', data)
            this.$firestoreApp.collection('Accounts').doc(key).set(data)
			// this.$database.ref(`users/${key}`).set(data)
			.onOk(() => {
		    this.$q.notify({
            message: `${data.accountLastName} has been updated`,
            type: 'positive',
            color: 'positive',
            textColor: 'white',
            icon: 'info'
            })  
		
			this.newUserModal = false
            this.isEdit = false
            })
        },
        editUser (u) {
			let data = {...u}
			this.newUser = data
			this.addAccountDialog = true
			this.isEdit = true
		},
        activate(data) {
            this.$q.dialog({
                title: `Enabling and Disabling Accounts`,
                type: 'negative',
                color: 'negative',
                textColor: 'white',
                icon: 'warning',
                ok: 'Ok'
            }).onOk(()=> {
            var status = data.activated
			console.log(data, 'data')
			let key = data['.key']
            let update = {...data}
            delete update['.key']
            this.$firestoreApp.collection(`Accounts`).doc(key).set(update)
				.then(() => {
			this.$q.notify({
            message: status ? `${data.accountLastName} has been activated`: `${data.accountLastName} has been deactivated`,
            type: 'positive',
            color: 'positive',
            textColor: 'white',
            icon: 'info'
          })
				})
				.catch((err) => {
					this.$q.notify({
                    message: `An error occured`,
                    type: 'negative',
                    color: 'negative',
                    textColor: 'white',
                    icon: 'warning'
                })
					console.log(err)
                })
            })
		},
        addNewUser () {
			this.$q.dialog({
				title: 'Confirm',
			  message: 'Do you want to save user?',
			  ok: 'Save',
			  cancel: 'Cancel'
			})
			  .onOk(() => {
					let data = this.newUser
		      let self = this
					this.loading = true
		      console.log('create data', data)
		      self.$auth2.createUserWithEmailAndPassword(data.accountEmailAdd, data.accountPassword)
		        .then((user) => {
		        	setTimeout(() => {
		        		let userData = Object.assign({}, user.user)
			          console.log('user', userData)
			          delete data['accountPassword']
			          delete data['accountConfirmPassword']
			          self.$firestoreApp.collection('Accounts').doc(userData.uid).set(data)
			          	.then(u => {
				            this.$q.notify({
				              message: `User has been successfully added`,
				              type: 'positive',
				              color: 'positive',
				              textColor: 'white',
				              icon: 'info'
                            })
                            this.loading = false
				            this.addAccountDialog = false
				          })
			            .catch(error => {
			              this.$q.notify({
			                message: `An error occured in adding to database${error}`,
			                type: 'negative',
			                color: 'negative',
			                textColor: 'white',
			                icon: 'warning'
			              })
                          this.loading = false
                        //   this.newUser.accountFirstName = ''
                        //   this.newUser.accountLastName = ''
                        //   this.newUser.accountPosition = ''
                        //   this.newUser.accountPassword = ''
                        //   this.newUser.accountEmailAdd = ''
                        //   this.newUser.accountConfirmPassword = ''
                        //   this.newUser.userAccess.userWalkIn = false
                        //   this.newUser.userAccess.userDashboard = false
                        //   this.newUser.userAccess.userReservation = false
                        //   this.newUser.userAccess.userCalendar = false
                        //   this.newUser.userAccess.userPackManage = false
                        //   this.newUser.userAccess.userIncManage = false
                        //   this.newUser.userAccess.userOtherManage = false
                        //   this.newUser.userAccess.userAssignedReserve = false
                        //   this.newUser.userAccess.userPlaceTracker = false
			            })	
		        	}, 3000)
		        })
		        .catch(error => {
		        	// error on adding new user in auth
		          console.log('error', error.message)
		          this.$q.notify({
		            title: 'Error Occured',
		            message: `${error.message}`,
		            type: 'negative',
		            color: 'negative',
		            textColor: 'white',
		            icon: 'warning'
		          })
		          this.loading = false
		        })
			  })
			  .catch(() => {})
		}
    }
}
</script>