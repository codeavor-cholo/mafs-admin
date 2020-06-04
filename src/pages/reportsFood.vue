<template>
    <q-page>
        <q-table title="Food Reports" :data="reservation" :columns="columns" :filter="filter" row-key="name">
                <template v-slot:body="props">
                    <q-tr>
                        <q-td key="dishType" :props="props">{{props.row.dishType}}</q-td>
                        <q-td key="category" :props="props">{{props.row.category}}</q-td>
                        <q-td key="foodName" :props="props">{{props.row.foodName}}</q-td>
                        <q-td key="count" :props="props">
                            {{props.row.__index + 1}}
                        </q-td>
                        <q-td key="ordered" :props="props">
                            {{props.row.count}}
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
            <q-btn label="Print Reports" class="full-width" color="primary" @click="foodReportDialog = true" icon="print" />
            <q-dialog v-model="foodReportDialog" full-width >
                <q-card class="shadow-0">
                    <q-card-section class="row items-center">
                        <strong>FOOD REPORTS(RANKING AND NUMBER OF FOODS SELECTED ON PACKAGE)</strong>
                        <q-space />
                        <q-btn class="bodyText" icon="close" flat round dense v-close-popup>
                            <q-tooltip>
                                Cancel
                            </q-tooltip>
                        </q-btn>
                    </q-card-section>
                    <q-card-section>
                            <div id="printMe" class="col-3 col-md-7">
                                <q-item>
                                    <q-item-section>
                                    <q-item-label overline>Dish Type</q-item-label>
                                    </q-item-section>
                                    <q-item-section>
                                    <q-item-label overline>Food Type</q-item-label>
                                    </q-item-section>
                                    <q-item-section>
                                    <q-item-label overline>Food Name</q-item-label>
                                    </q-item-section>
                                    <q-item-section>
                                    <q-item-label overline>Rank</q-item-label>
                                    </q-item-section>
                                    <q-item-section>
                                    <q-item-label overline>No. of Times Selected on Package</q-item-label>
                                    </q-item-section>
                                </q-item>
                                <q-list v-for="(i, index) in  this.reservation" :key="index" dense>
                                    <q-item clickable v-ripple>
                                        <q-item-section>
                                            <q-item-label lines="1">&nbsp;&nbsp;&nbsp;&nbsp;{{i.dishType}}</q-item-label>
                                        </q-item-section>
                                        <q-item-section>
                                            <q-item-label lines="1">&nbsp;&nbsp;&nbsp;&nbsp;{{i.category}}</q-item-label>
                                        </q-item-section>
                                        <q-item-section>
                                            <q-item-label lines="1">&nbsp;&nbsp;&nbsp;&nbsp;{{i.foodName}}</q-item-label>
                                        </q-item-section>
                                        <q-item-section>
                                            <q-item-label lines="1">&nbsp;&nbsp;&nbsp;&nbsp;{{i.__index + 1}}</q-item-label>
                                        </q-item-section>
                                        <q-item-section>
                                            <q-item-label lines="1">&nbsp;&nbsp;&nbsp;&nbsp;{{i.count}}</q-item-label>
                                        </q-item-section>
                                    </q-item>
                                </q-list>
                                
                            </div>
                            <div class="q-pa-xl">
                                <strong>PREPARED BY: {{foodEditDishType.accountFirstName}} {{foodEditDishType.accountLastName}}</strong>
                            </div>
                    </q-card-section>
                    <q-page-sticky position="bottom-right" :offset="[18, 18]">
                        <div class="text-h6"><q-btn class="bodyText" label="Print" color="primary" @click="printNow" icon="print" /></div>
                    </q-page-sticky>
                </q-card>
            </q-dialog>
            
    </q-page>
</template>
<script>
export default {
    data(){
        return{
            Accounts: [],
            hide: true,
            foodReportDialog: false,
            filter: '',
            Reservation: [],
            Food: [],
            columns: [
                { name: 'dishType', align: 'left', required: true, label: 'Dish Type', field: 'dishType', sortable: true },
                { name: 'category', align: 'center', label: 'Category', field: 'category', sortable: true },
                { name: 'foodName', align: 'right', label: 'Food Name', field: 'foodName', sortable: true },
                { name: 'count', align: 'right', label: 'Most Food Ordered', sortable: true ,field: 'count'},
                { name: 'ordered', align: 'right', label: 'Number of Times selected on Reservation', sortable: true }
            ]
        }
    },
    mounted(){
        this.$binding('Food', this.$firestoreApp.collection('Food'))
            .then(Food => {
            console.log(Food, 'Food')
        }),
        this.$binding('Reservation', this.$firestoreApp.collection('Reservation'))
            .then(Reservation => {
            console.log(Reservation, 'Reservation')
        }),
        this.$binding('Accounts', this.$firestoreApp.collection('Accounts'))
            .then(Accounts => {
            console.log(Accounts, 'Accounts')
        })
    },
    methods:{
        printNow(){
        // this.$htmlToPaper('printMe', () => {
        //   console.log('Printing completed or was cancelled!');
        window.print();
        // })
      },
    },
    computed: {
        foodEditDishType(){ 
                   this.user = this.$firebase.auth().currentUser
                   if(this.user){
                      this.email = this.user.email
                    }
                   let optionss = this.$lodash.filter(this.Accounts, m => {
                    return m.accountEmailAdd == this.email 
                    })   
                        let clientInfo = {...optionss[0]}
                        delete clientInfo.__index
                        delete clientInfo['.key']
                        console.log(clientInfo, 'info')
                        return clientInfo
                        console.log(optionss, 'ss')
                        // return
                        // this.firstName = optionss[0].accountFirstName
                        // console.log(this.firstName, 'sss')
        },
        reservation(){
            let selectedFood = []
            let optionss = this.$lodash.filter(this.Reservation, m => {
                Array.prototype.push.apply(selectedFood, m.clientFoodSelected)
            })
            // console.log(selectedFood, 'selectedFood')
            let count = this.$lodash.countBy(selectedFood,'foodName')
            // console.log(count,'count')

            let mapKey = this.$lodash.map(count, function(value, key){
                return {
                    checkerName: key, 
                    count: value
                }
            })

            let arr = this.Food
            let push = []
            for(var x=0;x<arr.length;x++){
                let data = {...arr[x]}
                let key = data['.key']
                delete data['.key']
                data.foodKey = key

                for(var y=0;y<mapKey.length;y++){
                    if(data.foodName === mapKey[y].checkerName){
                        data.count = mapKey[y].count
                        push.push(data)
                    }
                }
            }
            console.log(push,'push')
            
            let order = this.$lodash.orderBy(push, ['count'], ['desc'])
            console.log(order,'order')


            return order
        }
    }
}   
</script>
<style type = "text/css">
      @media print {
        .bodyText {
            display: none;
          }
        ::-webkit-scrollbar {
            display: none;
        }
      }
</style>