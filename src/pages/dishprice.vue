<template>
    <q-page padding>
        <q-table title="" :data="Dishprice" :columns="columns" :filter="filter" row-key="name">
            <template v-slot:body="props">
                <q-tr :props="props">
                    <q-td key="dishName" :props="props">{{props.row.dishName}}</q-td>
                    <q-td key="category" :props="props">{{props.row.category}}</q-td>
                    <q-td key="maxPrice" :props="props">{{props.row.maxPrice}}</q-td>
                    <q-td key="action" :props="props">
                        <q-btn no-caps label="Update" color="primary" icon="mdi-pencil" @click="openEditDialog(props.row)"></q-btn>
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
            <q-btn fab icon="add" color="accent" @click="addDishPriceDialog = true" />
                <q-tooltip>
                    Add Dish Price
                </q-tooltip>
        </q-page-sticky>

        <!--Modal For add Food-->
        <q-dialog v-model="addDishPriceDialog" persistent>
            <q-card style="min-width: 400px">
                <q-card-section>
                    <div class="text-h6">New Dish Price</div>
                </q-card-section>
                
                <q-card-section>
                    <q-select class="q-ma-sm" filled v-model="selectDishName" :options="foodDishOptions" label="Dish Type" emit-value map-options/>
                    <q-select class="q-ma-sm" filled v-model="selectCategory" :options="foodDishType" label="Category" emit-value map-options/>
                    <q-input class="q-ma-sm" type="number"  v-model="maxprice" autofocus label="Max Price"/>
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                    <q-btn flat label="Cancel" @click="clear" v-close-popup />
                    <q-btn flat label="Add Dish Price" v-close-popup v-on:click="addDishPrice" />
                </q-card-actions>
            </q-card>
        </q-dialog>
    <!--Modal for upadate-->
        <q-dialog v-model="editDialog">
            <q-card style="min-width: 400px">
                <q-card-section>
                     <div class="text-h6">Edit Dish Price</div>
                </q-card-section>

                <q-card-section>
                    <q-select class="q-ma-sm" readonly filled v-model="editDishName" :options="foodDishOptions" label="Dish Type"/>
                    <q-select class="q-ma-sm" readonly filled v-model="editCategory" :options="categoryOptions" label="Category"/>
                    <q-input class="q-ma-sm" type="number" v-model="editMaxPrice" label="Max Price" autofocus />
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
                editDishName: '',
                editMaxPrice: '',
                addDishPriceDialog: false,
                selectDishName: '',
                editCategory: '',
                Category: [],
                selectCategory: '',
                Dish: [],
                Dishprice: [],
                maxprice: '',
                quantity: '',
                filter: '',
                columns: [
                    { name: 'dishName', required: true, label: 'Dish Type', align: 'left', field: 'dishName', sortable: true },
                    { name: 'category', required: true, label: 'Food Type', align: 'left', field: 'category', sortable: true },
                    { name: 'maxPrice', align: 'center', label: 'Max Price', field: 'maxPrice', sortable: true },
                    { name: 'action', label: 'Action' }
                ]
            }
        },
        methods: {
             clear(){
                this.selectDishName = ''
                this.selectCategory = ''
                this.maxprice = ''
             },
             addDishPrice () {
                var dishprice = {
                    dishName: this.selectDishName,
                    category: this.selectCategory,
                    maxPrice: this.maxprice
                }
                let optionss = this.$lodash.filter(this.Dishprice, m => {
                    if(m.category === this.selectCategory){
                        return m
                    }
                })
                if(this.selectDishName === '' || this.maxprice === '' || this.selectCategory === '' || this.maxprice === 0 || this.maxprice === '0' || this.maxprice < 0){
                    this.$q.dialog({
                    title: 'Field Required!',
                    message: this.maxprice < 0 ? 'price is negative value' :'Fill all Requirements?',
                    ok: 'Ok',
                    persistent: true
                    }).onOk(()=>{
                        this.addDishPriceDialog = true
                    })
                }else{
                    if(optionss.length > 0){
                        this.$q.dialog({
                        title: 'Duplicate Entry!',
                        message: 'Unable to save?',
                        ok: 'Ok',
                        }).onOk(() => {
                            this.addDishPriceDialog = true
                        })
                    }else{
                        this.$q.dialog({
                        title: 'Add Dish Price?',
                        message: 'Add This Dish Price??',
                        ok: 'Yes',
                        cancel: 'Cancel',
                        persistent: true
                        })
                        .onOk(() => { 
                            this.$firestoreApp.collection('Dishprice').add(dishprice)
                            this.$q.notify({
                                    message: 'Dish Price Added!',
                                    icon: 'mdi-folder-plus-outline',
                                    color: 'positive',
                                    textColor: 'white',
                                    position: 'center'
                        })
                                this.selectDishName = ''
                                this.selectCategory = ''
                                this.maxprice = '' 
                        }).onCancel(()=>{
                            this.addDishPriceDialog = true
                        })
                    }
                }        
            },
            openEditDialog (task) {
                this.dpriceId = task['.key']
                this.editDishName = { label: task.dishName, value:task.dishName }
                this.editCategory = { label: task.category, value:task.category }
                this.editMaxPrice = task.maxPrice
                this.editDialog = true
            },
            openDeleteDialog (task) {
                var id = task['.key']
                this.$q.dialog({
                    title: 'Delete Dish Price',
                    message: 'Delete This Dish Price?',
                    ok: 'Yes',
                    cancel: 'Cancel'
                }).onOk(() => { 
                    this.$firestoreApp.collection('Dishprice').doc(id).delete()
                    this.$q.notify({
                            message: 'Dish Price Deleted!',
                            icon: 'mdi-delete',
                            color: 'negative',
                            textColor: 'white',
                            position: 'center'
                        })
                })

            },
            setTask(){
                var dpriceBago = {
                    dishName: this.editDishName.value,
                    category: this.editCategory.value,
                    maxPrice: this.editMaxPrice
                }
                if(this.editDishName === '' && this.editMaxPrice === '' && this.editCategory === ''){
                    this.$q.dialog({
                    title: 'Field Required!',
                    message: 'Fill all Requirements?',
                    ok: 'Ok',
                    cancel: 'Cancel'
                    })
                    }else
                    this.$q.dialog({
                    title: 'Update Dish Price',
                    message: 'Update This Dish Price?',
                    ok: 'Yes',
                    cancel: 'Cancel'
                }).onOk(() => { 
                    this.$firestoreApp.collection('Dishprice').doc(this.dpriceId).set(dpriceBago)
                    this.$q.notify({
                            message: 'Dish Price Updated!',
                            icon: 'mdi-update',
                            color: 'positive',
                            textColor: 'white',
                            position: 'center'
                        })
                        this.editDialog = false  
                })  
            }
        },
        mounted () {
            this.$binding('Dish', this.$firestoreApp.collection('Dish'))
            .then(Dish => {
            console.log(Dish, 'Dish')
            }),
            this.$binding('Dishprice', this.$firestoreApp.collection('Dishprice'))
            .then(Dishprice => {
            console.log(Dishprice, 'Dishprice')
            }),
            this.$binding('Category', this.$firestoreApp.collection('Category'))
            .then(Category => {
            console.log(Category, 'Category')
            })
        },
        computed: {
            foodDishType(){
                    let optionss = this.$lodash.filter(this.Category, m => {
                            return m.dishType == this.selectDishName    
                        })
                        let opt = this.$lodash.map(optionss, n => {
                            return { label: n.category, value: n.category }
                        })
                        console.log(optionss, 'opt')
                        console.log(opt, 'opoopst')
                        return opt
            },
            foodDishOptions(){
                let options = this.Dish.map(Dish => {
                    return {
                        label: Dish.dishName,
                        value: Dish.dishName
                    }
                })
                return options
            },
            categoryOptions(){
                let options = this.Category.map(Category => {
                    return {
                        label: Category.category,
                        value: Category.category
                    }
                })
                return options
            }
        }
}
</script>