<template>
    <q-page padding>
        <q-table title="" :data="Setup" :columns="columns" :filter="filter" row-key="name">
            <template v-slot:body="props">
                <q-tr :props="props">
                    <q-td key="setupOne" :props="props">{{props.row.setupOne}}</q-td>
                    <q-td key="setupPrice" :props="props">{{props.row.setupPrice}}</q-td>
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
            <q-btn fab icon="add" color="accent" @click="addSetupDialog = true" />
                <q-tooltip>
                    Add Setup
                </q-tooltip>
        </q-page-sticky>
        <!--Modal For add Food-->
        <q-dialog v-model="addSetupDialog" persistent>
            <q-card style="min-width: 400px">
                <q-card-section>
                    <div class="text-h6">New Setup</div>
                </q-card-section>

                <q-card-section>
                    <q-input class="q-ma-sm" v-model="setupone" autofocus label="Package Inclusion"/>
                    <q-input class="q-ma-sm" v-model="setupPrice" type="number" autofocus label="Price"/>
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                    <q-btn flat label="Cancel" @click="clear" v-close-popup />
                    <q-btn flat label="Add Setup" v-close-popup v-on:click="addSetup" />
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
                    <q-input class="q-ma-sm" v-model="editSetupOne" label="Package Inclusion" />
                    <q-input class="q-ma-sm" v-model="editSetupPrice" label="Price" />
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
    data () {
        return {
            editDialog: false,
            setupId: '',
            setupPrice: '',
            editSetupPrice: '',
            editSetupOne: '',
            addSetupDialog: false,
            setupone: '',
            Setup: [],
            filter: '',
            columns: [
                { name: 'setupOne', required: true, label: 'Package Inclusion', align: 'left', field: 'setupOne', sortable: true },
                { name: 'setupPrice', required: true, label: 'Price', align: 'left', field: 'setupPrice', sortable: true },
                { name: 'action', label: 'Action' }
            ]
        }
    },
    mounted () {
            this.$binding('Setup', this.$firestoreApp.collection('Setup'))
            .then(Setup => {
            console.log(Setup, 'Setup')
        })
          
    },
    methods: {
        clear(){
            this.setupone = ''
            this.setupPrice = 0
        },
        addSetup () {
            var allsetup = {
                setupOne: this.setupone,
                setupPrice: this.setupPrice
            }
            let optionss = this.$lodash.filter(this.Setup, m => {
                if(m.setupOne === this.setupone){
                    return m
                }
            })
            if(this.setupone === '' || this.setupPrice === '' || this.setupPrice === 0 || this.setupPrice === '0' || this.setupPrice < 0 ){
                this.$q.dialog({
                    title: 'Field Required!',
                    message: this.setupPrice < 0 ? 'price is negative value' : 'Fill all Requirements?',
                    ok: 'Ok',
                    persistent: true
                    }).onOk(()=>{
                        this.addSetupDialog = true
                    })
            }else{
                if(optionss.length > 0){
                        this.$q.dialog({
                    title: 'Duplicate Entry!',
                    message: 'Unable to save?',
                    ok: 'Ok',
                    persistent: true
                    }).onOk(() => {
                        this.addSetupDialog = true
                    })
                }else{
                    this.$q.dialog({
                    title: 'Add Setup',
                    message: 'Add This Setup?',
                    ok: 'Yes',
                    cancel: 'Cancel',
                    persistent: true
                        }).onOk(() => { 
                        this.$firestoreApp.collection('Setup').add(allsetup)
                        this.$q.notify({
                                message: 'Setup Added!',
                                icon: 'mdi-folder-plus-outline',
                                color: 'positive',
                                textColor: 'white',
                                position: 'center'
                        })
                            this.setupone = ''
                        }).onCancel(()=>{
                            this.addSetupDialog = true
                        })
                    }
                }
            },
        openEditDialog (task) {
                    this.setupId = task['.key']
                    this.editSetupOne = task.setupOne
                    this.editSetupPrice = task.setupPrice
                    this.editDialog = true
            },
        openDeleteDialog (task) {
          // this.id = task['.key']
          // this.deleteFoodDialog = true
          // console.log(task, 'task')
                var id = task['.key']
                    this.$q.dialog({
                        title: 'Delete Setup',
                        message: 'Delete This Setup?',
                        ok: 'Yes',
                        cancel: 'Cancel'
                    }).onOk(() => { 
                        this.$firestoreApp.collection('Setup').doc(id).delete()
                        this.$q.notify({
                                message: 'Setup Deleted!',
                                icon: 'mdi-delete',
                                color: 'negative',
                                textColor: 'white',
                                position: 'center'
                    })
                    })

            },
        setTask(){
                var setupBago = {
                    setupOne: this.editSetupOne,
                    setupPrice: this.editSetupPrice
            }
                this.$q.dialog({
                        title: 'Update Setup',
                        message: 'Update This Setup?',
                        ok: 'Yes',
                        cancel: 'Cancel'
                    }).onOk(() => { 
                        this.$firestoreApp.collection('Setup').doc(this.setupId).set(setupBago)
                        this.$q.notify({
                                message: 'Setup Updated!',
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