<template>
    <q-page padding>
        <div>
            <q-table title="With Pending Balance" :data="database" :columns="columns" :filter="filter" row-key="name" :pagination.sync="pagination" > 
                <template v-slot:body="props">
                    <q-tr :props="props">
                        <q-td key="clientName" :props="props">{{props.row.clientFullName}}</q-td>
                        <!-- <q-td key="clientPlace" :props="props">{{props.row.clientEventPlace}}</q-td> -->
                        <q-td key="clientDate" :props="props">{{props.row.clientReserveDate}}</q-td>
                        <q-td key="clientTime" :props="props">{{props.row.clientReserveTime}}</q-td>
                        <q-td key="clientPackage" :props="props">{{props.row.clientSelectEvent}}</q-td>
                        <!-- <q-td key="clientThisDayReserve" :props="props">{{props.row.clientThisDayReserve}}</q-td> -->
                        <q-td key="action" :props="props">
                        <q-btn dense class="q-ma-sm" color="primary" icon="mdi-pencil" @click="openReserveDialog(props.row)" label="View Reservation"></q-btn>
                        <q-btn dense class="q-ma-sm" color="primary" icon="mdi-pencil" @click="openStatusDialog(props.row)" label="View Payment"></q-btn>
                        <q-btn dense class="q-ma-sm" color="primary" icon="mdi-pencil" @click="openContractDialog(props.row)" label="View Contract"></q-btn>
                        <!-- <q-btn dense class="q-ma-sm" color="negative" icon="mdi-pencil" @click="openDeleteDialog(props.row)" label="Delete"></q-btn> -->
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
        <q-separator/>
        <div>
            <q-table title="Without Pending Balance" :data="wdatabase" :columns="columnss" :filter="filters" row-key="name" :pagination.sync="pagination" > 
                <template v-slot:body="props">
                    <q-tr :props="props">
                        <q-td key="clientName" :props="props">{{props.row.clientFullName}}</q-td>
                        <!-- <q-td key="clientPlace" :props="props">{{props.row.clientEventPlace}}</q-td> -->
                        <q-td key="clientDate" :props="props">{{props.row.clientReserveDate}}</q-td>
                        <q-td key="clientTime" :props="props">{{props.row.clientReserveTime}}</q-td>
                        <q-td key="clientPackage" :props="props">{{props.row.clientSelectEvent}}</q-td>
                        <!-- <q-td key="clientThisDayReserve" :props="props">{{props.row.clientThisDayReserve}}</q-td> -->
                        <q-td key="action" :props="props">
                        <q-btn dense class="q-ma-sm" color="primary" icon="mdi-pencil" @click="openReserveDialog(props.row)" label="View Reservation"></q-btn>
                        <q-btn dense class="q-ma-sm" color="primary" icon="mdi-pencil" @click="openStatusDialog(props.row)" label="View Payment"></q-btn>
                        <q-btn dense class="q-ma-sm" color="primary" icon="mdi-pencil" @click="openContractDialog(props.row)" label="View Contract"></q-btn>
                        <!-- <q-btn dense class="q-ma-sm" color="negative" icon="mdi-pencil" @click="openDeleteDialog(props.row)" label="Delete"></q-btn> -->
                        </q-td>  
                    </q-tr>
                </template>
                <template v-slot:top-right>
                    <q-input borderless dense debounce="300" v-model="filters" placeholder="Search">
                        <template v-slot:append>
                        <q-icon name="search" />
                        </template>
                    </q-input>
                </template>  
            </q-table>
        </div>
        
    <q-dialog v-model="cotractDialog" full-width full-height>
              <div class="shadow-0">
                <q-card>
                <q-page-sticky position="top-right" :offset="[18, 18]">
                        <div class="text-h6 bodyText"><q-btn flat label="Print" color="primary" @click="printNow" icon="print" /></div>
                    </q-page-sticky>
                <q-card-section class="row items-center">
                    <q-space />
                    <q-btn icon="close" class="bodyText" flat round dense v-close-popup>
                        <q-tooltip>
                            Cancel
                        </q-tooltip>
                    </q-btn>
                </q-card-section>
                <q-card-section>
                   
                    <div class="column items-center">
                    <img src="statics/bg/logogo.png" class="col q-ma-sm q-pa-sm" style="width:500px;height:100%">
                    <div style="font-size:10px" class="q-pa-sm">
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
                            <div class="col"><b>Client: {{this.clientFullName}} </b> </div>
                            <div class="col-4"><b>Date: {{this.clientDate}} </b> </div>
                            </div>
                            <br>
                            <div class="row">
                            <div class="col"><b>Venue: {{this.clientEventPlace}} </b> </div>
                            <div class="col-4"><b>Time: {{this.clientTime}} to {{this.clientEndTime}} </b> </div>
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
                                    <h6><b>{{this.clientEvent}}</b></h6>
                                </div>
                                <strong>
                                <div v-show="this.SelectedFood.length > 0">
                                    <q-item-label overline>&nbsp;Food To Serve</q-item-label>
                                    <q-item dense clickable v-ripple v-for="(s, index) in this.SelectedFood" :key="index">
                                        <q-item-section>
                                            <q-item-label style="margin-left: 50px" lines="1">{{s.foodName}}</q-item-label>
                                        </q-item-section>
                                    </q-item>
                                </div>
                                <div v-show="this.SelectedInc.length > 0">
                                    <q-item-label overline>&nbsp;Inclusion List</q-item-label>
                                    <q-item dense clickable v-ripple v-for="(h, index) in this.SelectedInc" :key="index">
                                        <q-item-section>
                                            <q-item-label style="margin-left: 50px" lines="1">{{h.setupOne}}</q-item-label>
                                        </q-item-section>
                                    </q-item>
                                </div>
                                <div v-show="this.SelectedAmeninties.length > 0">
                                    <q-item-label overline>&nbsp;Other Additional List</q-item-label>
                                    <q-item dense clickable v-ripple v-for="(n, index) in this.SelectedAmeninties" :key="index">
                                        <q-item-section>
                                            <q-item-label style="margin-left: 50px" lines="1">{{n.amenitiesNames}}</q-item-label>
                                        </q-item-section>
                                        <q-item-section>
                                            <q-item-label style="margin-left: 50px" lines="1">{{n.amenitiesQuantities}}</q-item-label>
                                        </q-item-section>
                                    </q-item>
                                </div>
                                <div v-show="this.SelectedServices.length > 0">
                                    <q-item dense clickable v-ripple v-for="(n, index) in this.SelectedServices" :key="index">
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
                                <strong>{{this.clientPax}} persons</strong><strong>&nbsp;for</strong>&nbsp;&nbsp;<strong>{{this.clientPackPrice}}php</strong>
                                </div>
                                <div class="q-ma-md row" style="margin-top: -10px">
                                    <strong>Paid Amount =</strong><strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{this.clientPaidAmount}}php</strong> 
                                </div>
                                <div class="q-ma-md row" style="margin-top: -10px" >
                                    <strong>Balance =</strong><strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{this.clientBalance}}php</strong>
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

                
                </div>
    </q-dialog>
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
            <div><strong>CANCELLATION AND RE-SCHEDULING WILL BE ENABLED 2-3 Days of your EVENTS</strong></div>
            </q-card-section>
            <q-card-section>
            <div style="float: left; width: 100%; clear:both">
                <div class="q-ma-sm row">
                <q-input class="q-ma-sm" v-show="hide" readonly label="Token" style="width: 200px" v-model="clientToken" />    
                <q-input class="q-ma-sm" v-show="hide" readonly label="clientReserveType" style="width: 200px" v-model="clientReserveType" />    
                <q-input class="q-ma-sm" v-show="hide" type="date" mask="YYYY-MM-DD" readonly label="Token" style="width: 200px" v-model="clientThisDayPaidPayment" />    
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
                        <q-btn @click="addCancelEvent" :disable="returnDisable(this.clientDate)" class="q-ma-sm" align="center" style="width: 400px; height: 50px" color="accent" label="CANCEL RESERVATION" icon="mdi-account-remove" />
                    </div>
                    <div>
                        <q-btn :disable="returnDisable(this.clientDate)" @click="reSched = true, clear()" class="q-ma-sm" align="center" style="width: 400px; height: 50px" color="accent" label="RE-SCHEDULE RESERVATION" icon="mdi-clock-outline" />
                    </div>
            </div>
            </q-card-section>
        </q-card>
    </q-dialog>

    <q-dialog v-model="customPayment" full-width>
        <q-card>
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
            <div class="text-h6">View Balance</div>
            </q-card-section>
            <q-card-section>
            <div style="float: left; width: 100%; clear:both">
                <div class="q-ma-sm row">
                
                <q-input class="q-ma-sm" v-show="hide" type="date" mask="YYYY-MM-DD" readonly label="Token" style="width: 200px" v-model="clientThisDayPaidPayment" />
                <q-input class="q-ma-sm" v-show="hide" readonly label="Total Down Payment" style="width: 200px" v-model="clientTotalDownPrice" />
                <q-input class="q-ma-sm" v-show="hide" readonly label="clientReserveType" style="width: 200px" v-model="clientReserveType" />    
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
            <div>
                <strong><b>Pay Balance</b></strong>
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
                <q-dialog v-model="reSched">
                    <q-card style="min-width: 1000px">
                        <q-card-section class="row items-center">
                        <div class="text-h6">Select Time and Date</div>
                        <q-space />
                        <q-btn @click="clear" icon="close" flat round dense v-close-popup>
                            <q-tooltip>
                                Cancel
                            </q-tooltip>
                        </q-btn>
                    </q-card-section>

                        <q-card-section>
                            <div class="q-gutter-md row items-start">
                                <q-date v-model="dates" @input="checkWedding()" mask="YYYY-MM-DD" :options="optionsFn" :events="eventsReserve" event-color="red" color="purple" />
                                <q-time mask="YYYY-MM-DD HH:mm:ss" v-model="datestime" :hour-options="hourOptions" @input="endtime" color="purple" style="margin-left: 30px" />
                                <q-input v-model="dates" mask="YYYY-MM-DD" filled type="date" label="Selected Date" readonly style="margin-left: 50px; margin-top: 50px" />
                                <q-input style="margin-top: 130px; margin-left: -180px" v-model="datestimeView" readonly label="Start time" />
                                <q-input style="margin-top: 200px; margin-left: -160px" v-model="datestimeEnd" readonly label="End time" />
                                <strong style="margin-top: 270px; margin-left: -175px; width: 200px; height: 40px">Disabled Dates Are Not Available</strong>
                                <strong class="q-badge bg-accent q-pa-sm" style="margin-top: 350px; margin-left: -200px; width: 200px; height: 40px">{{showAvailable}}</strong>
                            </div>
                        </q-card-section>

                        <q-card-actions align="right">
                        <q-btn flat @click="reschedevents" label="Re-schedule Events" color="primary" v-close-popup />
                        </q-card-actions>
                    </q-card>
                </q-dialog>
    </q-page>
</template>
<script>
import { date } from 'quasar'
export default {
    computed: {
        eventsReserve(){
            let events = this.$lodash.map(this.Reservation, a=>{
                let reserve = a.clientReserveDate
                return date.formatDate(reserve,'YYYY/MM/DD')
            })
            return events
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
        database(){
            let optionss = this.$lodash.filter(this.Reservation, m => {
						return m.clientBalance > 0
                    }) 
            let orderBy = this.$lodash.orderBy(optionss, ['clientReserveDate'], ['asc']);
            return orderBy
        },
        wdatabase(){
            let optionss = this.$lodash.filter(this.Reservation, m => {
						return m.clientBalance == 0
                    }) 
            let orderBy = this.$lodash.orderBy(optionss, ['clientReserveDate'], ['asc']);
            return orderBy
        }
    },
    data () {
        return {
            clientPayingAmount: 0,
            showAvailable: '',
            hourOptions: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, ],
            reSched: false,
            clientReserveType: '',
            clientThisDayPaidPayment: date.formatDate(new Date(), 'YYYY-MM-DD'),
            payDetails: [],
            clientToken: '',
            stripePayment: false,
            cashPayment: false,
            hide: false,
            emailAdd: '',
            SelectedPackage: [],
            clientTotalDownPrice: '',
            clientThisDayReserve: date.formatDate(new Date(), 'YYYY-MM-DD'),
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
            cashAmount: '',
            cotractDialog: false,
            Reservation: [],
            Terms: [],
            Mode: [],
            pagination: { sortBy: 'Category', descending: false, page: 1, rowsPerPage: 10},
            customPack: false,
            customPayment: false,
            filter: '',
            dates: date.formatDate(new Date(), 'YYYY-MM-DD'),
            //dates: new Date(),
            datestime: date.formatDate(new Date(), 'hh:mmA'),
            datestimeView: date.formatDate(new Date(), '00:00'),
            datestimeEnd: date.formatDate(new Date(), '00:00'),
            filters: '',
            columnss: [
                { name: 'clientName', required: true, label: 'Client Name', align: 'left', field: 'clientFullName', sortable: true },
                // { name: 'clientPlace', required: true, label: 'Event Place', align: 'left', field: 'clientEventPlace', sortable: true },
                { name: 'clientDate', required: true, label: 'Date', align: 'left', field: 'clientReserveDate', sortable: true },
                { name: 'clientTime', required: true, label: 'Time', align: 'left', field: 'clientReserveTime', sortable: true },
                { name: 'clientPackage', required: true, label: 'Event', align: 'left', field: 'clientSelectPackage.eventName', sortable: true },
                // { name: 'clientThisDayReserve', required: true, label: 'Reserve Day', align: 'left', field: 'clientThisDayReserve', sortable: true },
                { name: 'action', align: 'center', label: 'Action' }
            ],
            columns: [
                { name: 'clientName', required: true, label: 'Client Name', align: 'left', field: 'clientFullName', sortable: true },
                // { name: 'clientPlace', required: true, label: 'Event Place', align: 'left', field: 'clientEventPlace', sortable: true },
                { name: 'clientDate', required: true, label: 'Date', align: 'left', field: 'clientReserveDate', sortable: true },
                { name: 'clientTime', required: true, label: 'Time', align: 'left', field: 'clientReserveTime', sortable: true },
                { name: 'clientPackage', required: true, label: 'Event', align: 'left', field: 'clientSelectPackage.eventName', sortable: true },
                // { name: 'clientThisDayReserve', required: true, label: 'Reserve Day', align: 'left', field: 'clientThisDayReserve', sortable: true },
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
        clear(){
            this.dates = date.formatDate(new Date(), 'YYYY-MM-DD')
            //dates: new Date(),
            this.datestime = date.formatDate(new Date(), 'hh:mmA')
            this.datestimeView = date.formatDate(new Date(), '00:00')
            this.datestimeEnd = date.formatDate(new Date(), '00:00')

        },
            endtime(){
                // console.log(this.datestime, 'datestime')
                this.datestimeView = date.formatDate(this.datestime, 'hh:mmA')
                
                let newDate = new Date(this.datestime)
                // console.log('asd',this.datestimeView)
                newDate = date.addToDate(newDate, { hours: 5})
                // console.log('end',date.formatDate(new Date(newDate), 'hh:mmA'))
                this.datestimeEnd = date.formatDate(new Date(newDate), 'hh:mmA')
        },
        checkWedding(){
        // console.log(datess, 'datess')
        let dateBasis = date.formatDate(this.dates, 'YYYY-MM-DD')
        let map = this.$lodash.map(this.Reservation,a=>{
            //console.log(a.clientReserveDate)
            if(a.clientReserveDate == dateBasis){
                    if(a.clientSelectEvent !== 'Wedding'){
                        return {
                            eventCheck: 'OrdinaryOccasion',
                            selectEvent: a.clientSelectEvent,
                            reservation: a
                        }
                    } else {
                        return {
                        eventCheck: a.clientSelectEvent,
                        selectEvent: a.clientSelectEvent,
                        reservation: a
                    }
                    }
                } 
            })
            // console.log('map',map)
            let count = this.$lodash.countBy(map,'eventCheck')
            // console.log(count.OrdinaryOccasion, 'countsssssssss')
            // console.log('count',count)
            if(count.OrdinaryOccasion == 2){
                // console.log(count.OrdinaryOccasion, 'countsssssssss')
                // console.log("Wedding is not available on this Date") 
                this.showAvailable = "Wedding is not available on this Date"
                this.showWedding = false
            }else{
                this.showAvailable = "Wedding is available on this Date"
                this.showWedding = true
            }
        },
        optionsFn (datess) {
    let dateqw = new Date()
    let eventsOfTheDay = []
    let group = this.$lodash.filter(this.Reservation, a=>{

        let formatDate = date.formatDate(a.clientReserveDate, 'YYYY/MM/DD')    
        if(datess == formatDate){
            // console.log(datess,'may kaparehas')
            if(a.clientSelectEvent !== 'Wedding'){
                eventsOfTheDay.push({eventCheck: 'OrdinaryOccasion'})
                    // console.log(output)
                } else {
                    eventsOfTheDay.push({eventCheck: a.clientSelectEvent})
                }
            }
            })
            // console.log('eventsOftheDay',eventsOfTheDay)
            let count = this.$lodash.countBy(eventsOfTheDay,'eventCheck')
            // console.log('count',count)
            if(count.Wedding == 2){
                return false
            } else if (count.OrdinaryOccasion == 3){
                return false
            }else if (count.Wedding == 1 && count.OrdinaryOccasion == 1){
                return false
            }
            // console.log('group',group)
            let chuchu = date.formatDate(dateqw, 'YYYY/MM/DD')
            // console.log(datess > chuchu, 'datessssssss')
            if(datess >= chuchu){
                return true
            } 
            
            },
        returnDisable(dateReserve){
            let minus = date.subtractFromDate(dateReserve, { days: 1})
            console.log('minus',minus)
            let now = new Date()
            console.log(now,'now')
            if(date.formatDate(now, 'YYYY/MM/DD') == date.formatDate(minus, 'YYYY/MM/DD')){
                return true
            } else if(now > new Date(dateReserve)) {
                return true
            } else {
                return false
            }
            
        },
        openDeleteDialog (task) {
          // this.id = task['.key']
          // this.deleteFoodDialog = true
          // console.log(task, 'task')
          var id = task['.key']
          this.$q.dialog({
            title: 'Delete Amenities',
            message: 'Delete This Amenities?',
            ok: 'Yes',
            cancel: 'Cancel'
        }).onOk(() => { 
            this.$firestoreApp.collection('Reservation').doc(id).delete()
            this.$q.notify({
                    message: 'Amenities Deleted!',
                    icon: 'mdi-delete',
                    color: 'negative',
                    textColor: 'white',
                    position: 'center'
                })
        })

        },
        printNow(){
            window.print();
        },
        addCancelEvent(){
            var id = this.cancelID
            var cancelledEvents = {
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
                    clientPayDetails: this.payDetails,
                    clientTokenID: this.clientToken,
                    clientPaidAmount: this.clientPaidAmount,
                    clientThisDayCancelled: date.formatDate(new Date(), 'YYYY-MM-DD'),
                    clientThisDayPaidPayment: this.clientThisDayPaidPayment,
                    clientReserveType: this.clientReserveType,
                }
                    this.$q.dialog({
                    title: 'Cancel Reservation?',
                    message: 'Are you sure you want to cancel this Reservation???',
                    ok: 'Ok',
                    cancel: 'Cancel',
                    persistent: true
                    }).onOk(()=>{
                        this.$firestoreApp.collection('Cancelled').add(cancelledEvents)
                        this.$firestoreApp.collection('Reservation').doc(id).delete()
                        this.$q.notify({
                                message: 'Events Cancelled!',
                                icon: 'mdi-cancel',
                                color: 'negative',
                                textColor: 'white',
                                position: 'center'
                            })
                            this.customPack = false
                    }).onCancel(() => {

                    })
        },
        reschedevents(){
            var rsched = {
                clientFirstName: this.clientFirstName,
                clientLastName: this.clientLastName,
                clientFullName: this.clientFullName,
                clientEventPlace: this.clientEventPlace,
                clientPax: this.clientPax,
                clientEmailAdd: this.clientEmail,
                clientContact: this.clientNo,
                clientReserveDate: this.dates,
                clientThisDayReserve: date.formatDate(new Date(), 'YYYY-MM-DD'),
                clientReserveTime: date.formatDate(this.datestime, 'hh:mmA'),
                clientReserveEndTime: this.datestimeEnd,
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
                clientReserveType: this.clientReserveType,
                clientThisDayPaidPayment: this.clientThisDayPaidPayment
                }
                console.log(rsched, 'sched')
                    this.$q.dialog({
                    title: 'Are you sure you want to Reschedule This Event?',
                    message: 'Resched Events??',
                    ok: 'Yes',
                    cancel: 'Cancel'
                }).onOk(() => { 
                    this.$firestoreApp.collection('Reservation').doc(this.cancelID).set(rsched)
                    this.$firestoreApp.collection('Reschedule').add(rsched)
                    this.$q.notify({
                            message: 'Payment Updated!',
                            icon: 'mdi-update',
                            color: 'positive',
                            textColor: 'white',
                            position: 'center'
                        }) 
                        this.customPack = false
                        this.reSched = false
                })
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
                    this.$firestoreApp.collection('Reservation').doc(this.reserveId).set(reserveSobrangBago)
                    this.$q.notify({
                            message: 'Payment Updated!',
                            icon: 'mdi-update',
                            color: 'positive',
                            textColor: 'white',
                            position: 'center'
                        }) 
                        this.clientPayingAmount = 0
                        this.customPayment = false
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
                        this.customPayment = false
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
        openContractDialog (props) {
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
          this.cotractDialog = true
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
          this.clientThisDayPaidPayment = props.clientThisDayPaidPayment
          this.customPayment = true
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
          this.payDetails = props.clientPayDetails
          this.clientThisDayPaidPayment = props.clientThisDayPaidPayment
          this.clientReserveType = props.clientReserveType,
          this.customPack = true
        },
        openReserve (props) {
          this.selectedReservation = props 
        },
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