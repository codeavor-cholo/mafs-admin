<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
        >
          <q-icon name="menu" />
        </q-btn>
        <div class="desktop-only">
        <q-toolbar-title>
           Ma. Amelia Food Services
        </q-toolbar-title>
        </div>

        <div class="mobile-only">
        <q-toolbar-title>
           <div style="font-size:15px">Ma. Amelia Food Services</div>
        </q-toolbar-title>
        </div>

        <div class="desktop-only">
          <div>
            <q-btn flat color="white" round icon="email" class="q-ml-md">
              <q-badge color="red" floating>{{notifCount}}</q-badge>
                <q-menu>
                  <div v-show="this.eventListNow.length !== 0">
                    <q-item-label header><strong>List of Todays Event</strong></q-item-label>
                    <q-list padding v-for="(j, jindex) in eventListNow" :key="jindex">
                      <q-item clickable v-ripple>
                        <q-item-section top thumbnail class="q-ml-none">
                          <q-avatar>
                            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
                          </q-avatar>
                        </q-item-section>

                        <q-item-section>
                          <q-item-label>Client Name:{{j.clientFullName}}</q-item-label>
                          <q-item-label caption>Event Place:{{j.clientEventPlace}}</q-item-label>
                        </q-item-section>

                        <q-item-section side top>
                          <q-item-label caption><q-badge color="red">Event:{{j.clientSelectEvent}}</q-badge></q-item-label>
                          <q-item-label caption>Date of Event: {{j.clientReserveDate}}</q-item-label>
                          <q-item-label caption>Time of Event: {{j.clientReserveTime}}</q-item-label>
                        </q-item-section>
                        
                      </q-item>
                    </q-list>
                  </div>
                  <q-separator/>
                  <div v-show="this.cancelListNow.length !== 0">
                    <q-item-label header><strong>List of Todays Cancellation</strong></q-item-label>
                    <q-list padding v-for="(j, jindex) in cancelListNow" :key="jindex">
                      <q-item clickable v-ripple>
                        <q-item-section top thumbnail class="q-ml-none">
                          <q-avatar>
                            <q-icon size="40px" color="red" name="mdi-cancel" />
                          </q-avatar>
                        </q-item-section>

                        <q-item-section>
                          <q-item-label>Client Name:{{j.clientFullName}}</q-item-label>
                          <q-item-label caption>Event Place:{{j.clientEventPlace}}</q-item-label>
                        </q-item-section>

                        <q-item-section side top>
                          <q-item-label caption><q-icon color="red" name="mdi-alert" /><q-badge color="red">Event:{{j.clientSelectEvent}}</q-badge></q-item-label>
                          <q-item-label caption>Date of Event: {{j.clientReserveDate}}</q-item-label>
                          <q-item-label caption>Time of Event: {{j.clientReserveTime}}</q-item-label>
                        </q-item-section>
                        
                      </q-item>
                    </q-list>
                  </div>
                  <q-separator/>
                  <div v-show="this.onlineListreserve.length !== 0">
                    <q-item-label header><strong>List of Today's Reservation</strong></q-item-label>
                      <q-list padding v-for="(h, index) in onlineListreserve" :key="index">
                        <q-item clickable v-ripple>
                          <q-item-section>
                            <q-item-label>Name:{{h.clientFullName}}</q-item-label>
                            <q-item-label caption lines="2">Event: {{h.clientSelectEvent}}. Place: {{h.clientEventPlace}}.</q-item-label>
                          </q-item-section>

                          <q-item-section side top>
                            <q-item-label caption>{{h.clientReserveDate}}</q-item-label>
                            <q-item-label caption>{{h.clientReserveTime}}</q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-separator/>
                      </q-list>
                  </div>
                  <q-separator/>
                  <div v-show="this.todayListPaid.length !== 0">
                      <q-item-label header><strong>List of Today's Settled Payment</strong></q-item-label>
                        <q-list padding v-for="(h, index) in todayListPaid" :key="index">
                          <q-item clickable v-ripple>
                            <q-item-section>
                              <q-item-label>Name:{{h.clientFullName}}</q-item-label>
                              <q-item-label caption lines="2">Event: {{h.clientSelectEvent}}. Place: {{h.clientEventPlace}}.</q-item-label>
                            </q-item-section>

                            <q-item-section side top>
                              <q-item-label caption>{{h.clientReserveDate}}</q-item-label>
                              <q-item-label caption>{{h.clientReserveTime}}</q-item-label>
                            </q-item-section>
                          </q-item>
                          <q-separator/>
                        </q-list>
                  </div>
                  <q-btn class="full-width" style="position: sticky; bottom: 0; position: -webkit-sticky;" color="gray" text-color="black" label="See All Notification" />
                </q-menu>
            </q-btn>
          </div>
          <div class="fixed-right q-pt-sm">
            <div>
                <q-btn flat color="flat" icon="mdi-settings">
                  <q-menu>
                    <div class="row no-wrap q-pa-md">
                      <div class="column items-center">
                        <!-- <div class="text-subtitle1 q-mt-md q-mb-xs">{{email}}</div> -->
                        <q-btn color="primary" label="Logout" @click="logout" push size="sm" v-close-popup/>
                      </div>
                    </div>
                  </q-menu>
                </q-btn>
            </div>
          </div>
    </div>
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
            <div class="text-h6">View Balance</div>
            </q-card-section>
            <q-card-section>
            <div style="float: left; width: 100%; clear:both">
                <div class="q-ma-sm row">
                <q-input class="q-ma-sm" v-show="hide" readonly label="Token" style="width: 200px" v-model="clientToken" />    
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
            </div>
            </q-card-section>
        </q-card>
    </q-dialog>

    <div class="mobile-only">
      <div class="fixed-right q-pt-sm">
          <q-btn flat color="white" icon="mdi-settings">
      <q-menu>
        <div class="row no-wrap q-pa-md">
          <div class="column items-center">
            <!-- <div class="text-subtitle1 q-mt-md q-mb-xs">{{email}}</div> -->
             <q-btn color="primary" label="Logout" @click="logout" push size="sm" v-close-popup/>
          </div>
        </div>
      </q-menu>
    </q-btn>
    </div>
    </div>
        <!-- <div><q-btn rounded color="negative" class="block" icon="exit_to_app" label="Logout" @click="logout" /></div> -->
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-2"
    >
      <q-list bordered class="rounded-borders">
        <q-item clickable @click="$router.push('/home')">
          <q-item-section>
            <div class="row">
              <q-avatar size="70px">
              </q-avatar>
              <strong style="margin-top: 15px; margin-left: 10px">{{foodEditDishType.accountFirstName}}&nbsp;{{foodEditDishType.accountLastName}}</strong>
            </div>  
          </q-item-section>
        </q-item>

        <q-item clickable @click="$router.push('/home')" v-show="accountLoggedIn.userAccess.userWalkIn === true">
          <q-item-section avatar>
            <q-icon name="mdi-walk" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Walk-In Reservation</q-item-label>
            <q-item-label caption>Reservation</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable :to="{ name: 'todos' }" v-show="accountLoggedIn.userAccess.userDashboard">
          <q-item-section avatar>
            <q-icon name="mdi-view-dashboard" />
          </q-item-section>
          <q-item-section>
            <q-item-label>DashBoard</q-item-label>
            <q-item-label caption>Dash Board</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable :to="{ name: 'todayReserve' }" v-show="accountLoggedIn.userAccess.userTodayReserve">
          <q-item-section avatar>
            <q-icon name="mdi-calendar-star" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Today's Reservation</q-item-label>
            <q-item-label caption>Today's Reservation</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable :to="{ name: 'reserve' }" v-show="accountLoggedIn.userAccess.userReservation">
          <q-item-section avatar>
            <q-icon name="mdi-account-clock" />
          </q-item-section>
          <q-item-section>
            <q-item-label>My Reservation List</q-item-label>
            <q-item-label caption>Reservation</q-item-label>
          </q-item-section>
        </q-item>
        
        <q-item clickable :to="{ name: 'cancelEvent' }" v-show="accountLoggedIn.userAccess.userCancelEvents" >
          <q-item-section avatar>
            <q-icon name="mdi-cancel" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Cancelled Events</q-item-label>
            <q-item-label caption>Cancelled Events</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable :to="{ name: 'todayEvent' }" v-show="accountLoggedIn.userAccess.userEventsToday" >
          <q-item-section avatar>
            <q-icon name="mdi-calendar-star" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Today's Event</q-item-label>
            <q-item-label caption>Today's Event</q-item-label>
          </q-item-section>
        </q-item>
        
        <q-item clickable :to="{ name: 'finishedEvent' }" v-show="accountLoggedIn.userAccess.userFinishedEvent">
          <q-item-section avatar>
            <q-icon name="mdi-calendar-multiple-check" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Finished Event</q-item-label>
            <q-item-label caption>Finished Event</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable :to="{ name: 'paidEvents' }" v-show="accountLoggedIn.userAccess.userSettledPayment">
          <q-item-section avatar>
            <q-icon name="mdi-cash-multiple" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Settled Payments</q-item-label>
            <q-item-label caption>Settled Payments</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable :to="{ name: 'calendar' }" v-show="accountLoggedIn.userAccess.userCalendar">
          <q-item-section avatar>
            <q-icon name="mdi-calendar" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Calendar</q-item-label>
            <q-item-label caption>Calendar</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable :to="{ name: 'assignedEvent' }" v-show="accountLoggedIn.userAccess.userAssignedReserve">
          <q-item-section avatar>
            <q-icon name="mdi-calendar-edit" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Assigned Event</q-item-label>
            <q-item-label caption>Assigned Event</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable :to="{ name: 'maps' }" v-show="accountLoggedIn.userAccess.userMaps">
          <q-item-section avatar>
            <q-icon name="mdi-map" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Maps</q-item-label>
            <q-item-label caption>Maps</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable :to="{ name: 'placeTrack' }" v-show="accountLoggedIn.userAccess.userPlaceTracker">
          <q-item-section avatar>
            <q-icon name="mdi-map-marker-radius" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Place/Status</q-item-label>
            <q-item-label caption>Place/Status</q-item-label>
          </q-item-section>
        </q-item>

        <!-- <q-expansion-item
        expand-separator
        icon="mdi-settings-outline"
        label="File Management"
        caption="Settings"
      > -->
        <q-expansion-item
        expand-separator
        icon="mdi-settings-outline"
        label="File Management"
        caption="Settings"
        default-opened
      >
            <q-expansion-item style="margin-left: -50px" switch-toggle-side dense-toggle icon="receipt" label="Package Management" :header-inset-level="1" :content-inset-level="2" v-show="accountLoggedIn.userAccess.userPackManage">
                        <q-item clickable @click="$router.push('/motif')" >
                          <q-item-section avatar>
                            <q-icon name="mdi-border-color" />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>Motif</q-item-label>
                            <q-item-label caption>motif</q-item-label>
                          </q-item-section>
                        </q-item>

                  <q-item clickable @click="$router.push('/events')">
                    <q-item-section avatar>
                      <q-icon name="mdi-calendar-multiple" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Events</q-item-label>
                      <q-item-label caption>events</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item clickable @click="$router.push('dish')">
                    <q-item-section avatar>
                      <q-icon name="mdi-food" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Dish Type</q-item-label>
                      <q-item-label caption>Dish Type</q-item-label>
                    </q-item-section>
                  </q-item>
                  
                  <q-item clickable @click="$router.push('/category')">
                    <q-item-section avatar>
                      <q-icon name="mdi-playlist-edit" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Food Type</q-item-label>
                      <q-item-label caption>food type</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item clickable @click="$router.push('dishprice')">
                    <q-item-section avatar>
                      <q-icon name="mdi-currency-usd" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Package Pricing</q-item-label>
                      <q-item-label caption>Package Pricing</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item clickable @click="$router.push('food')">
                    <q-item-section avatar>
                      <q-icon name="mdi-food" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Food Name</q-item-label>
                      <q-item-label caption>Food Name</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item clickable @click="$router.push('packages')">
                    <q-item-section avatar>
                      <q-icon name="mdi-package" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Packages</q-item-label>
                      <q-item-label caption>Event Packages</q-item-label>
                    </q-item-section>
                  </q-item>
            </q-expansion-item>
       
        <q-expansion-item style="margin-left: -50px" switch-toggle-side dense-toggle icon="mdi-table-plus" label="Inclusion Management" :header-inset-level="1" :content-inset-level="2" v-show="accountLoggedIn.userAccess.userIncManage">
                <q-item clickable @click="$router.push('/amenities')">
                  <q-item-section avatar>
                    <q-icon name="mdi-silverware-spoon" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Amenities</q-item-label>
                    <q-item-label caption>Amenities</q-item-label>
                  </q-item-section>
                </q-item>

                <!-- <q-item clickable @click="$router.push('/manpower')">
                  <q-item-section avatar>
                    <q-icon name="mdi-human-male-male" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Man Power</q-item-label>
                    <q-item-label caption>Staff</q-item-label>
                  </q-item-section>
                </q-item> -->

                <q-item clickable @click="$router.push('/services')">
                  <q-item-section avatar>
                    <q-icon name="mdi-room-service" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Services</q-item-label>
                    <q-item-label caption>Services</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable @click="$router.push('/setup')">
                  <q-item-section avatar>
                    <q-icon name="mdi-circle-edit-outline" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Setup</q-item-label>
                    <q-item-label caption>Setup</q-item-label>
                  </q-item-section>
                </q-item>
        </q-expansion-item>

        <q-expansion-item style="margin-left: -50px" switch-toggle-side dense-toggle icon="mdi-account" label="Account Management" :header-inset-level="1" :content-inset-level="2" >
                <q-item clickable @click="$router.push('/position')">
                  <q-item-section avatar>
                    <q-icon name="mdi-account-plus" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Position</q-item-label>
                    <q-item-label caption>Position</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable @click="$router.push('/account')">
                  <q-item-section avatar>
                    <q-icon name="mdi-account-plus" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Create Account</q-item-label>
                    <q-item-label caption>Create Account</q-item-label>
                  </q-item-section>
                </q-item>
        </q-expansion-item>
        
        <q-expansion-item style="margin-left: -50px" switch-toggle-side dense-toggle icon="mdi-city" label="Other Management" :header-inset-level="1" :content-inset-level="2" v-show="accountLoggedIn.userAccess.userOtherManage">
                <!-- <q-item clickable @click="$router.push('/brgy')">
                  <q-item-section avatar>
                    <q-icon name="mdi-bank-plus" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Barangay</q-item-label>
                    <q-item-label caption>Barangay</q-item-label>
                  </q-item-section>
                </q-item> -->

                <q-item clickable @click="$router.push('/city')">
                  <q-item-section avatar>
                    <q-icon name="mdi-bank-plus" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>City</q-item-label>
                    <q-item-label caption>City</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable @click="$router.push('/gallery')">
                  <q-item-section avatar>
                    <q-icon name="mdi-folder-image" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Gallery</q-item-label>
                    <q-item-label caption>Gallery</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable @click="$router.push('/notify')">
                  <q-item-section avatar>
                    <q-icon name="mdi-folder-image" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Notification Status</q-item-label>
                    <q-item-label caption>Status</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable @click="$router.push('/terms')">
                  <q-item-section avatar>
                    <q-icon name="mdi-folder-image" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Terms And Condition</q-item-label>
                    <q-item-label caption>Term And Condition</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable @click="$router.push('/paymentMode')">
                  <q-item-section avatar>
                    <q-icon name="mdi-folder-image" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Mode of Payment</q-item-label>
                    <q-item-label caption>Mode of Payment</q-item-label>
                  </q-item-section>
                </q-item>
        </q-expansion-item>
        </q-expansion-item>

        <q-expansion-item
        expand-separator
        icon="mdi-book-open-outline"
        label="Mafs Reports"
        caption="Settings"
        default-opened
        v-show="accountLoggedIn.userAccess.userReports"
      >
        <q-item clickable @click="$router.push('/reportsClient')">
                  <q-item-section avatar>
                    <q-icon name="mdi-account" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Clients Reports</q-item-label>
                    <q-item-label caption>Clients Reports</q-item-label>
                  </q-item-section>
                </q-item>
        
        <q-item clickable @click="$router.push('/reportsReservation')">
                  <q-item-section avatar>
                    <q-icon name="mdi-book-plus" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Reservation Reports</q-item-label>
                    <q-item-label caption>Reservation Reports</q-item-label>
                  </q-item-section>
                </q-item>

        <q-item clickable @click="$router.push('/reportsFood')">
                  <q-item-section avatar>
                    <q-icon name="mdi-food" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Food Reports</q-item-label>
                    <q-item-label caption>Food Reports</q-item-label>
                  </q-item-section>
                </q-item>

        
        <q-item clickable @click="$router.push('/reportsCancelled')">
                  <q-item-section avatar>
                    <q-icon name="mdi-cancel" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Cancelled Events Reports</q-item-label>
                    <q-item-label caption>Cancelled Events Reports</q-item-label>
                  </q-item-section>
                </q-item>
        
        <q-item clickable @click="$router.push('/reportsEvent')">
                  <q-item-section avatar>
                    <q-icon name="event" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Events Reports</q-item-label>
                    <q-item-label caption>Events Reports</q-item-label>
                  </q-item-section>
        </q-item>

        <q-item clickable @click="$router.push('/reportsclientReserve')">
                  <q-item-section avatar>
                    <q-icon name="mdi-account" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Client Reservation Reports</q-item-label>
                    <q-item-label caption>Client Reservation Reports</q-item-label>
                  </q-item-section>
        </q-item>

        <q-item clickable @click="$router.push('/reportsBalance')">
                  <q-item-section avatar>
                    <q-icon name="mdi-account" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Balance Reports</q-item-label>
                    <q-item-label caption>Balance Reports</q-item-label>
                  </q-item-section>
        </q-item>

        <q-item clickable @click="$router.push('/reportsPaid')">
                  <q-item-section avatar>
                    <q-icon name="mdi-account" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Total Payments Reports</q-item-label>
                    <q-item-label caption>Total Payments Reports</q-item-label>
                  </q-item-section>
        </q-item>
      </q-expansion-item>

      </q-list>
      
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'
import firebase from 'firebase'
import { date } from 'quasar'

export default {
  name: 'MyLayout',
  data () {
    return {
            
            hide: false,
            clientToken: '',
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
            customPack: false,
            leftDrawerOpen: false,
            Accounts: [],
            Reservation: [],
            selectedAccountPic: [],
            accountLoggedIn: [],
            Cancelled: []
    }
  },
  mounted () {
        this.$binding('Accounts', this.$firestoreApp.collection('Accounts'))
            .then(Accounts => {
            console.log(Accounts, 'Accounts')
            }),
        this.$binding('Reservation', this.$firestoreApp.collection('Reservation'))
            .then(Reservation => {
            console.log(Reservation, 'Reservation')
            }),
        this.$binding('Cancelled', this.$firestoreApp.collection('Cancelled'))
            .then(Cancelled => {
            console.log(Cancelled, 'Cancelled')
            })
  },
  methods: {
    logout(){
      this.$q.dialog({
                title: `Are you sure you want to logout?`,
                type: 'negative',
                color: 'negative',
                textColor: 'white',
                icon: 'warning',
                ok: 'Ok',
                cancel: 'Cancel'
                
            }).onOk(()=>{
                    this.$q.loading.show({
                  message: 'Some important <b>process</b> is in progress.<br/><span class="text-primary">Hang on...</span>'
                  })
                  this.timer = setTimeout(() => {
                  this.$q.loading.hide()
                  this.timer = void 0
                  }, 2000)  
                  // hiding in 3s  
                    this.$firebase.auth().signOut()
                    .then(() => {
                    this.$router.push('/')
                  })
            })
            
    }
  },
    created(){


      let self = this
      this.$firebase.auth().onAuthStateChanged(function(user){
        console.log('createdUser', user)
        if(user){
          
          var accountRef = self.$firestoreApp.collection('Accounts')

          var query = accountRef.where('accountEmailAdd',"==",user.email)

          query.get()
              .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                  
                  let data = {...doc.data()}
                  delete data.__index
                  self.accountLoggedIn = data
                  console.log('data',data)
                })
              })
              .catch(function(error) {
                 console.log("error",error)
              })
                      
          self.$router.push('/home')
        }else{
          self.$router.push('/')
        }
      })
    },
  computed:{
    notifCount(){
        let pricePH = this.$lodash.sum([parseInt(this.cancelNow),parseInt(this.eventNow),parseInt(this.todayreserve),parseInt(this.todayPaid)])
        // console.log(pricePH, 'price')
        return pricePH
    },
    cancelNow(){
                    let optionss = this.$lodash.filter(this.Cancelled, m => {
                            return m.clientThisDayCancelled == date.formatDate(new Date(), 'YYYY-MM-DD')
                        })
                              return optionss.length
    },
    cancelListNow(){
                    let optionss = this.$lodash.filter(this.Cancelled, m => {
                            return m.clientThisDayCancelled == date.formatDate(new Date(), 'YYYY-MM-DD')
                        })
                              return optionss
    },
    eventNow(){
                    let optionss = this.$lodash.filter(this.Reservation, m => {
                            return m.clientReserveDate == date.formatDate(new Date(), 'YYYY-MM-DD')
                        })
                              return optionss.length
                            
            },
    eventListNow(){
                    let optionss = this.$lodash.filter(this.Reservation, m => {
                            return m.clientReserveDate == date.formatDate(new Date(), 'YYYY-MM-DD')
                        })
                              return optionss
                            
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
    todayreserve(){
      let optionss = this.$lodash.filter(this.Reservation, m => {
						return date.formatDate(m.clientThisDayReserve, 'YYYY-MM-DD') == date.formatDate(new Date(), 'YYYY-MM-DD')
                    }) 
                if(optionss.length === 0){
                    return 0
                }else{
                  return optionss.length
                }
    },
    todayPaid(){
      let optionss = this.$lodash.filter(this.Reservation, m => {
						return date.formatDate(m.clientThisDayPaidPayment, 'YYYY-MM-DD') == date.formatDate(new Date(), 'YYYY-MM-DD') && m.clientBalance == 0
                    }) 
                  return optionss.length
    },
    todayListPaid(){
      let optionss = this.$lodash.filter(this.Reservation, m => {
						return date.formatDate(m.clientThisDayPaidPayment, 'YYYY-MM-DD') == date.formatDate(new Date(), 'YYYY-MM-DD') && m.clientBalance == 0
                    })
                    return optionss
    },
    onlinereserve(){
      let optionss = this.$lodash.filter(this.Reservation, m => {
						return m.clientThisDayReserve == date.formatDate(new Date(), 'YYYY-MM-DD')
                    }) 
                  return optionss.length
    },
    onlineListreserve(){
      let optionss = this.$lodash.filter(this.Reservation, m => {
						return m.clientThisDayReserve == date.formatDate(new Date(), 'YYYY-MM-DD')
                    }) 
                    return optionss
    },
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
  }
}
</script>

<style>
</style>
