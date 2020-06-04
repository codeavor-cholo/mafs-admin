<template>
    <q-page padding>
        <q-table title="" :data="database" :columns="columns" :filter="filter" row-key="name">
            <template v-slot:body="props">
                <q-tr :props="props">
                    <q-td key="id" :props="props">{{props.row.id}}</q-td>
                    <q-td key="notify" :props="props">{{props.row.notify}}</q-td>
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
            <q-btn fab icon="add" color="accent" @click="addNotifyDialog = true" />
            <q-tooltip>
                Add Notify
            </q-tooltip>
    </q-page-sticky>
    <!--dialog-->
    <q-dialog v-model="addNotifyDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">New Notify</div>
        </q-card-section>

        <q-card-section>
          <strong>ID:{{plusone}}</strong>
          <q-input class="q-ma-sm" v-model="notifyName" label="Notify"/>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" @click="clear" v-close-popup />
          <q-btn flat label="Add Notify" v-close-popup v-on:click="addNotify" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!--Modal for upadate-->
    <q-dialog v-model="editDialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Edit Notify</div>
        </q-card-section>

        <q-card-section>
          <q-input class="q-ma-sm" readonly v-model="id" label="ID"/>
          <q-input class="q-ma-sm" v-model="updateNotify" label="Notify"/>
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
            addNotifyDialog: false,
            editDialog: false,
            notifyName: '',
            updateNotify: '',
            Notify: [],
            filter: '',
            columns: [
                { name: 'id', required: true, label: 'ID', align: 'left', field: 'id', sortable: true },
                { name: 'notify', required: true, label: 'Notify', align: 'left', field: 'notify', sortable: true },
                { name: 'action', label: 'Action' }
            ]
        }
    },
    mounted () {
      this.$binding('Notify', this.$firestoreApp.collection('Notify'))
        .then(Notify => {
          console.log(Notify, 'Notify')
        })
    },
    computed: {
        database(){
            let orderBy = this.$lodash.orderBy(this.Notify, ['id'], ['desc']);
            return orderBy
        },
        plusone(){
            if(this.Notify.length === 0){
                return 1
            }else{
                console.log(this.countID, 'sadasdasd')
                let sum = parseInt(this.Notify.length) + 1
                return sum
                console.log(sum, 'asdas')
            }
        },
    },
    methods: {
        clear(){
          this.notifyName = ''
        },
        addNotify(){
            var newNotify = {
                id: this.plusone,
                notify: this.notifyName,
            }
            let optionss = this.$lodash.filter(this.Notify, m => {
                if(m.notify === this.notifyName){
                    return m
                }
            }) 
            if(this.notifyName === '') {
              this.$q.dialog({
              title: 'Field Required!',
              message: 'Fill all Requirements?',
              ok: 'Ok',
              persistent: true
            }).onOk(()=>{
                this.addNotifyDialog = true
            })
            }else{
              if(optionss.length > 0){
                    this.$q.dialog({
                    title: 'Duplicate Entry!',
                    message: 'Unable to save?',
                    ok: 'Ok',
                    persistent: true
                    }).onOk(() => {
                        this.addNotifyDialog = true
                    })
              }else{
                    this.$q.dialog({
                    title: 'Add Notify',
                    message: 'Add This Notify?',
                    ok: 'Yes',
                    cancel: 'Cancel',
                    persistent: true
                }).onOk(() => { 
                    this.$firestoreApp.collection('Notify').add(newNotify)
                    this.$q.notify({
                            message: 'Notify Added!',
                            icon: 'mdi-folder-plus-outline',
                            color: 'positive',
                            textColor: 'white',
                            position: 'center'
                        })
                        this.notifyName = ''    
                }).onCancel(()=>{
                  this.addNotifyDialog = true
                })
              }
            }
        },
        openDeleteDialog (task) {
          var id = task['.key']
          this.$q.dialog({
            title: 'Delete Notify',
            message: 'Delete This Notify?',
            ok: 'Yes',
            cancel: 'Cancel'
            }).onOk(() => { 
                this.$firestoreApp.collection('Notify').doc(id).delete()
                this.$q.notify({
                        message: 'Notify Deleted!',
                        icon: 'mdi-delete',
                        color: 'negative',
                        textColor: 'white',
                        position: 'center'
                    })
            })
        },
        openEditDialog (task) {
          this.notifyId = task['.key']
          this.id = task.id
          this.updateNotify = task.notify
          this.editDialog = true
        },
        setTask(){
          var notifyBago = {
            id: this.id,
            notify: this.updateNotify,
            }
            if(this.updateNotify === ''){
             this.$q.dialog({
              title: 'Field Required!',
              message: 'Fill all Requirements?',
              ok: 'Ok',
              cancel: 'Cancel'
            })
            }else
                this.$q.dialog({
                title: 'Update Notify',
                message: 'Update This Notify?',
                ok: 'Yes',
                cancel: 'Cancel'
            }).onOk(() => { 
                this.$firestoreApp.collection('Notify').doc(this.notifyId).set(notifyBago)
                this.$q.notify({
                        message: 'Notify Updated!',
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