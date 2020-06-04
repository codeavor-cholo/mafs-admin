<template>
    <q-page padding>
        <q-table title="" :data="City" :columns="columns" :filter="filter" row-key="name">
            <template v-slot:body="props">
                <q-tr :props="props">
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
            <q-btn fab icon="add" color="accent" @click="addCityDialog = true" />
            <q-tooltip>
                Add City
            </q-tooltip>
    </q-page-sticky>
    <!--dialog-->
    <q-dialog v-model="addCityDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">New City</div>
        </q-card-section>

        <q-card-section>
          <q-input class="q-ma-sm" v-model="cityName" label="City"/>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" @click="clear" v-close-popup />
          <q-btn flat label="Add Event" v-close-popup v-on:click="addCity" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!--Modal for upadate-->
    <q-dialog v-model="editDialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Edit City</div>
        </q-card-section>

        <q-card-section>
          <q-input  class="q-ma-sm" v-model="updateCity" label="City"/>
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
    data() {
        return {
            addCityDialog: false,
            editDialog: false,
            cityName: '',
            updateCity: '',
            City: [],
            filter: '',
            columns: [
                { name: 'city', required: true, label: 'City', align: 'left', field: 'city', sortable: true },
                { name: 'action', label: 'Action' }
            ]
        }
    },
    mounted () {
      this.$binding('City', this.$firestoreApp.collection('City'))
        .then(City => {
          console.log(City, 'City')
        })
    },
    methods: {
        clear(){
          this.cityName = ''
        },
        addCity(){
            var newCity = {
                city: this.cityName,
            }
            let optionss = this.$lodash.filter(this.City, m => {
                if(m.city === this.cityName){
                    return m
                }
            }) 
            if(this.event === '') {
              this.$q.dialog({
              title: 'Field Required!',
              message: 'Fill all Requirements?',
              ok: 'Ok',
              persistent: true
            }).onOk(()=>{
                this.addCityDialog = true
            })
            }else{
              if(optionss.length > 0){
                    this.$q.dialog({
                    title: 'Duplicate Entry!',
                    message: 'Unable to save?',
                    ok: 'Ok',
                    persistent: true
                    }).onOk(() => {
                        this.addCityDialog = true
                    })
              }else{
                    this.$q.dialog({
                    title: 'Add City',
                    message: 'Add This City?',
                    ok: 'Yes',
                    cancel: 'Cancel',
                    persistent: true
                }).onOk(() => { 
                    this.$firestoreApp.collection('City').add(newCity)
                    this.$q.notify({
                            message: 'City Added!',
                            icon: 'mdi-folder-plus-outline',
                            color: 'positive',
                            textColor: 'white',
                            position: 'center'
                        })
                        this.cityName = ''    
                }).onCancel(()=>{
                  this.addCityDialog = true
                })
              }
            }
        },
        openDeleteDialog (task) {
          var id = task['.key']
          this.$q.dialog({
            title: 'Delete City',
            message: 'Delete This City?',
            ok: 'Yes',
            cancel: 'Cancel'
            }).onOk(() => { 
                this.$firestoreApp.collection('City').doc(id).delete()
                this.$q.notify({
                        message: 'City Deleted!',
                        icon: 'mdi-delete',
                        color: 'negative',
                        textColor: 'white',
                        position: 'center'
                    })
            })
        },
        openEditDialog (task) {
          this.cityId = task['.key']
          this.updateCity = task.city
          this.editDialog = true
        },
        setTask(){
          var cityBago = {
            city: this.updateCity,
            }
            if(this.updateCity === ''){
             this.$q.dialog({
              title: 'Field Required!',
              message: 'Fill all Requirements?',
              ok: 'Ok',
              cancel: 'Cancel'
            })
            }else
                this.$q.dialog({
                title: 'Update City',
                message: 'Update This City?',
                ok: 'Yes',
                cancel: 'Cancel'
            }).onOk(() => { 
                this.$firestoreApp.collection('City').doc(this.cityId).set(cityBago)
                this.$q.notify({
                        message: 'City Updated!',
                        icon: 'mdi-update',
                        color: 'positive',
                        textColor: 'white',
                        position: 'center'
                    }) 
                    this.editDialog = false
            })
        }
    }
}
</script>