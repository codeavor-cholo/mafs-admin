<template>
    <q-page>
        <q-table title="" :data="Position" :columns="columns" :filter="filter" row-key="name" :pagination.sync="pagination" > 
            <template v-slot:body="props">
                <q-tr :props="props">
                    <q-td key="position" :props="props">{{props.row.position}}</q-td>
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
            <q-btn fab icon="add" color="accent" @click="addPositionDialog = true" />
                <q-tooltip>
                    Add Position
                </q-tooltip>
        </q-page-sticky>
        <!--Modal For add Food-->
        <q-dialog v-model="addPositionDialog" persistent>
            <q-card style="min-width: 400px">
                <q-card-section>
                    <div class="text-h6">New Position</div>
                </q-card-section>

                <q-card-section>
                    <q-input class="q-ma-sm" dense v-model="positionName" label="Position"/>
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                    <q-btn flat label="Cancel" @click="clear" v-close-popup />
                    <q-btn flat label="Add Position" v-close-popup v-on:click="addPosition" />
                </q-card-actions>
            </q-card>
        </q-dialog>
        <!--Modal for upadate-->
        <q-dialog v-model="editDialog">
        <q-card style="min-width: 400px">
            <q-card-section>
                <div class="text-h6">Edit Position</div>
            </q-card-section>

            <q-card-section>
                <q-input class="q-ma-sm" filled v-model="editPosition" label="Position"/>
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
            addPositionDialog: false,
            editDialog: false,
            positionName: '',
            editPosition: '',
            Position: [],
            filter: '',
            columns: [
                { name: 'position', required: true, label: 'Position', align: 'left', field: 'position', sortable: true },
                { name: 'action', label: 'Action' }
            ]
        }
    },
    mounted () {
        this.$binding('Position', this.$firestoreApp.collection('Position'))
            .then(Position => {
            console.log(Position, 'Position')
        })
    },
    methods: {
        clear(){
            this.positionName = ''
        },
        addPosition () {
            var position = {
                position: this.positionName
            }
            let optionss = this.$lodash.filter(this.Position, m => {
                if(m.position === this.positionName){
                    return m
                }
            }) 
                if(this.positionName === ''){
                  this.$q.dialog({
                  title: 'Field Required!',
                  message: 'Fill all Requirements?',
                  ok: 'Ok',
                  persistent: true
                }).onOk(()=>{
                    this.addPositionDialog = true
                })
                }else{
                    if(optionss.length > 0){
                        this.$q.dialog({
                    title: 'Duplicate Entry!',
                    message: 'Unable to save?',
                    ok: 'Ok',
                    persistent: true
                    }).onOk(() => {
                        this.addPositionDialog = true
                    })
                }else{    
                    this.$q.dialog({
                    title: 'Add Position',
                    message: 'Add This Position?',
                    ok: 'Yes',
                    cancel: 'Cancel',
                    persistent: true
                        }).onOk(() => { 
                            this.$firestoreApp.collection('Position').add(position)
                            this.$q.notify({
                                    message: 'Position Added!',
                                    icon: 'mdi-folder-plus-outline',
                                    color: 'positive',
                                    textColor: 'white',
                                    position: 'center'
                             })
                                this.positionName = ''  
                             }).onCancel(()=>{
                                 this.addPositionDialog = true
                             })
                        }    
                    }
        },
        openDeleteDialog (task) {
          var id = task['.key']
          this.$q.dialog({
            title: 'Delete Position',
            message: 'Delete This Position?',
            ok: 'Yes',
            cancel: 'Cancel'
        }).onOk(() => { 
            this.$firestoreApp.collection('Position').doc(id).delete()
            this.$q.notify({
                    message: 'Position Deleted!',
                    icon: 'mdi-delete',
                    color: 'negative',
                    textColor: 'white',
                    position: 'center'
                })
        })

        },
        openEditDialog (task) {
          this.positionId = task['.key']         
          this.editPosition = task.position
          this.editDialog = true
        },
        setTask(){
          var positionBago = {
            position: this.editPosition,
          }
            if(this.editposition === ''){
                this.$q.dialog({
                title: 'Field Required!',
                message: 'Fill all Requirements?',
                ok: 'Ok',
                cancel: 'Cancel'
                })
                }else
                this.$q.dialog({
                title: 'Update Position',
                message: 'Update This Position?',
                ok: 'Yes',
                cancel: 'Cancel'
            }).onOk(() => { 
                this.$firestoreApp.collection('Position').doc(this.positionId).set(positionBago)
                this.$q.notify({
                        message: 'Position Updated!',
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