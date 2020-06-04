<template>
    <q-page padding>
        <q-table title="" :data="Brgy" :columns="columns" :filter="filter" row-key="name">
            <template v-slot:body="props">
                <q-tr :props="props">
                    <q-td key="brgy" :props="props">{{props.row.brgy}}</q-td>
                    <q-td key="city" :props="props">{{props.row.city}}</q-td>
                    <q-td key="action" :props="props">
                        <q-btn no-caps dense color="primary" icon="mdi-pencil" @click="openEditDialog(props.row)"></q-btn>
                        <q-btn no-caps icon="delete" dense color="negative" @click="openDeleteDialog(props.row)"></q-btn>
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
        <!--FLOATING BUTTON-->
        <q-page-sticky position="top-left" :offset="[18, 18]">
                <q-btn fab icon="add" color="accent" @click="addBrgyDialog = true" />
                <q-tooltip>
                    Add Brgy
                </q-tooltip>
        </q-page-sticky>
        <!--dialog-->
        <q-dialog v-model="addBrgyDialog" persistent>
            <q-card style="min-width: 400px">
                <q-card-section>
                    <div class="text-h6">New Barangay</div>
                </q-card-section>

                <q-card-section>
                    <q-input class="q-ma-sm" v-model="brgyName" label="Brgy."/>
                    <!-- <q-select class="q-ma-sm" filled v-model="selectCity" :options="cityOptions" label="City" emit-value map-options/> -->
                    <q-select clearable class="q-ma-sm" filled v-model="selectCity" use-input input-debounce="0" label="City" @filter="filterFn" :options="opt" behavior="menu" />
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                    <q-btn flat label="Cancel" v-close-popup />
                    <q-btn flat label="Add Brgy" v-close-popup v-on:click="addBrgy" />
                </q-card-actions>
            </q-card>
        </q-dialog>
            <!--Modal for upadate-->
        <q-dialog v-model="editDialog">
            <q-card style="min-width: 400px">
                <q-card-section>
                    <div class="text-h6">Edit Brgy</div>
                </q-card-section>

                <q-card-section>
                    <q-input  class="q-ma-sm" v-model="updateBrgy" label="Brgy"/>
                    <q-select class="q-ma-sm" v-model="updateCity" :options="cityOptions" filled label="City"/>
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                    <q-btn flat label="Cancel" v-close-popup />
                    <q-btn flat label="Update" @click="setTask"/>
                </q-card-actions>
            </q-card>
        </q-dialog>
    </q-page>
</template>
<script>
export default {
    data(){
        return {
            opt: this.cityOptions,
            brgyName: '',
            selectCity: '',
            updateBrgy: '',
            updateCity: '',
            addBrgyDialog: false,
            editDialog: false,
            City: [],
            Brgy: [],
            filter: '',
            columns: [
                { name: 'brgy', required: true, label: 'Brgy', align: 'left', field: 'brgy', sortable: true },
                { name: 'city', required: true, label: 'City', align: 'left', field: 'city', sortable: true },
                { name: 'action', label: 'Action' }
            ]
        }
    },
    mounted () {
      this.$binding('City', this.$firestoreApp.collection('City'))
        .then(City => {
          console.log(City, 'City')
        }),
       this.$binding('Brgy', this.$firestoreApp.collection('Brgy'))
        .then(Brgy => {
          console.log(Brgy, 'Brgy')
        })
    },
    computed:{
            cityOptions(){
                let options = this.City.map(City => {
                    return City.city
                })
                return options
            }
    },
    methods: {
        addBrgy(){
            var newBrgy = {
                brgy: this.brgyName,
                city: this.selectCity
            }
            if(this.brgyName === '' && this.selectCity === '') {
              this.$q.dialog({
              title: 'Field Required!',
              message: 'Fill all Requirements?',
              ok: 'Ok',
            })
            }else
                this.$q.dialog({
                title: 'Add Brgy',
                message: 'Add This Brgy?',
                ok: 'Yes',
            }).onOk(() => { 
                this.$firestoreApp.collection('Brgy').add(newBrgy)
                this.$q.notify({
                        message: 'Brgy Added!',
                        icon: 'mdi-folder-plus-outline',
                        color: 'positive',
                        textColor: 'white',
                        position: 'center'
                    })
                    this.brgyName = ''
                    this.selectCity = ''
            })
        },
        openDeleteDialog (task) {
          var id = task['.key']
          this.$q.dialog({
            title: 'Delete Brgy',
            message: 'Delete This Brgy?',
            ok: 'Yes',
            cancel: 'Cancel'
            }).onOk(() => { 
                this.$firestoreApp.collection('Brgy').doc(id).delete()
                this.$q.notify({
                        message: 'Brgy Deleted!',
                        icon: 'mdi-delete',
                        color: 'negative',
                        textColor: 'white',
                        position: 'center'
                    })
            })
        },
        openEditDialog (task) {
            this.brgyId = task['.key']
            this.updateBrgy = task.brgy
            this.updateCity = { label: task.city, value: task.city }
            this.editDialog = true
        },
        setTask(){
            var brgyBago = {
                brgy: this.updateBrgy,
                city: this.updateCity.value
            }
            if(this.updateBrgy === '' && this.updateCity === ''){
                this.$q.dialog({
                title: 'Field Required!',
                message: 'Fill all Requirements?',
                ok: 'Ok',
                cancel: 'Cancel'
                })
                }else
                this.$q.dialog({
                title: 'Update Brgy',
                message: 'Update This Brgy?',
                ok: 'Yes',
                cancel: 'Cancel'
            }).onOk(() => { 
                this.$firestoreApp.collection('Brgy').doc(this.brgyId).set(brgyBago)
                this.$q.notify({
                        message: 'Brgy Updated!',
                        icon: 'mdi-update',
                        color: 'positive',
                        textColor: 'white',
                        position: 'center'
                    })
                    this.editDialog = false  
            })  
        },
        filterFn (val, update) {
            if (val === '') {
                update(() => {
                this.opt = this.cityOptions
                })
                return update
            }

        update(() => {
                const needle = val.toLowerCase()
                this.opt = this.cityOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
            })
        }
    }
}
</script>