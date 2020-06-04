<template>
    <q-page padding>
        <q-table title="On Going Events" :data="eventNow" :columns="columns" :filter="filter" row-key="name">
            <template v-slot:body="props">
                    <q-tr>
                        <q-td key="clientFullName" :props="props">{{props.row.clientFullName}}</q-td>
                        <q-td key="clientReserveDate" :props="props">{{props.row.clientReserveDate}}</q-td>
                        <q-td key="clientReserveTime" :props="props">{{props.row.clientReserveTime}}</q-td>
                        <q-td key="clientReserveEndTime" :props="props">{{props.row.clientReserveEndTime}}</q-td>
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
            <q-card-section>
            <div class="text-h6">Edit Status</div>
            </q-card-section>

            <q-card-section>
            <q-input class="q-ma-sm" readonly dense v-model="clientFullName" />
            <q-input class="q-ma-sm" readonly type="date" dense v-model="clientDate" />
            <q-input class="q-ma-sm" readonly type="date" dense v-model="clientTime" />
                <q-option-group :options="notification" type="toggle" color="blue" v-model="group"/>
            </q-card-section>

            <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Cancel" v-close-popup />
            <q-btn flat label="Update"/>
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
            group: [],
            status: false,
            Notify: [],
            clientTime: '',
            clientDate: '',
            clientFullName: '',
            statusDialog: false,
            Reservation: [],
            filter: '',
            columns: [
                { name: 'clientFullName', align: 'left', required: true, label: 'Full Name', field: 'clientFullName', sortable: true },
                { name: 'clientReserveDate', align: 'left', label: 'Client Date of Events', field: 'clientReserveDate', sortable: true },
                { name: 'clientReserveTime', align: 'left', label: 'Time', field: 'clientReserveTime', sortable: true },
                { name: 'clientReserveEndTime', align: 'left', label: 'End Time', field: 'clientReserveEndTime', sortable: true },
                { name: 'status', label: 'Status' }
            ]
        }
    },
    methods: {
        openStatusDialog (props) {
          this.statusId = props['.key']
          this.clientFullName = props.clientFullName
          this.clientDate = props.clientReserveDate
          this.clientTime = props.clientReserveTime
          this.statusDialog = true
        },
    },
    computed: {
        notification(){
                let optionss = this.Notify.map(Notify => {
                    return {
                        label: Notify.notify,
                        value: Notify.notify
                    }
                })

                return optionss
            },
        eventNow(){
                    let optionss = this.$lodash.filter(this.Reservation, m => {
                            return m.clientReserveDate == date.formatDate(new Date(), 'YYYY-MM-DD')
                        })
                            let orderBy = this.$lodash.orderBy(optionss, ['clientReserveTime'], ['asc']);
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
