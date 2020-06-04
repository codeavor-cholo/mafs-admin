<template>
    <q-page padding>
        <q-table title="Finished Events" :data="eventNow" :columns="columns" :filter="filter" row-key="name">
            <template v-slot:body="props">
                    <q-tr>
                        <q-td key="clientFullName" :props="props">{{props.row.clientFullName}}</q-td>
                        <q-td key="clientReserveDate" :props="props">{{props.row.clientReserveDate}}</q-td>
                        <q-td key="clientReserveTime" :props="props">{{props.row.clientReserveTime}}</q-td>
                        <q-td key="clientReserveEndTime" :props="props">{{props.row.clientReserveEndTime}}</q-td>
                        <q-td key="status" :props="props">
                            <q-btn color="primary" label="Additional Time" icon="mdi-pencil" @click="openCustomDialog(props.row)"></q-btn>
                            <q-btn color="primary" label="View Payment" icon="mdi-pencil" @click="openStatusDialog(props.row)"></q-btn>
                            
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
        
        <q-dialog v-model="customPack" full-width>
        <q-card>
            <q-card-section class="row items-center">
                        <div class="text-h6">CANCELLATION AND RE-SCHEDULING OF EVENTS</div>
                        <q-space />
                        <q-btn icon="close" flat round dense v-close-popup>
                            <q-tooltip>
                                Cancel
                            </q-tooltip>
                        </q-btn>
                    </q-card-section>
            <q-card-section>
            <div class="text-h6">Additional Time ++</div>
            </q-card-section>
            <q-card-section>
            <div style="float: left; width: 100%; clear:both">
                <div class="q-ma-sm row">
                <q-input class="q-ma-sm" v-show="hide" readonly label="clientThisDayReserve" style="width: 200px" v-model="clientReserveType" />
                <q-input class="q-ma-sm" v-show="hide" readonly label="Token" style="width: 200px" v-model="clientToken" />        
                <q-input class="q-ma-sm" v-show="hide" type="date" mask="YYYY-MM-DD" readonly label="Token" style="width: 200px" v-model="clientThisDayPaidPayment" />    
                <q-input class="q-ma-sm" v-show="hide" readonly label="Total Down Payment" style="width: 200px" v-model="clientTotalDownPrice" />
                <q-input class="q-ma-sm" v-show="hide" readonly label="This Day Reserve" style="width: 200px" v-model="clientThisDayReserve" />
                <q-input class="q-ma-sm" v-show="hide" readonly label="First Name" style="width: 200px" v-model="clientFirstName" />
                <q-input class="q-ma-sm" v-show="hide" readonly label="Last Name" style="width: 200px" v-model="clientLastName" />
                <q-input class="q-ma-sm" readonly label="Full Name" style="width: 200px" v-model="clientFullName" />
                <q-input class="q-ma-sm" readonly type="date" mask="YYYY-MM-DD" label="Date of Events" v-model="clientDate" />
                <q-input class="q-ma-sm" readonly label="Time of Events" style="width: 100px" v-model="clientTime" />
                <!-- <q-input class="q-ma-sm" readonly label="End Time" style="width: 70px" v-model="clientEndTime" /> -->
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
                    <q-input class="q-ma-sm" rounded hint="Please Edit End Time for Additional Time" label="End Time" style="width: 500px" v-model="clientEndTime" />
                    <q-input @input="priceChange" class="q-ma-md" label="Package Price" suffix="Php" hint="Please Add The Payment of the client extra time" style="width: 500px" v-model="clientPackPrice" />
                    <q-input class="q-ma-md" readonly label="Amount Paid" suffix="Php" style="width: 90px" v-model="clientPaidAmount" />
                    <q-input class="q-ma-md" readonly label="Balance" suffix="Php" style="width: 90px" v-model="clientBalance" />
                    <div>
                        <q-btn @click="updateReserve" class="q-ma-sm" align="center" style="width: 400px; height: 50px" color="accent" label="UPDATE RESERVATION" icon="mdi-autorenew" />
                    </div>
            </div>
            </q-card-section>
        </q-card>
    </q-dialog>

        <q-dialog v-model="statusDialog" full-width>
        <q-card>
            <q-card-section class="row items-center">
            <div class="text-h6">View Balance</div>
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
                <q-input class="q-ma-sm" v-show="hide" readonly label="clientThisDayReserve" style="width: 200px" v-model="clientReserveType" />
                <q-input class="q-ma-sm" v-show="hide" readonly label="Total Down Payment" style="width: 200px" v-model="emailAdd" />
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
            <div style="float: left; width: 30%">
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
            <div class="q-ma-sm row" style="float: right; width: 65%;">
                    <q-card class="q-ma-sm row" style="width: 370px">
                        <q-input class="q-ma-md" readonly label="Package Price" suffix="Php" style="width: 90px" v-model="clientPackPrice" />
                        <q-input class="q-ma-md" readonly label="Amount Paid" suffix="Php" style="width: 90px" v-model="clientPaidAmount" />
                        <q-input class="q-ma-md" readonly label="Balance" suffix="Php" style="width: 90px" v-model="clientBalance" />
                        <div>
                            <q-btn v-show="this.clientBalance !== 0" @click="cashPayment = true" class="q-ma-sm" align="center" style="width: 345px; height: 50px" color="accent" label="CASH" icon="mdi-cash-multiple" />
                        </div>
                    </q-card>
                    <q-card class="q-ma-sm row" style="width: 360px">
                        <div>
                            <q-input hint="Please Enter Amount if using Card Payment" class="q-ma-sm" type="number" label="Enter Amount" suffix="Php" style="width: 250px" v-model="clientPayingAmount" />
                            <q-btn class="q-ma-sm" v-show="this.clientBalance !== 0" @click="openStripe" align="center" style="width: 345px; height: 50px" color="accent" label="CARD" icon="mdi-account-card-details" />
                        </div>
                    </q-card> 
            </div>
            </q-card-section>
        </q-card>
    </q-dialog>
        <q-dialog v-model="stripePayment">
        <q-card style="min-width: 800">
                    <q-card-section class="row items-center">
                        <div class="text-h6">Card Payment</div>
                        <q-space />
                        <q-btn icon="close" flat round dense v-close-popup>
                            <q-tooltip>
                                Cancel
                            </q-tooltip>
                        </q-btn>
                    </q-card-section>
                    <q-card-section>
                            <strong>Email:</strong>
                            <q-input v-model="emailAdd" type="email" prefix="Email:" suffix="@gmail.com" style="width: 500px; margin-bottom: 10px">
                                <template v-slot:prepend>
                                    <q-icon name="mail" />
                                </template>
                            </q-input>
                            <strong>Card Information:</strong>
                            <vue-stripe-elements outline color="teal" class="col-8 q-mx-md q-pa-md full-width" style="" ref="elementsRef" @token="tokenCreated" @loading="loading = $event"></vue-stripe-elements>
                            <q-btn outline color="teal" class="q-pa-sm col-3 full-width" size="md" @click="submit">PAY&nbsp;&nbsp;&nbsp;<b>PHP&nbsp;{{this.clientPayingAmount}}</b></q-btn>
                    </q-card-section>
        </q-card>
        </q-dialog>

        <q-dialog v-model="cashPayment">
        <q-card style="min-width: 400px">
            <q-card-section>
            <div class="text-h6">Cash Payment</div>
            </q-card-section>

            <q-card-section>
                    <q-input class="q-ma-md" readonly label="Package Price" suffix="Php" style="width: 90px" v-model="clientPackPrice" />
                    <q-input class="q-ma-md" readonly label="Amount Paid" suffix="Php" style="width: 90px" v-model="clientPaidAmount" />
                    <q-input class="q-ma-md" readonly label="Balance" suffix="Php" style="width: 90px" v-model="clientBalance" />
                    <div>
                        <q-input type="number" v-model="cashAmount" label="Enter Amount" />
                    </div>
            </q-card-section>

            <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Cancel" v-close-popup />
            <q-btn @click="setTask" label="Pay Balance" v-close-popup />
            </q-card-actions>
        </q-card>
        </q-dialog>
    </q-page>
</template>
<script>
import { date } from 'quasar'
export default {
    data(){
        return{
            clientPayingAmount: 0,
            clientPayDetails: [],
            clientToken: '',
            clientReserveType: '',
            emailAdd: '',
            amount: '',
            token: null,
            charge: null,
            SelectedPackage: [],
            clientTotalDownPrice: '',
            clientThisDayPaidPayment: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm:ssA'),
            clientThisDayReserve: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm:ssA'),
            hide: false,
            clientFirstName: '',
            clientLastName: '',
            cashAmount: 0, 
            cashPayment: false,
            stripePayment: false,
            clientBalance: 0,
            clientPaidAmount: 0,
            clientPackPrice: 0,
            SelectedAmeninties: [],
            SelectedServices: [],
            customPack: false,
            SelectedFood: [],
            SelectedInc: [],
            clientMotifDes: '',
            clientEvent: '',
            clientMotif: '',
            clientNo: '',
            clientEndTime: '',
            clientPax: '',
            clientEventPlace: '',
            clientEmail: '',
            group: [],
            status: false,
            clientTime: '',
            clientDate: date.formatDate(new Date(), 'YYYY-MM-DD'),
            clientFullName: '',
            statusDialog: false,
            Reservation: [],
            filter: '',
            columns: [
                { name: 'clientFullName', align: 'left', required: true, label: 'Full Name', field: 'clientFullName', sortable: true },
                { name: 'clientReserveDate', align: 'left', label: 'Client Date of Events', field: 'clientReserveDate', sortable: true },
                { name: 'clientReserveTime', align: 'left', label: 'Time', field: 'clientReserveTime', sortable: true },
                { name: 'clientReserveEndTime', align: 'left', label: 'End Time', field: 'clientReserveEndTime', sortable: true },
                { name: 'status', label: 'Pending Payment' }
            ]
        }
    },
    methods: {
        openStripe(){
            if(this.clientPayingAmount < 0 || this.clientPayingAmount == '' || this.clientPayingAmount < 1000){
                this.$q.dialog({
                    title: 'Unable To Continue',
                    message: 'Please Input atleast 1000php',
                    ok: 'Ok',
                })
            }else{
                this.stripePayment = true
            }
        },
        setTaskCard(){
          var reserveSobrangBago = {
            clientFirstName: this.clientFirstName,
            clientLastName: this.clientLastName,
            clientFullName: this.clientFullName,
            clientEventPlace: this.clientEventPlace,
            clientPax: this.clientPax,
            clientEmailAdd: this.clientEmail,
            clientContact: this.clientNo,
            clientReserveDate: this.clientDate,
            clientThisDayReserve: this.clientThisDayReserve,
            clientReserveTime: this.clientTime,
            clientReserveEndTime: this.clientEndTime,
            clientSelectEvent: this.clientEvent,
            clientTotalPackPrice: this.clientPackPrice,
            clientTotalDownPrice: this.clientTotalDownPrice,
            clientBalance: parseInt(this.clientBalance) - parseInt(this.clientPayingAmount),
            clientMotif: this.clientMotif,
            clientMotifDes: this.clientMotifDes,
            clientSelectPackage: this.SelectedPackage,
            clientFoodSelected: this.SelectedFood,
            clientPackInc: this.SelectedInc,
            clientAmenities: this.SelectedAmeninties,
            clientServices: this.SelectedServices,
            clientPayDetails: this.paydetails,
            clientTokenID: this.token.id,
            clientPaidAmount: parseInt(this.clientPaidAmount) + parseInt(this.clientPayingAmount),
            clientThisDayPaidPayment: date.formatDate(new Date(), 'YYYY-MM-DD'),
            clientReserveType: this.clientReserveType
            }
            console.log('reserves', reserveSobrangBago)
                this.$q.dialog({
                title: 'Update Payment',
                message: 'Update This Payment?',
                ok: 'Yes',
            }).onOk(() => { 
                this.$firestoreApp.collection('Reservation').doc(this.reserveId).set(reserveSobrangBago)
                this.$q.notify({
                        message: 'Payment Updated!',
                        icon: 'mdi-update',
                        color: 'positive',
                        textColor: 'white',
                        position: 'center'
                    }) 
                    this.clientPayingAmount = 0
                    this.statusDialog = false
                    this.stripePayment = false
            })
        },
        setTask(){
          var reserveBago = {
            clientFirstName: this.clientFirstName,
                clientLastName: this.clientLastName,
                clientFullName: this.clientFullName,
                clientEventPlace: this.clientEventPlace,
                clientPax: this.clientPax,
                clientEmailAdd: this.clientEmail,
                clientContact: this.clientNo,
                clientReserveDate: this.clientDate,
                clientThisDayReserve: this.clientThisDayReserve,
                clientReserveTime: this.clientTime,
                clientReserveEndTime: this.clientEndTime,
                clientSelectEvent: this.clientEvent,
                clientTotalPackPrice: this.clientPackPrice,
                clientTotalDownPrice: this.clientTotalDownPrice,
                clientBalance: parseInt(this.clientBalance) - parseInt(this.cashAmount),
                clientMotif: this.clientMotif,
                clientMotifDes: this.clientMotifDes,
                clientSelectPackage: this.SelectedPackage,
                clientFoodSelected: this.SelectedFood,
                clientPackInc: this.SelectedInc,
                clientAmenities: this.SelectedAmeninties,
                clientServices: this.SelectedServices,
                clientPayDetails: 'CASH',
                clientTokenID: 'CASH',
                clientPaidAmount: parseInt(this.clientPaidAmount) + parseInt(this.cashAmount),
                clientThisDayPaidPayment: date.formatDate(new Date(), 'YYYY-MM-DD'),
                clientReserveType: this.clientReserveType,
                }
                console.log(reserveBago, 'reserveBago')
                if(this.cashAmount === '' || this.cashAmount === 0){
                this.$q.dialog({
                title: 'Field Required!',
                message: 'Fill all Requirements?',
                ok: 'Ok',
                cancel: 'Cancel'
                })
                }else
                this.$q.dialog({
                title: 'Update Payment',
                message: 'Update This Payment?',
                ok: 'Yes',
                cancel: 'Cancel'
            }).onOk(() => { 
                this.$firestoreApp.collection('Reservation').doc(this.reserveId).set(reserveBago)
                this.$q.notify({
                        message: 'Payment Updated!',
                        icon: 'mdi-update',
                        color: 'positive',
                        textColor: 'white',
                        position: 'center'
                    }) 
                    this.statusDialog = false
                    this.cashPayment = false
            })
        },
        checkout () {
        this.$refs.checkoutRef.redirectToCheckout();
        },
        submit () {
        this.$refs.elementsRef.submit()
        },
        tokenCreated (token) {
        this.token = token;
        // for additional charge objects go to https://stripe.com/docs/api/charges/object
        console.log('token',this.token)
        this.charge = {
            source: token.card,
            amount: this.clientBalance,
        }
        this.sendTokenToServer(this.charge)
        },
        sendTokenToServer (charge) {
        // Send to server
        this.paydetails = charge
        console.log('charge',charge)
        this.setTaskCard()
        //this.emailer()
    },  
        updateReserve(){
            var updateRes = {
            clientFirstName: this.clientFirstName,
            clientLastName: this.clientLastName,
            clientFullName: this.clientFullName,
            clientEventPlace: this.clientEventPlace,
            clientPax: this.clientPax,
            clientEmailAdd: this.clientEmail,
            clientContact: this.clientNo,
            clientReserveDate: this.clientDate,
            clientThisDayReserve: this.clientThisDayReserve,
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
            clientPayDetails: this.clientPayDetails,
            clientTokenID: this.clientToken,
            clientPaidAmount: this.clientPaidAmount,
            clientReserveType: this.clientReserveType,
            clientThisDayPaidPayment: this.clientThisDayPaidPayment
            }
            console.log(updateRes, 'update')
                this.$q.dialog({
                title: 'Update Payment',
                message: 'Update This Payment?',
                ok: 'Yes',
                cancel: 'Cancel'
            }).onOk(() => { 
                this.$firestoreApp.collection('Reservation').doc(this.reserveId).set(updateRes)
                this.$q.notify({
                        message: 'Payment Updated!',
                        icon: 'mdi-update',
                        color: 'positive',
                        textColor: 'white',
                        position: 'center'
                    }) 
                    this.customPack = false
            })
        },
        openCustomDialog (props) {
          this.reserveId = props['.key']
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
          this.clientReserveType = props.clientReserveType
          this.clientThisDayPaidPayment = props.clientThisDayPaidPayment
          this.clientPayDetails = props.clientPayDetails
          this.customPack = true
        },
        openStatusDialog (props) {
          this.reserveId = props['.key']
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
          this.clientReserveType = props.clientReserveType
          this.clientPayDetails = props.clientPayDetails
          this.clientThisDayPaidPayment = props.clientThisDayPaidPayment
          this.statusDialog = true
        },
    },
    computed: {
        priceChange(){
            if(this.clientBalance === 0 ){
                this.clientPaidAmount = this.clientPackPrice
            }else{
                let balance = parseInt(this.clientPackPrice) - parseInt(this.clientPaidAmount)
                    this.clientBalance = balance
            }
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
        eventNow(){
                    let optionss = this.$lodash.filter(this.Reservation, m => {
                            return m.clientReserveDate < date.formatDate(new Date(), 'YYYY-MM-DD hh:mmA')
                        })
                            let orderBy = this.$lodash.orderBy(optionss, ['clientReserveDate'], ['desc']);
                        console.log(optionss, 'opoopst')
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
