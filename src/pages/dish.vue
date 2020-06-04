<template>
    <q-page padding>
        <q-table title="" :data="Dish" :columns="columns" :filter="filter" row-key="name">
            <template v-slot:body="props">
                <q-tr :props="props">
                    <q-td key="dishName" :props="props">{{props.row.dishName}}</q-td>
                    <q-td key="action" :props="props">
                        <q-btn no-caps dense color="primary" label="Update" icon="mdi-pencil" @click="openEditDialog(props.row)"></q-btn>
                        <!-- <q-btn no-caps icon="delete" dense color="negative" @click="openDeleteDialog(props.row)"></q-btn> -->
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
            <q-btn fab icon="add" color="accent" @click="addDishDialog = true" />
                <q-tooltip>
                    Add Dish
                </q-tooltip>
        </q-page-sticky>

        <!--Modal For add Food-->
        <q-dialog v-model="addDishDialog" persistent>
            <q-card style="min-width: 400px">
                <q-card-section>
                    <div class="text-h6">New Dish Type</div>
                </q-card-section>

                <q-card-section>
                    <q-input class="q-ma-sm" dense v-model="dishName" label="Name"/>
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                    <q-btn flat label="Cancel" @click="clear" v-close-popup />
                    <q-btn flat label="Add" v-close-popup v-on:click="addDish" />
                </q-card-actions>
            </q-card>
        </q-dialog>
        <!--Modal for upadate-->
        <q-dialog v-model="editDialog">
            <q-card style="min-width: 400px">
                <q-card-section>
                    <div class="text-h6">Edit Dish</div>
                </q-card-section>

                <q-card-section>
                    <q-input class="q-ma-sm" dense v-model="editDishName" />
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
                addDishDialog: false,
                editDialog: false,
                editDishName: '',
                Dish: [],
                dishName: '',
                filter: '',
                columns: [
                    { name: 'dishName', required: true, label: 'Dish Name', align: 'left', field: 'dishName', sortable: true },
                    { name: 'action', label: 'Action' }
                ]
            }
        },
        mounted () {
            this.$binding('Dish', this.$firestoreApp.collection('Dish'))
            .then(Dish => {
            console.log(Dish, 'Dish')
        })
          
        },
        methods: {
            clear(){
                this.dishName = ''
            },
            addDish () {
                var dish = {
                    dishName: this.dishName
                }
                let optionss = this.$lodash.filter(this.Dish, m => {
                if(m.dishName === this.dishName){
                        return m
                    }
                })   
                if(this.dishName === ''){
                    this.$q.dialog({
                    title: 'Field Required!',
                    message: 'Fill all Requirements?',
                    ok: 'Ok',
                    persistent: true
                    }).onOk(()=>{
                    this.addDishDialog = true
                    })
                }else{
                    if(optionss.length > 0){
                        this.$q.dialog({
                        title: 'Duplicate Entry!',
                        message: 'Unable to save?',
                        ok: 'Ok',
                        persistent: true
                        }).onOk(() => {
                            this.addDishDialog = true
                        })
                    }else{
                        this.$q.dialog({
                        title: 'Add Dish?',
                        message: 'Add This Dish??',
                        ok: 'Yes',
                        cancel: 'Cancel',
                        persistent: true
                        })
                        .onOk(() => { 
                            this.$firestoreApp.collection('Dish').add(dish)
                            this.$q.notify({
                                    message: 'Name Added!',
                                    icon: 'mdi-folder-plus-outline',
                                    color: 'positive',
                                    textColor: 'white',
                                    position: 'center'
                        })
                                this.dishName = '' 
                        }).onCancel(()=>{
                            this.addDishDialog = true
                        })
                     }    
                }
            },
            openDeleteDialog (task) {
                var id = task['.key']
                    this.$q.dialog({
                        title: 'Delete Name',
                        message: 'Delete This Name?',
                        ok: 'Yes',
                        cancel: 'Cancel'
                    }).onOk(() => { 
                        this.$firestoreApp.collection('Dish').doc(id).delete()
                        this.$q.notify({
                                message: 'Name Deleted!',
                                icon: 'mdi-delete',
                                color: 'negative',
                                textColor: 'white',
                                position: 'center'
                    })
                    })

            },
            openEditDialog (task) {
                this.dishId = task['.key']
                this.editDishName = task.dishName
                this.editDialog = true
            },
            setTask () {
                var dishBago = {
                        dishName: this.editDishName
                    }
                    if(this.editDishName === ''){
                        this.$q.dialog({
                        title: 'Field Required!',
                        message: 'Fill all Requirements?',
                        ok: 'Ok',
                        cancel: 'Cancel'
                        })
                        }
                        else
                        this.$q.dialog({
                        title: 'Update Name',
                        message: 'Update This Name?',
                        ok: 'Yes',
                        cancel: 'Cancel'
                    })
                    .onOk(() => { 
                        this.$firestoreApp.collection('Dish').doc(this.dishId).set(dishBago)
                        this.$q.notify({
                                message: 'Name Updated!',
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