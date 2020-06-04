<template>
        
    <q-page padding>
        <q-table
      title=""
      :data="Amenities"
      :columns="columns"
      :filter="filter"
      row-key="name"
    >
    <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="amenities" :props="props">{{props.row.amenitiesName}}</q-td>
          <q-td key="price" :props="props">{{props.row.price}}</q-td>
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
    <!-- FLOATING BUTTON -->
        <q-page-sticky position="top-left" :offset="[18, 18]">
            <q-btn fab icon="add" color="accent" @click="addAmenitiesDialog = true" />
            <q-tooltip>
                Add Amenities
            </q-tooltip>
          </q-page-sticky>
     <!--dialog-->     
      <q-dialog v-model="addAmenitiesDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">New Amenities</div>
        </q-card-section>

        <q-card-section>
          <q-input class="q-ma-sm" dense v-model="amenities" label="Amenities Name"/>
          <q-input class="q-ma-sm" type="number" dense v-model="price" label="Price"/>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" @click="clear" v-close-popup />
          <q-btn flat label="Add Amenities" v-close-popup v-on:click="addAmenities" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!--Modal for upadate-->
    <q-dialog v-model="editDialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Edit Event</div>
        </q-card-section>

        <q-card-section>
          <q-input class="q-ma-sm" dense v-model="updateAmenities" />
          <q-input class="q-ma-sm"  type="number" dense v-model="editAmenitiesPrice" />
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
    mounted () {
      this.$binding('Amenities', this.$firestoreApp.collection('Amenities'))
        .then(Amenities => {
          console.log(Amenities, 'Amenities')
        })
    },
    data () {
        return {
            price: 0,
            editAmenitiesPrice: 0,
            updateAmenities: '',
            editDialog: false,
            amenitiesName: '',
            Price: 0,
            addAmenitiesDialog: false,
            filter: '',
            Amenities: [],
            amenities: '',
            columns: [
        {
          name: 'amenities',
          required: true,
          label: 'Amenities',
          align: 'left',
          field: row => row.amenitiesName,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'price', align: 'center', label: 'Price', field: 'price', sortable: true },
        { name: 'action', label: 'Action' }
      ],
        }
    },
    methods: {
        clear(){
          this.amenities = ''
          this.price = 0
        },
        addAmenities () {
            var Amenitiesnew = {
                amenitiesName: this.amenities,
                price: this.price,
            }
            let optionss = this.$lodash.filter(this.Amenities, m => {
                if(m.amenitiesName === this.amenities){
                    return m
                }
            })
            if(this.amenities === '' || this.price === '' || this.price === 0 || this.price === '0' || this.price < 0) {
              this.$q.dialog({
              title: 'Field Required!',
              message: this.price < 0 ? 'price is negative value' : 'Fill all Requirements?',
              ok: 'Ok',
              persistent: true
            }).onOk(()=>{
              this.addAmenitiesDialog = true
            })
            }else{
                if(optionss.length > 0){
                    this.$q.dialog({
                    title: 'Duplicate Entry!',
                    message: 'Unable to save?',
                    ok: 'Ok',
                    persistent: true
                      }).onOk(() => {
                          this.addAmenitiesDialog = true
                      })
                    }else{
                        this.$q.dialog({
                        title: 'Add Amenities',
                        message: 'Add This Amenities?',
                        ok: 'Yes',
                        cancel: 'Cancel',
                        persistent: true
                        }).onOk(() => { 
                            this.$firestoreApp.collection('Amenities').add(Amenitiesnew)
                            this.$q.notify({
                                    message: 'Amenities Added!',
                                    icon: 'mdi-folder-plus-outline',
                                    color: 'positive',
                                    textColor: 'white',
                                    position: 'center'
                                })
                                this.amenities = '',
                                this.price = 0,
                                this.addAmenitiesDialog = false
                        }).onCancel(()=>{
                            this.addAmenitiesDialog = true
                        })
                    }
                }
        },
        setTask(){
          var amenitiesBago = {
            amenitiesName: this.updateAmenities,
            price: this.editAmenitiesPrice
            }
            if(this.updateAmenities === '' || this.editAmenitiesPrice === '0'){
             this.$q.dialog({
              title: 'Field Required!',
              message: 'Fill all Requirements?',
              ok: 'Ok',
              cancel: 'Cancel'
            })
            }else
            this.$q.dialog({
            title: 'Update Amenities',
            message: 'Update This Amenities?',
            ok: 'Yes',
            cancel: 'Cancel'
        }).onOk(() => { 
            this.$firestoreApp.collection('Amenities').doc(this.amenitiesId).set(amenitiesBago)
            this.$q.notify({
                    message: 'Amenities Updated!',
                    icon: 'mdi-update',
                    color: 'positive',
                    textColor: 'white',
                    position: 'center'
                }) 
                this.editDialog = false
        })
        },
        openEditDialog (task) {
          this.amenitiesId = task['.key']
          this.updateAmenities = task.amenitiesName
          this.editAmenitiesPrice = task.price
          this.editDialog = true
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
            this.$firestoreApp.collection('Amenities').doc(id).delete()
            this.$q.notify({
                    message: 'Amenities Deleted!',
                    icon: 'mdi-delete',
                    color: 'negative',
                    textColor: 'white',
                    position: 'center'
                })
        })

        },
        onSaveAmenities(row){
            let id = row['.key']
            this.$firestoreApp.collection('Amenities').doc(id).update({
                amenities: row.amenitiesName
            })
        }
    }
}
</script>