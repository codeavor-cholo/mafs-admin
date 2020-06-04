<template>
    <q-page>
        <q-table title="Events Reports" :data="MostEvent" :columns="columns" :filter="filter" row-key="name">
                <template v-slot:body="props">
                    <q-tr>
                        <q-td key="clientSelectEvent" :props="props">{{props.row.checkerName}}</q-td>
                        <q-td key="count" :props="props">
                            {{props.row.__index + 1}}
                        </q-td>
                        <q-td key="ordered" :props="props">
                            {{props.row.count}}
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
            <q-btn label="Print Reports" class="full-width" color="primary" @click="foodReportDialog = true" icon="print" />
            <q-dialog v-model="foodReportDialog" full-width  persistent>
                <q-card class="shadow-0">
                    <q-card-section class="row items-center">
                        <q-space />
                        <q-btn class="bodyText" icon="close" flat round dense v-close-popup>
                            <q-tooltip>
                                Cancel
                            </q-tooltip>
                        </q-btn>
                    </q-card-section>
                    <q-card-section>
                            <div id="printMe" class="col-3 col-md-7">
                                            <strong>EVENTS REPORTS(RANKING AND NUMBER OF FOODS SELECTED ON PACKAGE)</strong>
                                <q-item>
                                    <q-item-section>
                                    <q-item-label overline>Event Name</q-item-label>
                                    </q-item-section>
                                    <q-item-section>
                                    <q-item-label overline>Most Selected Events</q-item-label>
                                    </q-item-section>
                                    <q-item-section>
                                    <q-item-label overline>No. of times Selected</q-item-label>
                                    </q-item-section>
                                </q-item>
                                <q-list v-for="(i, index) in  this.MostEvent" :key="index" dense>
                                    <q-item clickable v-ripple>
                                        <q-item-section>
                                            <q-item-label lines="1">&nbsp;&nbsp;&nbsp;&nbsp;{{i.checkerName}}</q-item-label>
                                        </q-item-section>
                                        <q-item-section>
                                            <q-item-label lines="1">&nbsp;&nbsp;&nbsp;&nbsp;{{i.__index + 1}}</q-item-label>
                                        </q-item-section>
                                        <q-item-section>
                                            <q-item-label lines="1">&nbsp;&nbsp;&nbsp;&nbsp;{{i.count}}</q-item-label>
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
export default {
    data(){
        return{
            hide: true,
            foodReportDialog: false,
            filter: '',
            Reservation: [],
            Food: [],
            Accounts: [],
            columns: [
                { name: 'clientSelectEvent', align: 'left', required: true, label: 'Event', field: 'clientSelectEvent', sortable: true },
                { name: 'count', align: 'right', label: 'Most Selected Event', sortable: true ,field: 'count'},
                { name: 'ordered', align: 'right', label: 'Number of Times selected on Reservation', sortable: true }
            ]
        }
    },
    mounted(){
        this.$binding('Food', this.$firestoreApp.collection('Food'))
            .then(Food => {
            console.log(Food, 'Food')
        }),
        this.$binding('Reservation', this.$firestoreApp.collection('Reservation'))
            .then(Reservation => {
            console.log(Reservation, 'Reservation')
        }),
        this.$binding('Accounts', this.$firestoreApp.collection('Accounts'))
            .then(Accounts => {
            console.log(Accounts, 'Accounts')
        })
    },
    methods:{
        printNow(){
        // this.$htmlToPaper('printMe', () => {
        //   console.log('Printing completed or was cancelled!');
        window.print();
        // })
      },
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
        MostEvent(){
            console.log("reservation",this.Reservation)
            let selectedEvent = []
            let optionss = this.$lodash.filter(this.Reservation, m => {
               selectedEvent.push({Event: m.clientSelectEvent})
            })
            console.log(selectedEvent, 'selectedEvent')
            let count = this.$lodash.countBy(selectedEvent,'Event')
            console.log(count,'count')

            let mapKey = this.$lodash.map(count, function(value, key){
                return {
                    checkerName: key, 
                    count: value
                }
            })
            
            let order = this.$lodash.orderBy(mapKey, ['count'], ['desc'])
            console.log(order,'order')

            return order
        }
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