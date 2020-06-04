<template>
    <q-page padding>
        <q-table title="On Going Events" :data="eventNow" :columns="columns" :filter="filter" row-key="name">
            <template v-slot:body="props">
                    <q-tr>
                        <q-td key="clientFullName" :props="props">{{props.row.clientFullName}}</q-td>
                        <q-td key="clientReserveDate" :props="props">{{props.row.clientReserveDate}}</q-td>
                        <q-td key="clientReserveTime" :props="props">{{props.row.clientReserveTime}}</q-td>
                        <q-td key="status" :props="props">
                            <q-btn color="primary" icon="mdi-pencil" @click="openStatusDialog(props.row)"></q-btn>
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
        <q-dialog v-model="statusDialog">
                <q-card style="min-width: 400px">
                    <q-card-section class="row items-center">
                                <strong> Client Status</strong>
                                <q-space />
                                <q-btn icon="close" flat round dense v-close-popup>
                                    <q-tooltip>
                                        Cancel
                                    </q-tooltip>
                                </q-btn>
                            </q-card-section>
                    <q-card-section>
                    <div>
                        <div>
                        <q-input class="q-ma-sm" v-show="hide" readonly label="Total Down Payment" style="width: 200px" v-model="clientTotalDownPrice" />
                        <q-input class="q-ma-sm" v-show="hide" readonly label="This Day Reserve" style="width: 200px" v-model="clientThisDayReserve" />
                        <q-input class="q-ma-sm" v-show="hide" readonly label="First Name" style="width: 200px" v-model="clientFirstName" />
                        <q-input class="q-ma-sm" v-show="hide" readonly label="Last Name" style="width: 200px" v-model="clientLastName" />
                        <q-input class="q-ma-sm" v-show="hide" readonly label="End Time" style="width: 70px" v-model="clientEndTime" />
                        <q-input class="q-ma-sm" v-show="hide" readonly label="Email Address" style="width: 270px" v-model="clientEmail" />
                        <q-input class="q-ma-sm" v-show="hide" readonly label="Pax" style="width: 50px" v-model="clientPax" />
                        <q-input class="q-ma-sm" v-show="hide" readonly label="Address" style="width: 300px" v-model="clientEventPlace" />
                    </div>
                    <div class="q-ma-sm row">
                        <q-input class="q-ma-sm" v-show="hide" readonly label="Contact" style="width: 120px" v-model="clientNo" />
                        <q-input class="q-ma-sm" v-show="hide" readonly label="Event" style="width: 200px" v-model="clientEvent" />
                        <q-input class="q-ma-sm" v-show="hide" readonly label="Motif" style="width: 200px" v-model="clientMotif" />
                        <q-input class="q-ma-sm" v-show="hide" readonly label="Motif" style="width: 630px" autogrow v-model="clientMotifDes" />
                    </div>
                    </div>
                    <div v-show="hide" style="float: left; width: 49%">
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
                        <div v-show="hide">
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
                        <div v-show="hide">   
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
                        <div v-show="hide">
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
                    <q-card-section>
                    <q-input class="q-ma-sm" readonly dense v-model="clientFullName" />
                    <q-input class="q-ma-sm" readonly type="date" dense v-model="clientDate" />
                    <q-input class="q-ma-sm" readonly dense v-model="clientTime" />
                    <div v-for="(i, index) in  this.notification" :key="index">
                        <q-checkbox @input="setTask" keep-color color="red" :val="i.value" v-model="clientStatus" :label="i.label" />
                    </div>
                    </q-card-section>
                    <div class="q-ma-sm row" style="float: right; width: 49%;">
                            <q-input class="q-ma-md" v-show="hide" readonly label="Package Price" suffix="Php" style="width: 90px" v-model="clientPackPrice" />
                            <q-input class="q-ma-md" v-show="hide" readonly label="Amount Paid" suffix="Php" style="width: 90px" v-model="clientPaidAmount" />
                            <q-input class="q-ma-md" v-show="hide" readonly label="Balance" suffix="Php" style="width: 90px" v-model="clientBalance" />
                    </div>
                    </q-card-section>
                </q-card>
            </q-dialog>
    </q-page>
</template>
<script>
import { date } from 'quasar'
export default {
    data(){
        return{
            clientPackPrice: '',
            clientPaidAmount: '',
            clientBalance: '',
            SelectedFood: [],
            SelectedInc: [],
            SelectedServices: [],
            SelectedAmeninties: [],
            clientTotalDownPrice: '',
            clientThisDayReserve: '',
            clientFirstName: '',
            clientLastName: '',
            clientEndTime: '',
            clientEmail: '',
            clientPax: '',
            clientEventPlace: '',
            clientNo: '',
            clientEvent: '',
            clientMotif: '',
            clientMotifDes: '',
            notif: false,
            status: false,
            hide: false,
            group: [],
            Notify: [],
            clientTime: '',
            clientDate: '',
            clientFullName: '',
            clientStatus: [],
            statusDialog: false,
            Reservation: [],
            filter: '',
            columns: [
                { name: 'clientFullName', align: 'left', required: true, label: 'Full Name', field: 'clientFullName', sortable: true },
                { name: 'clientReserveDate', align: 'left', label: 'Client Date of Events', field: 'clientReserveDate', sortable: true },
                { name: 'clientReserveTime', align: 'left', label: 'Time', field: 'clientReserveTime', sortable: true },
                { name: 'status', label: 'Status' }
            ]
        }
    },
    methods: {
        setTask(){
          var reserveBago = {
            clientFullName: this.clientFullName,
            clientReserveDate: this.clientDate,
            clientReserveTime: this.clientTime,
            clientTotalDownPrice: this.clientTotalDownPrice,
            clientFirstName: this.clientFirstName,
            clientLastName: this.clientLastName,
            clientReserveEndTime: this.clientEndTime,
            clientEmailAdd: this.clientEmail,
            clientEventPlace: this.clientEventPlace,
            clientContact: this.clientNo,
            clientSelectEvent: this.clientEvent,
            clientTotalPackPrice: this.clientPackPrice,
            clientPaidAmount: this.clientPaidAmount,
            clientBalance: this.clientBalance,
            clientStatus: this.clientStatus,
            clientThisDayStatus: new Date(),
            clientThisDayStatus: date.formatDate(new Date(), 'YYYY-MM-DD hh:mmA')
            }
            console.log(reserveBago, 'adasda')
                this.$q.dialog({
                title: 'Update Status',
                message: 'Update This Status?',
                ok: 'Yes',
                cancel: 'Cancel'
            })
            .onOk(() => { 
                this.$firestoreApp.collection('StatusReserve').doc(this.statusId).set(reserveBago)
                this.$q.notify({
                        message: 'Status Updated!',
                        icon: 'mdi-update',
                        color: 'positive',
                        textColor: 'white',
                        position: 'center'
                    }) 
                    this.statusDialog = false
            })
        },
        openStatusDialog (props) {
          this.statusId = props['.key']
          this.clientFullName = props.clientFullName
          this.clientDate = props.clientReserveDate
          this.clientTime = props.clientReserveTime
          this.SelectedPackage = props.clientSelectPackage
          this.clientTotalDownPrice = props.clientTotalDownPrice
          this.clientThisDayReserve = props.clientThisDayReserve
          this.clientFirstName = props.clientFirstName
          this.clientLastName = props.clientLastName
          this.clientEndTime = props.clientReserveEndTime
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
          this.clientStatus = props.clientStatus
          this.statusDialog = true
        },
    },
    computed: {
        returnReservationStatus(){
        
        },
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
        orderBy(){
            let orderBy = this.$lodash.orderBy(this.Notify, ['id'], ['asc']);
            // console.log(optionss, 'opoopst')
                return orderBy
        },
        notification(){
                let optionss = this.orderBy.map(Notify => {
                    return {
                        label: Notify.notify,
                        value: Notify.notify
                        }
                })
                    return optionss
            },
        eventNow(){
                    let optionss = this.$lodash.filter(this.Reservation, m => {
                            m.clientStatus = []
                            return m.clientReserveDate == date.formatDate(new Date(), 'YYYY-MM-DD')
                            })
                            let orderBy = this.$lodash.orderBy(optionss, ['clientReserveTime'], ['asc']);
                        // console.log(optionss, 'opoopst')
                            return orderBy
            },
    },
    mounted() {
        this.$binding('Reservation', this.$firestoreApp.collection('Reservation'))
            .then(Reservation => {Reservation
            console.log(Reservation, 'Reservation')
        }),
        this.$binding('Notify', this.$firestoreApp.collection('Notify'))
            .then(Notify => {Notify
            console.log(Notify, 'Notify')
        })
    }
}
</script>
