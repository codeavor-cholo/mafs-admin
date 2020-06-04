<template>
    <q-page padding>
        <div>
            <q-table title="Today's Cancellation of Events" :data="cancelNow" :columns="columns" :filter="filter" row-key="name" :pagination.sync="pagination" > 
                <template v-slot:body="props">
                    <q-tr :props="props">
                        <q-td key="clientName" :props="props">{{props.row.clientFullName}}</q-td>
                        <!-- <q-td key="clientPlace" :props="props">{{props.row.clientEventPlace}}</q-td> -->
                        <q-td key="clientDate" :props="props">{{props.row.clientReserveDate}}</q-td>
                        <q-td key="clientTime" :props="props">{{props.row.clientReserveTime}}</q-td>
                        <q-td key="clientPackage" :props="props">{{props.row.clientSelectEvent}}</q-td>
                        <!-- <q-td key="clientEmail" :props="props">{{props.row.clientEmailAdd}}</q-td> -->
                        <q-td key="action" :props="props">
                        <q-btn dense class="q-ma-sm" color="primary" icon="mdi-pencil" @click="openReserveDialog(props.row)" label="View Reservation"></q-btn>
                        <!-- <q-btn dense class="q-ma-sm" color="primary" icon="mdi-pencil" @click="openStatusDialog(props.row)" label="View Payment"></q-btn>
                        <q-btn dense class="q-ma-sm" color="primary" icon="mdi-pencil" @click="openContractDialog(props.row)" label="View Contract"></q-btn> -->
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
            <q-table title="All Cancelled Events" :data="eventNow" :columns="columns" :filter="filter" row-key="name" :pagination.sync="pagination" > 
                <template v-slot:body="props">
                    <q-tr :props="props">
                        <q-td key="clientName" :props="props">{{props.row.clientFullName}}</q-td>
                        <!-- <q-td key="clientPlace" :props="props">{{props.row.clientEventPlace}}</q-td> -->
                        <q-td key="clientDate" :props="props">{{props.row.clientReserveDate}}</q-td>
                        <q-td key="clientTime" :props="props">{{props.row.clientReserveTime}}</q-td>
                        <q-td key="clientPackage" :props="props">{{props.row.clientSelectEvent}}</q-td>
                        <!-- <q-td key="clientEmail" :props="props">{{props.row.clientEmailAdd}}</q-td> -->
                        <q-td key="action" :props="props">
                        <q-btn dense class="q-ma-sm" color="primary" icon="mdi-pencil" @click="openReserveDialog(props.row)" label="View Reservation"></q-btn>
                        <!-- <q-btn dense class="q-ma-sm" color="primary" icon="mdi-pencil" @click="openStatusDialog(props.row)" label="View Payment"></q-btn>
                        <q-btn dense class="q-ma-sm" color="primary" icon="mdi-pencil" @click="openContractDialog(props.row)" label="View Contract"></q-btn> -->
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
    
    <q-dialog v-model="customPack" full-width>
        <q-card>
            <q-card-section class="row items-center">
                        <div class="text-h6">Cancelled Events Details</div>
                        <q-space />
                        <q-btn icon="close" flat round dense v-close-popup>
                            <q-tooltip>
                                Cancel
                            </q-tooltip>
                        </q-btn>
                    </q-card-section>
            <q-card-section>
            </q-card-section>
            <q-card-section>
            <div style="float: left; width: 100%; clear:both">
                <div class="q-ma-sm row">
                <q-input class="q-ma-sm" v-show="hide" readonly label="Token" style="width: 200px" v-model="clientToken" />    
                <q-input class="q-ma-sm" v-show="hide" readonly label="clientReserveType" style="width: 200px" v-model="clientReserveType" />
                <q-input class="q-ma-sm" type="date" mask="YYYY-MM-DD" v-show="hide" readonly label="This day Paid" style="width: 200px" v-model="clientThisDayPaidPayment" />    
                <q-input class="q-ma-sm" v-show="hide" readonly label="Total Down Payment" style="width: 200px" v-model="clientTotalDownPrice" />
                <q-input class="q-ma-sm" v-show="hide" readonly label="This Day Reserve" style="width: 200px" v-model="clientThisDayReserve" />
                <q-input class="q-ma-sm" v-show="hide" readonly label="First Name" style="width: 200px" v-model="clientFirstName" />
                <q-input class="q-ma-sm" v-show="hide" readonly label="Last Name" style="width: 200px" v-model="clientLastName" />
                <q-input class="q-ma-sm" readonly label="Full Name" style="width: 200px" v-model="clientFullName" />
                <q-input class="q-ma-sm" readonly type="date" mask="YYYY-MM-DD" label="Date of Events" v-model="clientDate" />
                <q-input class="q-ma-sm" readonly label="Time of Events" style="width: 100px" v-model="clientTime" />
                <q-input class="q-ma-sm" readonly label="End Time" style="width: 70px" v-model="clientEndTime" />
                <q-input class="q-ma-sm" readonly label="Email Address" style="width: 270px" v-model="clientEmail" />
                <q-input class="q-ma-sm" readonly label="Pax" style="width: 50px" v-model="clientPax" />
                <q-input class="q-ma-sm" readonly label="Address" style="width: 300px" v-model="clientEventPlace" />
            </div>
            <div class="q-ma-sm row">
                <q-input class="q-ma-sm" readonly label="Contact" style="width: 120px" v-model="clientNo" />
                <q-input class="q-ma-sm" readonly label="Event" style="width: 200px" v-model="clientEvent" />
                <q-input class="q-ma-sm" readonly label="Motif" style="width: 200px" v-model="clientMotif" />
                <q-input class="q-ma-sm" readonly label="Motif" style="width: 630px" autogrow v-model="clientMotifDes" />
            </div>
            </div>
            <div style="float: left; width: 49%">
                <q-item-label overline>&nbsp;Food To Serve</q-item-label>
                <q-list v-for="(i, index) in  this.SelectedFood" :key="index" dense>
                        <q-item clickable v-ripple>
                            <q-item-section>
                                <q-item-label lines="1">{{i.foodName}}</q-item-label>
                            </q-item-section>
                            <!-- <q-item-section side>
                                 <q-item-label lines="1">{{j.qty}}</q-item-label>
                            </q-item-section> -->
                        </q-item>
                </q-list>
                <div v-show="this.packInc.length > 0">
                    <q-item-label overline>&nbsp;Inclusion</q-item-label>
                        <q-list v-for="(j, jindex) in  this.packInc" :key="jindex" dense>
                                <q-item clickable v-ripple>
                                    <q-item-section>
                                        <q-item-label lines="1">{{j.setupOne}}</q-item-label>
                                    </q-item-section>
                                    <!-- <q-item-section side>
                                        <q-item-label lines="1">{{j.qty}}</q-item-label>
                                    </q-item-section> -->
                                </q-item>
                        </q-list>
                </div>
                <div v-show="this.packAmenities.length > 0">   
                    <q-item-label overline>&nbsp;Amenities</q-item-label>
                        <q-list v-for="(l, lindex) in  this.packAmenities" :key="lindex" dense>
                                <q-item clickable v-ripple>
                                    <q-item-section>
                                        <q-item-label lines="1">{{l.amenitiesNames}}</q-item-label>
                                    </q-item-section>
                                    <!-- <q-item-section side>
                                        <q-item-label lines="1">{{j.qty}}</q-item-label>
                                    </q-item-section> -->
                                </q-item>
                        </q-list>
                </div>
                <div v-show="this.packServices.length > 0">
                    <q-item-label overline>&nbsp;Services</q-item-label>
                        <q-list v-for="(k, kindex) in  this.packServices" :key="kindex" dense>
                                <q-item clickable v-ripple>
                                    <q-item-section>
                                        <q-item-label lines="1">{{k.servicesNames}}</q-item-label>
                                    </q-item-section>
                                    <!-- <q-item-section side>
                                        <q-item-label lines="1">{{j.qty}}</q-item-label>
                                    </q-item-section> -->
                                </q-item>
                        </q-list>
                </div>
                
            </div>
            <div class="q-ma-sm row" style="float: right; width: 49%;">
                    <div>
                        <strong><b></b></strong>
                    </div>
                    <q-input class="q-ma-md" readonly label="Package Price" suffix="Php" style="width: 90px" v-model="clientPackPrice" />
                    <q-input class="q-ma-md" readonly label="Amount Paid" suffix="Php" style="width: 90px" v-model="clientPaidAmount" />
                    <q-input class="q-ma-md" readonly label="Balance" suffix="Php" style="width: 90px" v-model="clientBalance" />
                    <div>
                        <q-btn :disable="returnDisable(this.clientDate)" @click="addCancelEvent" class="q-ma-sm" align="center" style="width: 400px; height: 50px" color="accent" label="RE-BOOK RESERVATION" icon="mdi-autorenew" />
                    </div>
            </div>
            </q-card-section>
        </q-card>
    </q-dialog>

    </q-page>
</template>
<script>
import { date } from 'quasar'
export default {
    computed: {
        packInc(){
            if(this.SelectedInc.length === 0){
                return []
            }else{
                return this.SelectedInc
            }
        },
        packServices(){
            if(this.SelectedServices.length === 0){
                return []
            }else{
                return this.SelectedServices
            }
        },
        packAmenities(){
            if(this.SelectedAmeninties.length === 0){
                return []
            }else{
                return this.SelectedAmeninties
            }
        },
        cancelNow(){
                    let optionss = this.$lodash.filter(this.Cancelled, m => {
                            return m.clientThisDayCancelled == date.formatDate(new Date(), 'YYYY-MM-DD')
                        })
                            let orderBy = this.$lodash.orderBy(optionss, ['clientReserveDate'], ['asc']);
                        console.log(optionss, 'opoopst')
                            return orderBy
        },
        eventNow(){
                    let optionss = this.$lodash.filter(this.Cancelled, m => {
                            return m.clientThisDayCancelled < date.formatDate(new Date(), 'YYYY-MM-DD')
                        })
                            let orderBy = this.$lodash.orderBy(optionss, ['clientReserveDate'], ['asc']);
                        console.log(optionss, 'opoopst')
                            return orderBy
            }
    },
    data () {
        return {
            clientReserveType: '',
            clientThisDayPaidPayment: date.formatDate(new Date(), 'YYYY-MM-DD'),
            Cancelled: [],
            payDetails: [],
            clientToken: '',
            hide: false,
            emailAdd: '',
            SelectedPackage: [],
            clientTotalDownPrice: '',
            clientThisDayReserve: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm:ssA'),
            clientFirstName: '',
            clientLastName: '',
            clientFullName: '',
            clientEndTime: '',
            clientDate: date.formatDate(new Date(), 'YYYY-MM-DD'),
            clientTime: '',
            clientEmail: '',
            clientPax: '',
            clientEventPlace: '',
            clientNo: '',
            customPack: false,
            clientEvent: '',
            clientMotif: '',
            clientMotifDes: '',
            SelectedFood: [],
            SelectedInc: [],
            SelectedServices: [],
            SelectedAmeninties: [],
            clientPackPrice: '',
            clientPaidAmount: '',
            clientBalance: '',
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
        this.$binding('Cancelled', this.$firestoreApp.collection('Cancelled'))
            .then(Cancelled => {
            console.log(Cancelled, 'Cancelled')
        }),
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
        returnDisable(dateReserve){
            let minus = date.subtractFromDate(dateReserve, { days: 2})
            console.log('minus',minus)
            let now = new Date()
            console.log(now,'now')
            if(date.formatDate(now, 'YYYY-MM-DD') == date.formatDate(minus, 'YYYY-MM-DD')){
                return true
            } else if(now > new Date(dateReserve)) {
                return true
            } else {
                return false
            }
            
        },
        printNow(){
            window.print();
        },
        addCancelEvent(){
            var id = this.cancelID
            var rebookEvent = {
                    clientFirstName: this.clientFirstName,
                    clientLastName: this.clientLastName,
                    clientFullName: this.clientFullName,
                    clientEventPlace: this.clientEventPlace,
                    clientPax: this.clientPax,
                    clientEmailAdd: this.clientEmail,
                    clientContact: this.clientNo,
                    clientReserveDate: this.clientDate,
                    clientThisDayReserve: date.formatDate(new Date(), 'YYYY-MM-DD'),
                    clientReserveTime: this.clientTime,
                    clientReserveEndTime: this.clientEndTime,
                    clientSelectEvent: this.clientEvent,
                    clientTotalPackPrice: this.clientPackPrice,
                    clientTotalDownPrice: this.clientTotalDownPrice,
                    clientBalance: this.clientBalance,
                    clientMotif: this.clientMotif,
                    clientMotifDes: this.clientMotifDes,
                    clientSelectPackage: this.SelectedPackage,
                    clientFoodSelected: this.SelectedFood,
                    clientPackInc: this.SelectedInc,
                    clientAmenities: this.SelectedAmeninties,
                    clientServices: this.SelectedServices,
                    clientPayDetails: this.payDetails,
                    clientTokenID: this.clientToken,
                    clientPaidAmount: this.clientPaidAmount,
                    clientThisDayPaidPayment: this.clientThisDayPaidPayment,
                    clientReserveType: this.clientReserveType
                }
                    this.$q.dialog({
                    title: 'Rebooked Reservation?',
                    message: 'Are you sure you want to Rebooked this Reservation???',
                    ok: 'Ok',
                    cancel: 'Cancel',
                    persistent: true
                    }).onOk(()=>{
                        this.$firestoreApp.collection('Reservation').add(rebookEvent)
                        this.$firestoreApp.collection('Cancelled').doc(id).delete()
                        this.$q.notify({
                                message: 'Events Re-Booked!',
                                icon: 'mdi-cancel',
                                color: 'positive',
                                textColor: 'white',
                                position: 'center'
                            })
                            this.customPack = false
                    }).onCancel(() => {

                    })
        },
        openReserveDialog (props) {
          this.cancelID = props['.key']
          this.emailAdd = props.clientEmailAdd
          this.SelectedPackage = props.clientSelectPackage
          this.clientTotalDownPrice = props.clientTotalDownPrice
          this.clientThisDayReserve = props.clientThisDayReserve
          this.clientFirstName = props.clientFirstName
          this.clientLastName = props.clientLastName
          this.clientFullName = props.clientFullName
          this.clientEndTime = props.clientReserveEndTime
          this.clientDate = props.clientReserveDate
          this.clientTime = props.clientReserveTime
          this.clientEmail = props.clientEmailAdd
          this.clientPax = props.clientPax
          this.clientEventPlace = props.clientEventPlace
          this.clientNo = props.clientContact
          this.clientEvent = props.clientSelectEvent
          this.clientMotif = props.clientMotif
          this.clientMotifDes = props.clientMotifDes
          this.SelectedFood = props.clientFoodSelected
          this.SelectedInc = props.clientPackInc
          this.SelectedServices = props.clientServices
          this.SelectedAmeninties = props.clientAmenities
          this.clientPackPrice = props.clientTotalPackPrice
          this.clientPaidAmount = props.clientPaidAmount
          this.clientBalance = props.clientBalance
          this.cashAmount = props.clientBalance
          this.clientToken = props.clientTokenID
          this.clientPayDetails = props.payDetails
          this.clientThisDayPaidPayment = props.clientThisDayPaidPayment
          this.clientReserveType = props.clientReserveType
          this.customPack = true
        }
    }
    
}
</script>