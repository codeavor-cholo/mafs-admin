<template>
    <q-page>
        <q-table title="Client Accounts Reports" :data="ClientAccount" :columns="columns" :filter="filter" row-key="name">
            <template v-slot:body="props">
                <q-tr>
                    <q-td key="fullName" :props="props">{{props.row.fullName}}</q-td>
                    <q-td key="firstName" :props="props">{{props.row.firstName}}</q-td>
                    <q-td key="lastName" :props="props">{{props.row.lastName}}</q-td>
                    <q-td key="email" :props="props">{{props.row.email}}</q-td>
                    <q-td key="contact" :props="props">{{props.row.contact}}</q-td>
                    <!-- <q-td key="dateRegistered" :props="props">{{props.row.dateRegistered}}</q-td> -->
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
        <strong>No. Of Registered Accounts: {{accountCount}}</strong>
        <q-btn label="Print Reports" class="full-width" color="primary" @click="clientReportDialog = true" icon="print" />
        <q-dialog v-model="clientReportDialog" full-width  persistent>
                <q-card class="shadow-0" >
                    <q-card-section class="row items-center">
                         <strong>No. Of Registered Accounts: {{accountCount}}</strong>
                        <q-space />
                        <q-btn class="bodyText" icon="close" flat round dense v-close-popup>
                            <q-tooltip>
                                Cancel
                            </q-tooltip>
                        </q-btn>
                    </q-card-section>
                    <q-card-section>
                            <div id="printMe" class="col-3 col-md-7">
                                           <q-item>
                                    <q-item-section>
                                    <q-item-label overline>Full Name</q-item-label>
                                    </q-item-section>
                                    <q-item-section>
                                    <q-item-label overline>Email</q-item-label>
                                    </q-item-section>
                                    <q-item-section>
                                    <q-item-label overline>Contact</q-item-label>
                                    </q-item-section>
                                </q-item>
                                <q-list v-for="(i, index) in  this.ClientAccount" :key="index" dense>
                                    <q-item clickable v-ripple>
                                        <q-item-section>
                                            <q-item-label lines="1">&nbsp;&nbsp;&nbsp;&nbsp;{{i.fullName}}</q-item-label>
                                        </q-item-section>
                                        <q-item-section>
                                            <q-item-label lines="1">&nbsp;&nbsp;&nbsp;&nbsp;{{i.email}}</q-item-label>
                                        </q-item-section>
                                        <q-item-section>
                                            <q-item-label lines="1">&nbsp;&nbsp;&nbsp;&nbsp;{{i.contact}}</q-item-label>
                                        </q-item-section>
                                    </q-item>
                                </q-list>
                                
                            </div>
                            <div class="q-pa-xl">
                                <strong>PREPARED BY: {{foodEditDishType.accountFirstName}} {{foodEditDishType.accountLastName}}</strong>
                            </div>
                    </q-card-section>
                    <q-page-sticky position="bottom-right" :offset="[18, 18]">
                        <div class="text-h6"><q-btn class="bodyText" label="Print" color="primary" @click="printNow" icon="print" /></div>
                    </q-page-sticky>
                </q-card>
            </q-dialog>
    </q-page>
</template>
<script>
import { date } from 'quasar'
export default {
    data(){
        return{
            Accounts: [],
            clientReportDialog: false,
            ClientAccount: [],
            filter: '',
            columns: [
                { name: 'fullName', align: 'left', required: true, label: 'Full Name', align: 'fullName', sortable: true },
                { name: 'firstName', align: 'left', label: 'First Name', field: 'firstName', sortable: true },
                { name: 'lastName', align: 'left', label: 'Last Name', field: 'lastName', sortable: true },
                { name: 'email', align: 'left', label: 'Email', field: 'email', sortable: true },
                { name: 'contact', align: 'left', label: 'Contact', field: 'contact', sortable: true },
                // { name: 'dateRegistered', align: 'left', label: 'Registered Date', field: 'dateRegistered', sortable: true }
            ]
        }
    },
    methods:{
        printNow(){
        // this.$htmlToPaper('printMe', () => {
        //   console.log('Printing completed or was cancelled!');
        window.print();
        // })
      }
    },
    computed: {
        foodEditDishType(){ 
                   this.user = this.$firebase.auth().currentUser
                   if(this.user){
                      this.email = this.user.email
                    }
                   let optionss = this.$lodash.filter(this.Accounts, m => {
                    return m.accountEmailAdd == this.email 
                    })   
                        let clientInfo = {...optionss[0]}
                        delete clientInfo.__index
                        delete clientInfo['.key']
                        console.log(clientInfo, 'info')
                        return clientInfo
                        console.log(optionss, 'ss')
                        // return
                        // this.firstName = optionss[0].accountFirstName
                        // console.log(this.firstName, 'sss')
        },
        accountCount(){
            if(this.ClientAccount.length === 0){
                return 0
            }else{
                return this.ClientAccount.length
            }
        }
    },
    mounted() {
        this.$binding('ClientAccount', this.$firestoreApp.collection('ClientAccount'))
            .then(ClientAccount => {
            console.log(ClientAccount, 'ClientAccount')
        }),
        this.$binding('Accounts', this.$firestoreApp.collection('Accounts'))
            .then(Accounts => {
            console.log(Accounts, 'Accounts')
        })
    }
}
</script>
<style type = "text/css">
      @media print {
        .bodyText {
            display: none;
          }
        ::-webkit-scrollbar {
            display: none;
        }
      }
</style>
