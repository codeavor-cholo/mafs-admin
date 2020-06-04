<template>
    <q-page padding>
        <q-table title="" :data="database" :columns="columns" :filter="filter" row-key="name">
            <template v-slot:body="props">
                <q-tr :props="props">
                    <q-td key="id" :props="props">{{props.row.id}}</q-td>
                    <q-td key="mode" :props="props">{{props.row.mode}}</q-td>
                    <q-td key="action" :props="props">
                        <q-btn no-caps dense color="primary" icon="mdi-pencil" @click="openEditDialog(props.row)"></q-btn>
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
            <q-btn fab icon="add" color="accent" @click="addModeDialog = true" />
            <q-tooltip>
                Add Mode
            </q-tooltip>
    </q-page-sticky>
    <!--dialog-->
    <q-dialog v-model="addModeDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">New Mode</div>
        </q-card-section>

        <q-card-section>
          <strong>ID:{{plusone}}</strong>
          <q-input class="q-ma-sm" v-model="modeName" label="Mode Of Payment"/>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" @click="clear" v-close-popup />
          <q-btn flat label="Add Mode" v-close-popup v-on:click="addMode" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!--Modal for upadate-->
    <q-dialog v-model="editDialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Edit Mode</div>
        </q-card-section>

        <q-card-section>
          <q-input class="q-ma-sm" readonly v-model="id" label="ID"/>
          <q-input class="q-ma-sm" v-model="updateMode" label="Mode"/>
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
            id: 0,
            addModeDialog: false,
            editDialog: false,
            modeName: '',
            updateMode: '',
            Mode: [],
            filter: '',
            columns: [
                { name: 'id', required: true, label: 'ID', align: 'left', field: 'id', sortable: true },
                { name: 'mode', required: true, label: 'Mode of Payment', align: 'left', field: 'mode', sortable: true },
                { name: 'action', label: 'Action' }
            ]
        }
    },
    mounted () {
      this.$binding('Mode', this.$firestoreApp.collection('Mode'))
        .then(Mode => {
          console.log(Mode, 'Mode')
        })
    },
    computed: {
        database(){
            let orderBy = this.$lodash.orderBy(this.Mode, ['id'], ['desc']);
            return orderBy
        },
        plusone(){
            if(this.Mode.length === 0){
                return 1
            }else{
                console.log(this.countID, 'sadasdasd')
                let sum = parseInt(this.Mode.length) + 1
                return sum
                console.log(sum, 'asdas')
            }
        },
    },
    methods: {
        clear(){
          this.modeName = ''
        },
        addMode(){
            var newMode = {
                id: this.plusone,
                mode: this.modeName,
            }
            let optionss = this.$lodash.filter(this.Mode, m => {
                if(m.mode === this.modeName){
                    return m
                }
            }) 
            if(this.modeName === '') {
              this.$q.dialog({
              title: 'Field Required!',
              message: 'Fill all Requirements?',
              ok: 'Ok',
              persistent: true
            }).onOk(()=>{
                this.addModeDialog = true
            })
            }else{
              if(optionss.length > 0){
                    this.$q.dialog({
                    title: 'Duplicate Entry!',
                    message: 'Unable to save?',
                    ok: 'Ok',
                    persistent: true
                    }).onOk(() => {
                        this.addModeDialog = true
                    })
              }else{
                    this.$q.dialog({
                    title: 'Add Mode',
                    message: 'Add This Mode?',
                    ok: 'Yes',
                    cancel: 'Cancel',
                    persistent: true
                }).onOk(() => { 
                    this.$firestoreApp.collection('Mode').add(newMode)
                    this.$q.notify({
                            message: 'Mode Added!',
                            icon: 'mdi-folder-plus-outline',
                            color: 'positive',
                            textColor: 'white',
                            position: 'center'
                        })
                        this.modeName = ''    
                }).onCancel(()=>{
                  this.addModeDialog = true
                })
              }
            }
        },
        openDeleteDialog (task) {
          var id = task['.key']
          this.$q.dialog({
            title: 'Delete Mode',
            message: 'Delete This Mode?',
            ok: 'Yes',
            cancel: 'Cancel'
            }).onOk(() => { 
                this.$firestoreApp.collection('Mode').doc(id).delete()
                this.$q.notify({
                        message: 'Mode Deleted!',
                        icon: 'mdi-delete',
                        color: 'negative',
                        textColor: 'white',
                        position: 'center'
                    })
            })
        },
        openEditDialog (task) {
          this.modeId = task['.key']
          this.id = task.id
          this.updateMode = task.mode
          this.editDialog = true
        },
        setTask(){
          var modeBago = {
            id: this.id,
            mode: this.updateMode,
            }
            if(this.updateMode === ''){
             this.$q.dialog({
              title: 'Field Required!',
              message: 'Fill all Requirements?',
              ok: 'Ok',
              cancel: 'Cancel'
            })
            }else
                this.$q.dialog({
                title: 'Update Mode',
                message: 'Update This Mode?',
                ok: 'Yes',
                cancel: 'Cancel'
            }).onOk(() => { 
                this.$firestoreApp.collection('Mode').doc(this.modeId).set(modeBago)
                this.$q.notify({
                        message: 'Mode Updated!',
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