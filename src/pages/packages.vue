<template>
    <q-page padding>
        <q-dialog v-model="packIncDialog">
            <q-card style="min-width: 400px">
                <q-card-section>
                <div class="text-h6">Package Inclusion</div>
                    </q-card-section>
                        <q-list bordered padding class="rounded-borders" style="width: 500px">
                            <q-item-label header>Inclusion List</q-item-label>

                            <q-item clickable v-ripple v-for="(s, index) in this.selectedInclusion.packageInclusion" :key="index">
                                <q-item-section>
                                    <q-item-label lines="1">{{s.setupOne}}</q-item-label>
                                </q-item-section>
                            </q-item>
                        </q-list>
                    <q-card-section>
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                    <q-btn flat label="Ok" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>
        <q-table title="PACKAGES" grid :data="Packages" :columns="columns" :filter="filter" row-key=".key" selection="single" :selected.sync="selected">
            <template v-slot:item="props">
                <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition" :style="props.selected ? 'transform: scale(0.95);' : ''">
                    <q-card style="max-width: 250px" >
                        <q-card-section class="row items-center">
                            <strong><q-checkbox @input="consoleselected" dense v-model="props.selected" :label="props.row.eventName" /> </strong>
                            <q-space />
                            <div>
                                <q-btn no-caps icon="delete" dense color="negative" @click="openDeleteDialog(props.row)"></q-btn>
                            </div>
                        </q-card-section>
                        <q-card-section>
                            <div  v-for="(i, index) in props.row.dishType" :key="index">
                                <strong>
                                    {{i.dishName}}
                                </strong>
                                <q-list v-for="(j, jindex) in  i.category" :key="jindex" dense>
                                                <q-item clickable v-ripple>
                                                    <q-item-section>
                                                        <q-item-label lines="1">{{j.category}}</q-item-label>
                                                    </q-item-section>
                                                    <q-item-section side>
                                                        <q-item-label lines="1">{{j.qty}}</q-item-label>
                                                    </q-item-section>
                                                </q-item>
                                </q-list>
                            </div>
                        </q-card-section>
                         <q-card-section>
                            <strong>{{props.row.packagePrice}} Php per head</strong>
                        </q-card-section>
                        <q-separator/>
                        <q-card-section>
                            <q-btn label="View Package Inclusion" dense color="primary" icon="mdi-pencil" @click="packIncDialog = true, openInclusion(props.row)"></q-btn>
                        </q-card-section>
                    </q-card>
                </div>
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
            <q-btn fab icon="add" color="accent" @click="addPackDialog = true" />
                <q-tooltip>
                    Add Package
                </q-tooltip>
        </q-page-sticky>
        <!--Modal For add Food-->
        <q-dialog v-model="addPackDialog" persistent>
            <q-card style="min-width: 1000px">
                 <q-card-section class="row items-center">
                    <div class="text-h6">New Package</div>
                    <q-space />
                    <q-btn @click="clear" icon="close" flat round dense v-close-popup>
                        <q-tooltip>
                            Cancel
                        </q-tooltip>
                    </q-btn>
                </q-card-section>

                <q-card-section>
                    <q-stepper v-model="step" ref="stepper" color="primary" animated>
                    <q-step :name="1" title="Select Dish Type For Package" icon="settings" :done="step > 1">
                        <q-select class="q-ma-sm" v-model="selectEvent" :options="eventOptions" label="Please Select Event" emit-value map-options filled />
                        <q-table title="Select Dish Type" grid :data="Dish" :pagination.sync="pagination" :columns="dishcolumn" row-key=".key" selection="multiple" :selected.sync="selected">
                            <template v-slot:item="props">
                                <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition" :style="props.selected ? 'transform: scale(0.95);' : ''">
                                    <q-card>
                                        <q-list>
                                            <q-item v-for="col in props.cols.filter(col => col.name !== 'desc')" :key="col.name">
                                                <q-item-section side>
                                                        <div class="row">
                                                            <q-checkbox @input="dishss" v-model="props.selected" :label="props.row.dishName" />
                                                        </div>
                                                </q-item-section>
                                            </q-item>
                                        </q-list>
                                        
                                    </q-card>
                                </div>
                            </template>
                        </q-table>
                    </q-step>

                    <q-step :name="2" title="Select Food Type For Package" icon="create_new_folder" :done="step > 2">
                      <div style="float: left; width: 50%;">  
                        <div  v-for="(i, index) in this.blanko" :key="index" class="q-ma-md">
                            <strong>
                                {{i.dishType}}
                            </strong>


                        <q-list v-for="(j, jindex) in i.category" :key="jindex" dense bordered padding>
                                        <q-item clickable v-ripple>
                                            <q-item-section>
                                                <q-item-label lines="1">{{j.category}}</q-item-label>
                                            </q-item-section>
                                            <q-item-section>
                                                <q-item-label lines="1">{{j.maxPrice}}</q-item-label>
                                            </q-item-section>
                                            <q-item-section side>
                                                <q-btn round color="blue" icon="add" @click="push(i.dishType,j)"/>
                                            </q-item-section>
                                        </q-item>
                        </q-list>

                        </div>

                        </div>

                        <div style="float: left; width: 50%;"> 
                            <h6 style="margin-bottom: -5px; margin-top: 10px">SELECTED FOR PACKAGE PHP {{totalPrice}}</h6>
                                <div  v-for="(i, index) in this.gg" :key="index">
                                    <!-- <strong>
                                        {{i.dishName}} {{i.category.length}}
                                    </strong> -->
                                <q-expansion-item dense-toggle :label="i.dishName + ' ' + i.category.length" :header-inset-level="1" :content-inset-level="2">
                                    
                                <q-list v-for="(j, jindex) in i.category" :key="jindex" dense bordered padding>
                                                <q-item clickable v-ripple>
                                                    <q-item-section>
                                                        <q-item-label lines="1">{{j.category}}</q-item-label>
                                                    </q-item-section>
                                                    <q-item-section >
                                                        <q-item-label lines="1">{{j.maxPrice}}</q-item-label>
                                                    </q-item-section>
                                                                                                        <q-item-section >
                                                        <q-item-label lines="1">{{j.qty}}</q-item-label>
                                                    </q-item-section>
                                                    <q-item-section side>
                                                        <q-btn round color="negative" icon="mdi-delete" @click="spliced(jindex,index)"/>
                                                    </q-item-section>
                                                </q-item>
                                            
                                </q-list>
                                 </q-expansion-item>  
                                </div>
                        </div>
                        <div style="margin-top: -40px; float: bottom; clear: both">
                            <div class="q-pa-md row">
                                <strong>Package Inclusion</strong>
                                &nbsp;&nbsp;&nbsp;
                                <strong class="q-pl-md">Qty: {{incQuantity}}</strong>
                                <strong class="q-pl-md">Inclusion Guide Price: {{PackIncPrice}}</strong>
                                <q-input filled dense class="q-ma-sm" v-model="incPrice" label="Price" type="number" style="width: 100px; margin-top: -10px"></q-input>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <strong>Package Guide Price: {{packagePricePerHead}}</strong>
                                <q-input filled dense class="q-ma-sm" v-model="packPriceReal" label="Enter Package Price" type="number" prefix="Php" style="width: 180px; margin-top: -10px"></q-input>
                            </div>
                <!-- table for Inclusion -->
                            <q-table title="" grid :data="Setup" :pagination.sync="pagination" :columns="setupcolumns" row-key=".key" selection="multiple" :selected.sync="setupselected">
                                        <q-td slot="body-cell-action" slot-scope="props" key="action" :props="props">
                                            <q-btn no-caps dense color="primary" icon="mdi-pencil" label="View" @click="openEditDialog(props.row)"></q-btn>
                                        </q-td>
                                <template v-slot:item="props">
                                    <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition" :style="props.selected ? 'transform: scale(0.95);' : ''">
                                        <q-card>
                                            <q-list dense>
                                                <q-item v-for="col in props.cols.filter(col => col.name !== 'desc')" :key="col.name">
                                                    <q-card-section>
                                                        <q-checkbox v-model="props.selected" :label="props.row.setupOne" />
                                                    </q-card-section>
                                                </q-item>
                                            </q-list>
                                        </q-card>
                                    </div>
                                </template>
                            </q-table>
                        </div>
                    </q-step>

                    <template v-slot:navigation>
                        <q-stepper-navigation>
                        <q-btn @click="step === 2? addpack() : stepChecker()" color="primary" :label="step === 2 ? 'Add Package' : 'Continue'" />
                        <q-btn v-if="step > 1" flat color="primary" @click="stepBackCurry()" label="Back" class="q-ml-sm" />
                        </q-stepper-navigation>
                    </template>
                    </q-stepper>
                </q-card-section>
            </q-card>
        </q-dialog>
    </q-page>
</template>
<script>
export default {
    mounted () {
            this.$binding('Events', this.$firestoreApp.collection('Events'))
            .then(Events => {
            console.log(Events, 'Events')
            }),
            this.$binding('Food', this.$firestoreApp.collection('Food'))
            .then(Food => {
            console.log(Food, 'Food')
            }),
            this.$binding('Dish', this.$firestoreApp.collection('Dish'))
            .then(Dish => {
            console.log(Dish, 'Dish')
            }),
            this.$binding('Category', this.$firestoreApp.collection('Category'))
            .then(Category => {
            console.log(Category, 'Category')
            }),
            this.$binding('Dishprice', this.$firestoreApp.collection('Dishprice'))
            .then(Dishprice => {
            console.log(Dishprice, 'Dishprice')
            }),
            this.$binding('Setup', this.$firestoreApp.collection('Setup'))
            .then(Setup => {
            console.log(Setup, 'Setup')
            }),
            this.$binding('Packages', this.$firestoreApp.collection('Packages'))
            .then(Packages => {
            console.log(Packages, 'Packages')
            })
        },
    methods: {
        stepBackCurry(){
            this.gg = []
            this.setupselected = []
            this.$refs.stepper.previous()
        },
        stepChecker(){
            if(this.selectEvent === '' || this.selected.length === 0){
                    this.$q.dialog({
                    title: 'Fill all Requirements',
                    message: 'Filled Required?',
                    ok: 'Ok',
                    persistent: true
                })
            }
            else{
                this.$refs.stepper.next()
            }
        },
        openDeleteDialog (task) {
          // this.id = task['.key']
          // this.deleteFoodDialog = true
          // console.log(task, 'task')
          var id = task['.key']
          this.$q.dialog({
            title: 'Delete Package',
            message: 'Delete This Package?',
            ok: 'Yes',
            cancel: 'Cancel'
        }).onOk(() => { 
            this.$firestoreApp.collection('Packages').doc(id).delete()
            this.$q.notify({
                    message: 'Package Deleted!',
                    icon: 'mdi-delete',
                    color: 'negative',
                    textColor: 'white',
                    position: 'center'
                })
        })
        },
        check(){
            if(this.selectEvent === '' && this.selected === []){
                this.$q.dialog({
				title: 'Unable To Continue',
                message: 'Please fill or select something?',
                ok: 'Add',
                cancel: 'Cancel'
                })
            }
        },
        clear(){
            this.addPackDialog = false
            this.selectEvent = ''
            this.selected = []
            this.gg = []
            this.packPriceReal = 0
            this.setupselected = []
        },
        openInclusion (props) {
                this.selectedInclusion = props 
            },
        addpack(){
            if(this.gg.length === 0 || this.packPriceReal === 0 || this.packPriceReal === ''){
                this.$q.dialog({
				title: 'Please Fill all the Requirements',
                message: 'Unable to continue',
                ok: 'Ok',
                }).onOk(()=>{
                    this.addPackDialog = true
                })
            }else{
            this.$q.dialog({
				title: 'Confirm',
			  message: 'Do you want to Add This Package?',
			  ok: 'Add',
			  cancel: 'Cancel'
            })
            .onOk(() => { 
                    let self = this
                    var data = {
                        eventName: this.selectEvent,
                        dishType: this.gg,
                        packagePrice: this.packPriceReal,
                        packageInclusion: this.setupselected
                    } 
                    console.log(data, 'data')
                    self.$firestoreApp.collection('Packages').add(data)
                    this.$q.notify({
                         message: 'Package Added!',
                        icon: 'mdi-folder-plus-outline',
                        color: 'positive',
                        textColor: 'white',
                        position: 'center'
                })          
                        this.incPrice = 0
                        this.addPackDialog = false
                        this.selectEvent = ''
                        this.selected = []
                        this.gg = []
                        this.packPriceReal = 0
                        this.setupselected = []
                })
            }
            
        },
        push(dishName,category){
            let optionss = this.$lodash.countBy(this.Food, m => {
						return m.category == category
                    })
            // let count = this.$lodash.countBy(optionss,'category')  
            console.log(optionss, 'count')  
            let arr = []
            let save = {...category}
            let maxPrice = parseInt(save.maxPrice)
            save.qty = 1
            if(this.gg.length !== 0){
                let index = this.$lodash.findIndex(this.gg, function(o) { return o.dishName == dishName; });
                console.log(index,'index')
                if(index > -1){
                    let check = this.$lodash.findIndex(this.gg[index].category, function(o) { return o.category == category.category; });
                    console.log(check,'check')
                    if(check > -1){
                        this.gg[index].category[check].qty = this.gg[index].category[check].qty + 1
                        this.gg[index].category[check].maxPrice = parseInt(this.gg[index].category[check].maxPrice) + maxPrice 
                    } else {
                        this.gg[index].category.push(save)
                    }
                } else {
                    this.gg.push({dishName: dishName, category: [save]})
                }
            } else {
                    this.gg.push({dishName: dishName, category: [save]})
            }
            console.log(this.gg,'gg')
            console.log(this.gg[0].category,'gg.category')
        },
        spliced(index,dindex){
                this.gg[dindex].category.splice(index,1) 
        },
        dishss(){
           this.blanko = []
            console.log(this.Dishprice)
                if(this.selected.length !== 0){
                    let arr = []
                    for(var x=0; x<this.selected.length; x++){
                        let categ = []
                        let optionss = this.$lodash.map(this.Dishprice, m => {  
                            if(m.dishName === this.selected[x].dishName){
                                let data  = {...m}
                                let key  = data['.key']
                                delete data['.key']
                                data.categoryKey = key
                                console.log(data, 'datas')
                               categ.push(data)
                            }  
                        }) 
                        console.log(categ)
                        arr.push({
                            dishType: this.selected[x].dishName,
                            category: categ
                        }) 
                    }
                    this.blanko = arr
                    console.log(this.blanko,'blanko')
                }else{

                }
        }
    },
    computed: {
        packagePricePerHead(){
                if(this.totalPrice === 0 && this.incPrice === 0 || this.incPrice === ''){
                    return 0
                }else{
                    let pricePH = this.$lodash.sum([parseInt(this.totalPrice),parseInt(this.incPrice)])
                    console.log(pricePH, 'price')
                    return pricePH
                }
            },
        PackIncPrice() {
                    if(this.setupselected.length === 0){
                        return 0
                    }else{
                   // maindishTotalPrice = parseInt(this.saveMainDish.foodPrice) + parseInt(this.saveMainDish.foodPrice)
                    let sum = this.$lodash.sumBy(this.setupselected, a => { 
                        return parseInt(a.setupPrice)
                        })
                    console.log(sum, 'sum')
                    return sum
                    }
        },
        incQuantity(){
                return this.setupselected.length
        },
        totalPrice(){
                    console.log(this.gg,'totalPrice')
                    let price = 0
                    for(var x = 0;x < this.gg.length; x++){
                        let sum = this.$lodash.sumBy(this.gg[x].category, o=> { return parseInt(o.maxPrice); });
                        console.log(sum,'sum')
                        price = price + sum
                    }
                    console.log('price',price)
                    return price
        },
        eventOptions(){
                let options = this.Events.map(Events => {
                    return {
                        label: Events.event,
                        value: Events.event
                    }
                })
                return options
            },
    },
    data () {   
        return {
            packPriceReal: 0,
            setupselected: [],
            gg: [],
            blanko: [],
            filter: '',
            Packages: [],
            columns: [
                { name: 'eventName', required: true, label: 'Event Name:', align: 'center', field: 'eventName', sortable: true },
                { name: 'packagePrice', required: true, label: 'Price:', align: 'center', field: 'packagePrice', sortable: true },
            ],
            filter: '',
            addPackDialog: false,
            quantityInc: 0,
            incPrice: 0,
            pagination: { sortBy: 'Category', descending: false, page: 1, rowsPerPage: 10},
            step: 1,
            categOpt: [],
            selectedInclusion: [],
            maxPriceValue: 0,
            Events: [],
            Dish: [],
            Food: [],
            packIncDialog: false,
            Dishprice: [],
            Category: [],
            Setup: [],
            selected: [],
            selectEvent: '',
            dishcolumn: [
                { name: 'dishName', align: 'center', label: 'Dish', field: 'dishName', sortable: true },
            ],
            setupcolumns: [
                { name: 'setupOne', align: 'center', label: 'Inclusion', field: 'setupOne', sortable: true },
            ],
        }
    }

}
</script>
