<template>
    <q-page>
        <div>
            <div class="q-ma-md row">
                <strong>From:</strong><q-input v-model="fromdate" mask="YYYY/MM/DD" filled type="date"/>
                <strong>To:</strong><q-input v-model="todate" mask="YYYY/MM/DD" filled type="date"/>
                <q-select class="q-ml-md" outlined v-model="filter" style="width: 230px" :options="options" emit-value map-options label="Reservation Type"/>
                <q-btn label="Print Reports" class="q-ml-md" style="width: 300px" color="primary" @click="reserveReportDialog = true" icon="print" />
            </div>
            
            <div class="q-ma-md row">
                <q-card class="q-ma-md" style="width: 300px; height: 50px">
                    <q-item>
                        <q-item-section>
                        <q-item-label><strong>Total Balance:</strong></q-item-label>
                        </q-item-section>
                        <q-item-section side>
                        <q-item-label><strong><b>{{cpBalance}}php</b></strong></q-item-label>
                        </q-item-section>
                    </q-item>
                </q-card>
            </div>
        </div>
        <div>
            <q-table title="Client Reservation Reports" :data="eventsReports" :columns="columns" row-key="name">
                <template v-slot:body="props">
                    <q-tr>
                        <q-td key="clientFullName" :props="props">{{props.row.clientFullName}}</q-td>
                        <!-- <q-td key="clientFirstName" :props="props">{{props.row.clientFirstName}}</q-td> -->
                        <q-td key="clientReserveType" :props="props">{{props.row.clientReserveType}}</q-td>
                        <q-td key="clientReserveDate" :props="props">{{props.row.clientReserveDate}}</q-td>
                        <q-td key="clientTotalBalance" :props="props">{{props.row.clientBalance}} php</q-td>
                    </q-tr>
                </template>
                <!-- <template v-slot:top-right>
                    <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
                    <template v-slot:append>
                        <q-icon name="search" />
                    </template>
                    </q-input>
                </template>   -->
            </q-table>
        </div>
        <q-dialog class="shadow-0" v-model="reserveReportDialog" full-width  persistent>
                <q-card class="shadow-0">
                    <q-card-section class="row items-center">
                        <strong>FOOD REPORTS(RANKING AND NUMBER OF FOODS SELECTED ON PACKAGE)</strong>
                        <strong>RESERVATION TYPE: {{this.filter}}</strong>
                        <q-space />
                        <q-btn class="bodyText" icon="close" flat round dense v-close-popup>
                            <q-tooltip>
                                Cancel
                            </q-tooltip>
                        </q-btn>
                    </q-card-section>
                    <q-card-section>
                            <div>
                                <div class="row">
                                    <q-card class="q-ma-md" style="width: 300px; height: 50px">
                                        <q-item>
                                            <q-item-section>
                                            <q-item-label><strong>Total Balance:</strong></q-item-label>
                                            </q-item-section>
                                            <q-item-section side>
                                            <q-item-label><strong><b>{{cpBalance}}php</b></strong></q-item-label>
                                            </q-item-section>
                                        </q-item>
                                    </q-card>
                                </div>
                                <q-item>
                                    <q-item-section>
                                    <q-item-label overline>Full Name</q-item-label>
                                    </q-item-section>
                                    <q-item-section>
                                    <q-item-label overline>Date of Events</q-item-label>
                                    </q-item-section>
                                    <q-item-section>
                                    <q-item-label overline>Balance</q-item-label>
                                    </q-item-section>
                                </q-item>
                                <q-list v-for="(i, index) in  this.eventsReports" :key="index" dense>
                                    <q-item clickable v-ripple>
                                        <q-item-section>
                                            <q-item-label lines="1">&nbsp;&nbsp;&nbsp;&nbsp;{{i.clientFullName}}</q-item-label>
                                        </q-item-section>
                                        <q-item-section>
                                            <q-item-label lines="1">&nbsp;&nbsp;&nbsp;&nbsp;{{i.clientReserveDate}}</q-item-label>
                                        </q-item-section>
                                        <q-item-section>
                                            <q-item-label lines="1">&nbsp;&nbsp;&nbsp;&nbsp;{{i.clientBalance}}</q-item-label>
                                        </q-item-section>
                                    </q-item>
                                </q-list>
                                
                            </div>
                            <br/>
                            <div class="q-pa-xl">
                                <strong>PREPARED BY: {{foodEditDishType.accountFirstName}} {{foodEditDishType.accountLastName}}</strong>
                            </div>
                    </q-card-section>
                    <q-page-sticky position="bottom-right" :offset="[18, 18]">
                        <div class="text-h6"><q-btn label="Print" class="bodyText" color="primary" @click="printNow" icon="print" /></div>
                    </q-page-sticky>
                </q-card>
            </q-dialog>
    </q-page>
</template>
<script>
import { date } from 'quasar'
export default {
    methods: {
        printNow(){
        // this.$htmlToPaper('printMe', () => {
        //   console.log('Printing completed or was cancelled!');
        window.print();
        // })
      },
    },
    data(){
        return{
            Accounts: [],
            reserveType: '',
            options: [
                {label: 'ALL', value: ''},
                {label: 'ONLINE', value: 'ONLINE'},
                {label: 'WALK-IN', value: 'WALK-IN'},
                {label: 'W/Balance', value: 'W/Balance'},
                {label: 'W/OBALANCE', value: 'W/OBALANCE'}
            ],
            reserveReportDialog: false,
            fromdate:  '',
            todate:  '',
            Reservation: [],
            returnArray:[],
            filter: '',
            columns: [
                { name: 'clientFullName', align: 'left', required: true, label: 'Full Name', field: 'clientFullName', sortable: true },
                // { name: 'clientFirstName', align: 'left', label: 'First Name', field: 'clientFirstName', sortable: true },
                { name: 'clientReserveType', align: 'left', label: 'Reservation Type', field: 'clientReserveType', sortable: true },
                { name: 'clientReserveDate', align: 'left', label: 'Client Date of Events', field: 'clientReserveDate', sortable: true },
                { name: 'clientTotalBalance', align: 'left', label: 'Client Balance', field: 'clientBalance', sortable: true },
            ]
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
        returnWithBalance(){
            let filter = this.$lodash.filter(this.Reservation, m => {
                console.log(m, 'm')
                return m.clientBalance != 0
            })
                console.log(filter, 'filter')
                return filter
        },
        returnWithOutBalance(){
            let filter = this.$lodash.filter(this.Reservation, m => {
                console.log(m, 'm')
                return m.clientBalance == 0
            })
                console.log(filter, 'filter')
                return filter
        },
        returnOnlineReservation(){
            let filter = this.$lodash.filter(this.Reservation, m => {
                console.log(m, 'm')
                return m.clientReserveType == 'ONLINE'
            })
                console.log(filter, 'filter')
                return filter
        },
        returnWalkinReservation(){
            let filter = this.$lodash.filter(this.Reservation, m => {
                return m.clientReserveType == 'WALK-IN'
            })
                return filter
        },
        eventsReports(){ 
            if(this.filter === 'W/OBALANCE'){
                    let filter = this.$lodash.filter(this.Reservation, m => {
                    console.log(m, 'm')
                    return m.clientBalance == 0
                })
                    console.log(filter, 'filter')
                    return filter
            } 
            if(this.filter === 'W/Balance'){
                    let filter = this.$lodash.filter(this.Reservation, m => {
                    console.log(m, 'm')
                    return m.clientBalance != 0
                })
                    console.log(filter, 'filter')
                    return filter
            }
            if(this.filter === 'ONLINE'){
                    let filter = this.$lodash.filter(this.Reservation, m => {
                    console.log(m, 'm')
                    return m.clientReserveType == 'ONLINE'
                })
                    console.log(filter, 'filter')
                    return filter
            } 
            if(this.filter === 'WALK-IN'){
                    let filter = this.$lodash.filter(this.Reservation, m => {
                    return m.clientReserveType == 'WALK-IN'
                })
                    return filter
            }
            if(this.fromdate === '' && this.todate === ''){
                return this.Reservation
            } else {
                let from = this.fromdate
                let to = this.todate
                // console.log('to',to)
                // console.log('from',from)

                var ReserveRef = this.$firestoreApp.collection('Reservation')
                var fromquery = ReserveRef.where('clientReserveDate',"==",from)
                var fromToQuery = ReserveRef.where('clientReserveDate',">=",from).where('clientReserveDate',"<=",to)
                let arr = []
                let self = this

                if(from !== '' && this.todate === ''){
                    let qrr = fromquery.get()
                    .then(function(querySnapshot) {
                        var data = querySnapshot.docs.map(function (documentSnapshot) {
                            return documentSnapshot.data();
                        });
                        // console.log(data,'data')
                        self.returnArray = data
                    })
                    .catch(function(error) {
                        // console.log("error",error)
                    })
                    // qrr();
                } else if(from !== '' && to !== '') {
                    fromToQuery.get()
                    .then(function(querySnapshot) {
                        var data = querySnapshot.docs.map(function (documentSnapshot) {
                            return documentSnapshot.data();
                        });
                        // console.log(data,'2data')
                        self.returnArray = data
                    })
                    .catch(function(error) {
                        // console.log("error",error)
                    })
                }
                // console.log(self.returnArray,'iki')
                return self.returnArray
                // console.log(returnArray,'returnArray')

            }
        },
        cpBalance(){
            if(this.filter == 'ONLINE'){
                let total = this.$lodash.sumBy(this.returnOnlineReservation, 'clientBalance')
                console.log(total, 'sss')
                return total
            }else if(this.filter == 'WALK-IN'){
                let total = this.$lodash.sumBy(this.returnWalkinReservation, 'clientBalance')
                // console.log(sss, 'sss')
                return total
            }else if(this.filter == 'W/Balance'){
                let total = this.$lodash.sumBy(this.returnWithBalance, 'clientBalance')
                // console.log(sss, 'sss')
                return total
            }else if(this.filter == 'W/OBALANCE'){
                let total = this.$lodash.sumBy(this.returnWithOutBalance, 'clientBalance')
                // console.log(sss, 'sss')
                return total
            }else{
                let total = this.$lodash.sumBy(this.returnWalkinReservation, 'clientBalance')
                // console.log(sss, 'sss')
                return total
            }
            // if(this.todate === '' && this.fromdate === ''){
            //     let total = this.$lodash.sumBy(this.Reservation, 'clientBalance')
            //     // console.log(sss, 'sss')
            //     return total
            //     // return 0
            // }else{
            // let sum = this.$lodash.sumBy(this.eventsReports, 'clientBalance')
            // // console.log(sum, 'sum')
            // return sum
            // }
        },
    },
    mounted() {
        this.$binding('Reservation', this.$firestoreApp.collection('Reservation'))
            .then(Reservation => {
            console.log(Reservation, 'Reservation')
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
