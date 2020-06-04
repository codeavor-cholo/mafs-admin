<template>
    <q-page>
        <q-table title="" :data="Manpower" :columns="columns" :filter="filter" row-key="name">
            <template v-slot:body="props">
                <q-tr :props="props">
                    <q-td key="manName" :props="props">{{props.row.manName}}</q-td>
                    <q-td key="manPrice" :props="props">{{props.row.manPrice}}</q-td>
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
            <q-btn fab icon="add" color="accent" @click="addManDialog = true" />
                <q-tooltip>
                    Add Man Services
                </q-tooltip>
        </q-page-sticky>
        <!--Modal For add Food-->
        <q-dialog v-model="addManDialog" persistent>
            <q-card style="min-width: 400px">
                <q-card-section>
                    <div class="text-h6">New Man Services</div>
                </q-card-section>

                <q-card-section>
                    <q-input class="q-ma-sm" dense v-model="manName" autofocus label="Staff Name" :rules="[val => !!val || 'Field is required']"/>
                    <q-input class="q-ma-sm" type="number" dense v-model="manPrice" autofocus label="Staff Price" :rules="[val => !!val || 'Field is required']"/>
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                    <q-btn flat label="Cancel" v-close-popup />
                    <q-btn flat label="Add Services" v-close-popup v-on:click="addMan" />
                </q-card-actions>
            </q-card>
        </q-dialog>
        <!--Modal for upadate-->
        <q-dialog v-model="editDialog">
            <q-card style="min-width: 400px">
                <q-card-section>
                    <div class="text-h6">Edit Staff</div>
                </q-card-section>

                <q-card-section>
                    <q-input class="q-ma-sm" dense v-model="editManName" autofocus />
                    <q-input class="q-ma-sm"  type="number" dense v-model="editManPrice" autofocus />
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
                editManPrice: '',
                editManName: '',
                addManDialog: false,
                Manpower: [],
                manPrice: '',
                manName: '',
                filter: '',
                columns: [
                    { name: 'manName', required: true, label: 'Man Name', align: 'left', field: 'manName', sortable: true },
                    { name: 'manPrice', align: 'center', label: 'Man Price', field: 'manPrice', sortable: true },
                    { name: 'action', label: 'Action' }
                ]
            }
        },
        mounted () {
            this.$binding('Manpower', this.$firestoreApp.collection('Manpower'))
            .then(Manpower => {
            console.log(Manpower, 'Manpower')
        })
          
        },
        methods: {
            addMan () {
                var manPower = {
                    manName: this.manName,
                    manPrice: this.manPrice
                }
                if(this.manName === '' || this.manPrice === ''){
                    this.$q.dialog({
                    title: 'Field Required!',
                    message: 'Fill all Requirements?',
                    ok: 'Ok',
                    cancel: 'Cancel'
                    })
                }else
                    this.$q.dialog({
                    title: 'Add Staff?',
                    message: 'Add This Staff??',
                    ok: 'Yes',
                    cancel: 'Cancel'
                })
                .onOk(() => { 
                    this.$firestoreApp.collection('Manpower').add(manPower)
                    this.$q.notify({
                            message: 'Staff Added!',
                            icon: 'mdi-folder-plus-outline',
                            color: 'positive',
                            textColor: 'white',
                            position: 'center'
                })
                        this.manName = '',
                        this.manPrice = 0  
                })    
            },
            openDeleteDialog (task) {
                var id = task['.key']
                    this.$q.dialog({
                        title: 'Delete Staff',
                        message: 'Delete This Staff?',
                        ok: 'Yes',
                        cancel: 'Cancel'
                    }).onOk(() => { 
                        this.$firestoreApp.collection('Manpower').doc(id).delete()
                        this.$q.notify({
                                message: 'Staff Deleted!',
                                icon: 'mdi-delete',
                                color: 'negative',
                                textColor: 'white',
                                position: 'center'
                    })
                    })

            },
            openEditDialog (task) {
                this.manId = task['.key']
                this.editManName = task.manName
                this.editManPrice = task.manPrice
                this.editDialog = true
            },
            setTask () {
                var manBago = {
                        manName: this.editManName,
                        manPrice: this.editManPrice
                    }
                    if(this.editManName === '' || this.editManPrice === ''){
                        this.$q.dialog({
                        title: 'Field Required!',
                        message: 'Fill all Requirements?',
                        ok: 'Ok',
                        cancel: 'Cancel'
                        })
                        }
                        else
                        this.$q.dialog({
                        title: 'Update Staff',
                        message: 'Update This Staff?',
                        ok: 'Yes',
                        cancel: 'Cancel'
                    })
                    .onOk(() => { 
                        this.$firestoreApp.collection('Manpower').doc(this.manId).set(manBago)
                        this.$q.notify({
                                message: 'Staff Updated!',
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