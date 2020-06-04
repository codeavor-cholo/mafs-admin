<template>
    <q-page padding>
        <q-table title="" :data="database" :columns="columns" :filter="filter" row-key="name">
            <template v-slot:body="props">
                <q-tr :props="props">
                    <q-td key="id" :props="props">{{props.row.id}}</q-td>
                    <q-td key="terms" :props="props">{{props.row.terms}}</q-td>
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
            <q-btn fab icon="add" color="accent" @click="addTermsDialog = true" />
            <q-tooltip>
                Add Terms
            </q-tooltip>
    </q-page-sticky>
    <!--dialog-->
    <q-dialog v-model="addTermsDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">New Terms</div>
        </q-card-section>

        <q-card-section>
          <strong>ID:{{plusone}}</strong>
          <q-input class="q-ma-sm" v-model="termsName" label="Terms and Condition"/>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" @click="clear" v-close-popup />
          <q-btn flat label="Add Terms" v-close-popup v-on:click="addTerms" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!--Modal for upadate-->
    <q-dialog v-model="editDialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Edit Terms</div>
        </q-card-section>

        <q-card-section>
          <q-input class="q-ma-sm" readonly v-model="id" label="ID"/>
          <q-input class="q-ma-sm" v-model="updateTerms" label="Terms"/>
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
            addTermsDialog: false,
            editDialog: false,
            termsName: '',
            updateTerms: '',
            Terms: [],
            filter: '',
            columns: [
                { name: 'id', required: true, label: 'ID', align: 'left', field: 'id', sortable: true },
                { name: 'terms', required: true, label: 'Terms And Conditions', align: 'left', field: 'terms', sortable: true },
                { name: 'action', label: 'Action' }
            ]
        }
    },
    mounted () {
      this.$binding('Terms', this.$firestoreApp.collection('Terms'))
        .then(Terms => {
          console.log(Terms, 'Terms')
        })
    },
    computed: {
        database(){
            let orderBy = this.$lodash.orderBy(this.Terms, ['id'], ['desc']);
            return orderBy
        },
        plusone(){
            if(this.Terms.length === 0){
                return 1
            }else{
                console.log(this.countID, 'sadasdasd')
                let sum = parseInt(this.Terms.length) + 1
                return sum
                console.log(sum, 'asdas')
            }
        },
    },
    methods: {
        clear(){
          this.termsName = ''
        },
        addTerms(){
            var newTerms = {
                id: this.plusone,
                terms: this.termsName,
            }
            let optionss = this.$lodash.filter(this.Terms, m => {
                if(m.terms === this.termsName){
                    return m
                }
            }) 
            if(this.termsName === '') {
              this.$q.dialog({
              title: 'Field Required!',
              message: 'Fill all Requirements?',
              ok: 'Ok',
              persistent: true
            }).onOk(()=>{
                this.addTermsDialog = true
            })
            }else{
              if(optionss.length > 0){
                    this.$q.dialog({
                    title: 'Duplicate Entry!',
                    message: 'Unable to save?',
                    ok: 'Ok',
                    persistent: true
                    }).onOk(() => {
                        this.addTermsDialog = true
                    })
              }else{
                    this.$q.dialog({
                    title: 'Add Terms',
                    message: 'Add This Terms?',
                    ok: 'Yes',
                    cancel: 'Cancel',
                    persistent: true
                }).onOk(() => { 
                    this.$firestoreApp.collection('Terms').add(newTerms)
                    this.$q.notify({
                            message: 'Terms Added!',
                            icon: 'mdi-folder-plus-outline',
                            color: 'positive',
                            textColor: 'white',
                            position: 'center'
                        })
                        this.termsName = ''    
                }).onCancel(()=>{
                  this.addTermsDialog = true
                })
              }
            }
        },
        openDeleteDialog (task) {
          var id = task['.key']
          this.$q.dialog({
            title: 'Delete Terms',
            message: 'Delete This Terms?',
            ok: 'Yes',
            cancel: 'Cancel'
            }).onOk(() => { 
                this.$firestoreApp.collection('Terms').doc(id).delete()
                this.$q.notify({
                        message: 'Terms Deleted!',
                        icon: 'mdi-delete',
                        color: 'negative',
                        textColor: 'white',
                        position: 'center'
                    })
            })
        },
        openEditDialog (task) {
          this.termsId = task['.key']
          this.id = task.id
          this.updateTerms = task.terms
          this.editDialog = true
        },
        setTask(){
          var termsBago = {
            id: this.id,
            terms: this.updateTerms,
            }
            if(this.updateTerms === ''){
             this.$q.dialog({
              title: 'Field Required!',
              message: 'Fill all Requirements?',
              ok: 'Ok',
              cancel: 'Cancel'
            })
            }else
                this.$q.dialog({
                title: 'Update Terms',
                message: 'Update This Terms?',
                ok: 'Yes',
                cancel: 'Cancel'
            }).onOk(() => { 
                this.$firestoreApp.collection('Terms').doc(this.termsId).set(termsBago)
                this.$q.notify({
                        message: 'Terms Updated!',
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