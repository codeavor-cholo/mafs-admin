<template>
    <q-page padding>
        <!--TaBLE-->
        <q-table
      title=""
      :data="Services"
      :columns="columns"
      :filter="filter"
      row-key="name"
    >
    <!-- v-for="(foodName, index) in Food" :key="index" -->
    <template v-slot:body="props">
        <q-tr :props="props">
            <!-- <q-td key="name" :props="props" >
            {{ props.row.foodName }}
            <q-popup-edit v-model="props.row.foodName" title="Edit the Name">
              <q-input v-model="props.row.foodName" dense autofocus counter />
            </q-popup-edit> -->
          <!-- </q-td> -->
          <q-td key="servicesName" :props="props">{{props.row.servicesName}}</q-td>
          <q-td key="servicesPrice" :props="props">{{props.row.servicesPrice}}</q-td>
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
        <q-btn fab icon="add" color="accent" @click="addServicesDialog = true" />
          <q-tooltip>
            Add Service/s
          </q-tooltip>
        </q-page-sticky>

        <!--Modal For add Food-->
    <q-dialog v-model="addServicesDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">New Services</div>
        </q-card-section>

        <q-card-section>
          <q-input class="q-ma-sm" dense v-model="servicesName" label="Services Name" />
          <q-input class="q-ma-sm" type="number" dense v-model="servicesPrice" label="Services Price" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" @click="clear" v-close-popup />
          <q-btn flat label="Add Services" v-close-popup v-on:click="addServices" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    
    <!--Modal for upadate-->
    <q-dialog v-model="editDialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Edit Task</div>
        </q-card-section>

        <q-card-section>
          <q-input class="q-ma-sm" dense v-model="editServicesName" />
          <q-input class="q-ma-sm"  type="number" dense v-model="editServicesPrice" />
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
    //--------------------------------------------------
    mounted () {
            this.$binding('Services', this.$firestoreApp.collection('Services'))
            .then(Services => {
            console.log(Services, 'Services')
        })
        },
    //--------------------------------------------------   
    methods: {
        clear(){
          this.servicesName = ''
          this.servicesPrice = 0
        },
        addServices () {
            var services = {
                servicesName: this.servicesName,
                servicesPrice: this.servicesPrice
            }
            let optionss = this.$lodash.filter(this.Services, m => {
                if(m.servicesName === this.servicesName){
                    return m
                }
            })
            if(this.servicesName === '' || this.servicesPrice === '' || this.servicesPrice === '0' || this.servicesPrice === 0 || this.servicesPrice < 0 ){
              this.$q.dialog({
              title: 'Field Required!',
              message: this.servicesPrice < 0 ? 'price is negative value' : 'Fill all Requirements?',
              ok: 'Ok',
              persistent: true
            }).onOk(()=>{
              this.addServicesDialog = true
            })
            }else{
              if(optionss.length > 0){
                    this.$q.dialog({
                    title: 'Duplicate Entry!',
                    message: 'Unable to save?',
                    ok: 'Ok',
                    persistent: true
                    }).onOk(() => {
                        this.addServicesDialog = true
                    })
                    }else{      
                    this.$q.dialog({
                    title: 'Add Service?',
                    message: 'Add This Service??',
                    ok: 'Yes',
                    cancel: 'Cancel',
                    persistent: true
                }).onOk(() => { 
                    this.$firestoreApp.collection('Services').add(services)
                    this.$q.notify({
                            message: 'Service Added!',
                            icon: 'mdi-folder-plus-outline',
                            color: 'positive',
                            textColor: 'white',
                            position: 'center'
                        })
                          this.servicesName = '',
                          this.servicesPrice = 0
                    
                }).onCancel(()=>{
                  this.addServicesDialog = true
                })
              }
            }
        },
        openDeleteDialog (task) {
          // this.id = task['.key']
          // this.deleteFoodDialog = true
          // console.log(task, 'task')
          var id = task['.key']
          this.$q.dialog({
            title: 'Delete Service',
            message: 'Delete This Service?',
            ok: 'Yes',
            cancel: 'Cancel'
        }).onOk(() => { 
            this.$firestoreApp.collection('Services').doc(id).delete()
            this.$q.notify({
                    message: 'Service Deleted!',
                    icon: 'mdi-delete',
                    color: 'negative',
                    textColor: 'white',
                    position: 'center'
                })
        })
      },
      openEditDialog (task) {
          this.servicesId = task['.key']
          this.editServicesName = task.servicesName
          this.editServicesPrice = task.servicesPrice
          this.editDialog = true
        },
      setTask(){
          var servicesBago = {
            servicesName: this.editServicesName,
            servicesPrice: this.editServicesPrice
          }
          if(this.editServicesName === '' || this.editServicesPrice === ''){
              this.$q.dialog({
              title: 'Field Required!',
              message: 'Fill all Requirements?',
              ok: 'Ok',
              cancel: 'Cancel'
            })
            }else
            this.$q.dialog({
            title: 'Update Service',
            message: 'Update This Service?',
            ok: 'Yes',
            cancel: 'Cancel'
        }).onOk(() => { 
            this.$firestoreApp.collection('Services').doc(this.servicesId).set(servicesBago)
            this.$q.notify({
                    message: 'Services Updated!',
                    icon: 'mdi-update',
                    color: 'positive',
                    textColor: 'white',
                    position: 'center'
                })
                  this.editDialog = false  
        })  
        }
    },
    //--------------------------------------------------
    data () {
        return {
            Services: [],
            servicesPrice: '',
            servicesName: '',
            editServicesPrice: '',
            editServicesName: '',
            editDialog: false,
            addServicesDialog: false,
            filter: '',
            columns: [
        {
          name: 'servicesName',
          required: true,
          label: 'Services Name',
          align: 'left',
          field: 'servicesName',
          sortable: true
        },
        { name: 'servicesPrice', align: 'center', label: 'Services Price', field: 'servicesPrice', sortable: true },
        { name: 'action', label: 'Action' }
      ]
        }
    }
    //--------------------------------------------------
    
}
</script>