<template>
    <q-page padding>
        <q-table title="" :data="Motif" :columns="columns" :filter="filter" row-key="name">
            <template v-slot:body="props">
                <q-tr :props="props">
                    <q-td key="motifName" :props="props">{{props.row.motifName}}</q-td>
                    <q-td key="description" :props="props">{{props.row.description}}</q-td>
                    <q-td key="action" :props="props">
                        <q-btn no-caps dense color="primary" label="Update" icon="mdi-pencil" @click="openEditDialog(props.row)"></q-btn>
                        <q-btn no-caps icon="delete" dense label="Delete" color="negative" @click="openDeleteDialog(props.row)"></q-btn>
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
            <q-btn fab icon="add" color="accent" @click="addMotifDialog = true" />
                <q-tooltip>
                    Add Motif
                </q-tooltip>
        </q-page-sticky>
        <!--Modal For add Food-->
        <q-dialog v-model="addMotifDialog" persistent>
            <q-card style="min-width: 400px">
                <q-card-section>
                    <div class="text-h6">New Motif</div>
                </q-card-section>

                <q-card-section>
                    <q-input class="q-ma-sm" dense v-model="motifName" label="Motif"/>
                    <q-input class="q-ma-sm" dense v-model="description" label="Description"/>
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                    <q-btn flat label="Cancel" @click="clear" v-close-popup />
                    <q-btn flat label="Add Motif" v-close-popup v-on:click="addMotif" />
                </q-card-actions>
            </q-card>
        </q-dialog>
            <!--Modal for upadate-->
        <q-dialog v-model="editDialog">
            <q-card style="min-width: 400px">
                <q-card-section>
                     <div class="text-h6">Edit Motif</div>
                </q-card-section>

                <q-card-section>
                    <q-input class="q-ma-sm" label="Motif" v-model="editMotifName" />
                    <q-input class="q-ma-sm" label="Description" v-model="editDescription" autogrow />
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
        this.$binding('Motif', this.$firestoreApp.collection('Motif'))
            .then(Motif => {
            console.log(Motif, 'Motif')
            })
    },
    data () {
        return {
            addMotifDialog: false,
            editDialog: false,
            motifName: '',
            editMotifName: '',
            editDescription: '',
            Motif: [],
            description: '',
            filter: '',
            columns: [
                    { name: 'motifName', required: true, label: 'Motif', align: 'left', field: 'motifName', sortable: true },
                    { name: 'description', align: 'center', label: 'Motif Description', field: 'description', sortable: true },
                    { name: 'action', label: 'Action' }
            ]
        }
    },
    methods: {
        clear(){
                    this.motifName = ''
                    this.description = ''
        },
        addMotif () {
            var motif = {
                motifName: this.motifName,
                description: this.description
            }   
            let optionss = this.$lodash.filter(this.Motif, m => {
                if(m.motifName === this.motifName){
                    return m
                }
            })   
                console.log(optionss, 'option')
                 
                if(this.motifName === '' || this.description === '') {
                this.$q.dialog({
                title: 'Required!',
                message: 'Fill all Requirements??',
                ok: 'Ok',
                persistent: true
                }).onOk(()=>{
                    this.addMotifDialog = true
                })
                }else{
                    if(optionss.length > 0){
                    this.$q.dialog({
                    title: 'Duplicate Entry!',
                    message: 'Unable to save?',
                    ok: 'Ok',
                    persistent: true
                        }).onOk(() => {
                            this.addMotifDialog = true
                        })
                    }
                    else{
                        this.$q.dialog({
                        title: 'Add Motif',
                        message: 'Add This Motif?',
                        ok: 'Yes',
                        cancel: 'Cancel',
                        persistent: true
                            }).onOk(() => { 
                            this.$firestoreApp.collection('Motif').add(motif)
                            this.$q.notify({
                                    message: 'Motif Added!',
                                    icon: 'mdi-folder-plus-outline',
                                    color: 'positive',
                                    textColor: 'white',
                                    position: 'center'
                            })
                                this.motifName = '',
                                this.description = ''
                            }).onCancel(()=>{
                                this.addMotifDialog = true
                            })
                    }
                }
            },
            openEditDialog (task) {
                this.motifId = task['.key']
                this.editMotifName = task.motifName
                this.editDescription = task.description
                this.editDialog = true
            },
            openDeleteDialog (task) {
                var id = task['.key']
                this.$q.dialog({
                    title: 'Delete Motif?',
                    message: 'Delete This Motif?',
                    ok: 'Yes',
                    cancel: 'Cancel'
                }).onOk(() => { 
                    this.$firestoreApp.collection('Motif').doc(id).delete()
                    this.$q.notify({
                            message: 'Motif Deleted!',
                            icon: 'mdi-delete',
                            color: 'negative',
                            textColor: 'white',
                            position: 'center'
                        })
                })

            },
            setTask(){
                var motifBago = {
                    motifName: this.editMotifName,
                    description: this.editDescription,
                }
                if(this.editMotifName === '' || this.editDescription === ''){
                    this.$q.dialog({
                    title: 'Field Required!',
                    message: 'Fill all Requirements?',
                    ok: 'Ok',
                    cancel: 'Cancel'
                    })
                    }else
                    this.$q.dialog({
                    title: 'Update Motif',
                    message: 'Update This Motif?',
                    ok: 'Yes',
                    cancel: 'Cancel'
                }).onOk(() => { 
                    this.$firestoreApp.collection('Motif').doc(this.motifId).set(motifBago)
                    this.$q.notify({
                            message: 'Motif Updated!',
                            icon: 'mdi-update',
                            color: 'positive',
                            textColor: 'white',
                            position: 'center'
                        })
                        this.editDialog = false  
                }).onCancel(()=>{
                    this.editDialog = true
                })  
            }
    }
}
</script>