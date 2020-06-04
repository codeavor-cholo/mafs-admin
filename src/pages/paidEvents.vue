<template>
    <q-page padding>
        <div>
            <q-table title="Finished Events" :data="database" :columns="columns" :filter="filter" row-key="name" :pagination.sync="pagination" > 
                <template v-slot:body="props">
                    <q-tr :props="props">
                        <q-td key="clientName" :props="props">{{props.row.clientFullName}}</q-td>
                        <!-- <q-td key="clientPlace" :props="props">{{props.row.clientEventPlace}}</q-td> -->
                        <q-td key="clientDate" :props="props">{{props.row.clientReserveDate}}</q-td>
                        <q-td key="clientTime" :props="props">{{props.row.clientReserveTime}}</q-td>
                        <q-td key="clientPackage" :props="props">{{props.row.clientSelectEvent}}</q-td>
                        <!-- <q-td key="clientEmail" :props="props">{{props.row.clientEmailAdd}}</q-td> -->
                        <q-td key="action" :props="props">
                        <q-btn dense class="q-ma-sm" color="primary" icon="mdi-pencil" @click="cotractDialog = true, openContract(props.row)" label="View Contract"></q-btn>
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
        </div>
        <br/>
        <div>
            <q-table title="Pending Events" :data="databasePending" :columns="columns" :filter="filter" row-key="name" :pagination.sync="pagination" > 
                <template v-slot:body="props">
                    <q-tr :props="props">
                        <q-td key="clientName" :props="props">{{props.row.clientFullName}}</q-td>
                        <!-- <q-td key="clientPlace" :props="props">{{props.row.clientEventPlace}}</q-td> -->
                        <q-td key="clientDate" :props="props">{{props.row.clientReserveDate}}</q-td>
                        <q-td key="clientTime" :props="props">{{props.row.clientReserveTime}}</q-td>
                        <q-td key="clientPackage" :props="props">{{props.row.clientSelectEvent}}</q-td>
                        <!-- <q-td key="clientEmail" :props="props">{{props.row.clientEmailAdd}}</q-td> -->
                        <q-td key="action" :props="props">
                        <q-btn dense class="q-ma-sm" color="primary" icon="mdi-pencil" @click="cotractDialog = true, openContract(props.row)" label="View Contract"></q-btn>
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
        </div>
        
        
    <q-dialog v-model="cotractDialog" full-width>
              <div >
                <q-card>
                    <q-card-section class="row items-center">
                    <q-space />
                    <q-btn class="bodyText" icon="close" flat round dense v-close-popup>
                        <q-tooltip>
                            Cancel
                        </q-tooltip>
                    </q-btn>
                </q-card-section>
                <q-card-section>

                    <q-card class="my-card">
                    <q-card-section>
                    <div class="column items-center">
                    <img src="statics/bg/logogo.png" class="col q-ma-sm" style="width:300px;height:100%">
                    <div style="font-size:11px">
                    <p><b>#39-Q Pugad Lawin Drive, Bahay Toro, Project 8, Q.C<br>
                        Ma. Amelia D. Marcillan - Gen. Proprietress<br>
                        Tel. Nos. 697-1462; 414-02-82<br>
                        Cell. Nos. 0917-468-8289; 0930-005-1616<br>
                        Email Address: melmarcillanfoods@yahoo.com<br>
                        </b>
                    </p>
                    </div>
                    </div>

                    <!-- SEPARATOR -->
                    <div style="margin-bottom:3px">    
                    <q-separator color="grey-10" />
                    </div>
                    <q-separator style="height:5px" color="grey-10" />
                    <div style="margin-top:3px">    
                    <q-separator color="grey-10" />
                    </div>
                    <!-- END OF SEPARATOR -->

                    <div class="q-py-md q-pl-lg" style="font-size:17px">
                            <div class="row">
                            <div class="col"><b>Client: {{selectedReservation.clientFullName}} </b> </div>
                            <div class="col-4"><b>Date: {{selectedReservation.clientReserveDate}} </b> </div>
                            </div>
                            <br>
                            <div class="row">
                            <div class="col"><b>Venue: {{selectedReservation.clientEventPlace}} </b> </div>
                            <div class="col-4"><b>Time: {{selectedReservation.clientReserveTime}} to {{selectedReservation.clientReserveEndTime}} </b> </div>
                            </div> 
                    </div>

                    <!-- SEPARATOR -->
                    <div style="margin-bottom:3px">    
                    <q-separator color="grey-10" />
                    </div>
                    <q-separator style="height:5px" color="grey-10" />
                    <div style="margin-top:3px">    
                    <q-separator color="grey-10" />
                    </div>
                    <!-- END OF SEPARATOR -->
                        <div>
                            <q-list dense bordered padding class="rounded-borders" full-width>
                                <div style="margin-top: -40px; margin-bottom: -40px" class="column items-center">
                                    <h6><b>{{selectedReservation.clientSelectEvent}}</b></h6>
                                </div>
                                <strong>
                                <div>
                                    <q-item-label overline>&nbsp;Food To Serve</q-item-label>
                                    <q-item dense clickable v-ripple v-for="(s, index) in this.selectedReservation.clientFoodSelected" :key="index">
                                        <q-item-section>
                                            <q-item-label style="margin-left: 50px" lines="1">{{s.foodName}}</q-item-label>
                                        </q-item-section>
                                    </q-item>
                                </div>
                                <div>
                                    <q-item-label overline>&nbsp;Inclusion List</q-item-label>
                                    <q-item dense clickable v-ripple v-for="(h, index) in this.selectedReservation.clientPackInc" :key="index">
                                        <q-item-section>
                                            <q-item-label style="margin-left: 50px" lines="1">{{h.setupOne}}</q-item-label>
                                        </q-item-section>
                                    </q-item>
                                </div>
                                <div >
                                    <q-item-label overline>&nbsp;Other Additional List</q-item-label>
                                    <q-item dense clickable v-ripple v-for="(n, index) in this.selectedReservation.clientAmenities" :key="index">
                                        <q-item-section>
                                            <q-item-label style="margin-left: 50px" lines="1">{{n.amenitiesNames}}</q-item-label>
                                        </q-item-section>
                                        <q-item-section>
                                            <q-item-label style="margin-left: 50px" lines="1">{{n.amenitiesQuantities}}</q-item-label>
                                        </q-item-section>
                                    </q-item>
                                </div>
                                <div>
                                    <q-item dense clickable v-ripple v-for="(n, index) in this.selectedReservation.clientServices" :key="index">
                                        <q-item-section>
                                            <q-item-label style="margin-left: 50px" lines="1">{{n.servicesNames}}</q-item-label>
                                        </q-item-section>
                                        <q-item-section>
                                            <q-item-label style="margin-left: 50px" lines="1">{{n.servicesQuantities}}</q-item-label>
                                        </q-item-section>
                                        
                                    </q-item>
                                </div>
                                
                                
                                <q-separator/>
                                <div class="q-ma-md row">
                                <strong>{{selectedReservation.clientPax}} persons</strong><strong>&nbsp;for</strong>&nbsp;&nbsp;<strong>{{selectedReservation.clientTotalPackPrice}}php</strong>
                                </div>
                                <div class="q-ma-md row" style="margin-top: -10px">
                                    <strong>Paid Amount =</strong><strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{selectedReservation.clientPaidAmount}}php</strong> 
                                </div>
                                <div class="q-ma-md row" style="margin-top: -10px" >
                                    <strong>Balance =</strong><strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{selectedReservation.clientBalance}}php</strong>
                                </div>
                                <q-item-label overline>&nbsp;Terms And Condition</q-item-label>

                                <q-item dense clickable v-ripple v-for="(s, index) in this.Terms" :key="index">
                                    <q-item-section>
                                        <q-item-label style="margin-left: 50px" lines="1">{{s.terms}}</q-item-label>
                                    </q-item-section>
                                </q-item>
                                <q-item-label overline>&nbsp;Mode of Payment</q-item-label>
                                <q-item dense clickable v-ripple v-for="(s, index) in this.Mode" :key="index">
                                    <q-item-section>
                                        <q-item-label style="margin-left: 50px" lines="1">{{s.mode}}</q-item-label>
                                    </q-item-section>
                                </q-item>
                                </strong>
                            </q-list>
                            
                        </div>

                    </q-card-section>
                    </q-card>

                </q-card-section>
                </q-card>
                <q-page-sticky position="bottom-right" :offset="[18, 18]">
                        <div class="text-h6"><q-btn class="bodyText" label="Print" color="primary" @click="printNow" icon="print" /></div>
                </q-page-sticky>
                </div>
                
    </q-dialog>

    </q-page>
</template>
<script>
import { date } from 'quasar'
export default {
    computed: {
        database(){
            let optionss = this.$lodash.filter(this.Reservation, m => {
						return m.clientReserveDate < date.formatDate(new Date(), 'YYYY-MM-DD') && m.clientBalance == 0
                    }) 
            let orderBy = this.$lodash.orderBy(optionss, ['clientReserveDate'], ['asc']);
            return orderBy
        },
        databasePending(){
            let optionss = this.$lodash.filter(this.Reservation, m => {
						return m.clientReserveDate > date.formatDate(new Date(), 'YYYY-MM-DD') && m.clientBalance == 0
                    }) 
            let orderBy = this.$lodash.orderBy(optionss, ['clientReserveDate'], ['asc']);
            return orderBy
        }
    },
    data () {
        return {
            cotractDialog: false,
            Reservation: [],
            Terms: [],
            Mode: [],
            pagination: { sortBy: 'Category', descending: false, page: 1, rowsPerPage: 10},
            filter: '',
            columns: [
                { name: 'clientName', required: true, label: 'Client Name', align: 'left', field: 'clientFullName', sortable: true },
                // { name: 'clientPlace', required: true, label: 'Event Place', align: 'left', field: 'clientEventPlace', sortable: true },
                { name: 'clientDate', required: true, label: 'Date', align: 'left', field: 'clientReserveDate', sortable: true },
                { name: 'clientTime', required: true, label: 'Time', align: 'left', field: 'clientReserveTime', sortable: true },
                { name: 'clientPackage', required: true, label: 'Event', align: 'left', field: 'clientSelectPackage.eventName', sortable: true },
                // { name: 'clientEmail', required: true, label: 'Email', align: 'left', field: 'clientEmailAdd', sortable: true },
                { name: 'action', align: 'center', label: 'Action' }
            ],
            selectedReservation: []
        }
    },
    mounted() {
        this.$binding('Reservation', this.$firestoreApp.collection('Reservation'))
            .then(Reservation => {
            console.log(Reservation, 'Reservation')
        }),
        this.$binding('Terms', this.$firestoreApp.collection('Terms'))
            .then(Terms => {
            console.log(Terms, 'Terms')
        }),
        this.$binding('Mode', this.$firestoreApp.collection('Mode'))
            .then(Mode => {
            console.log(Mode, 'Mode')
        })
    },
    methods: {
        printNow(){
        // this.$htmlToPaper('printMe', () => {
        //   console.log('Printing completed or was cancelled!');
            window.print();
            // })
        },
        openReserve (props) {
          this.selectedReservation = props 
        },
        openContract (props) {
          this.selectedReservation = props 
        }
    }
    
}
</script>
<style type = "text/css">
      @media print {
        .bodyText {
            display: none;
          }
      }
</style>