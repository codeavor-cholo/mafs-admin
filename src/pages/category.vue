<template>
    <q-page padding>
        <q-table
      title=""
      :data="Category"
      :columns="columns"
      :filter="filter"
      row-key="name"
    >
    <template v-slot:body="props">
        <q-tr :props="props">
            <q-td key="name" :props="props">
            {{ props.row.name }}
            <q-popup-edit v-model="props.row.category" title="Edit the Name">
              <q-input v-model="props.row.category" dense autofocus counter />
            </q-popup-edit>
          </q-td>
          <q-td key="dishType" :props="props">{{props.row.dishType}}</q-td>
          <q-td key="category" :props="props">{{props.row.category}}</q-td>
          <q-td key="action" :props="props">
            <q-btn no-caps dense color="primary" label="Update" icon="mdi-pencil" @click="openEditDialog(props.row)"></q-btn>
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
            <q-btn fab icon="add" color="accent" @click="addCategoryDialog = true" />
            <q-tooltip>
                Add Food Type
            </q-tooltip>
          </q-page-sticky>
    <!--dialog-->
    <q-dialog v-model="addCategoryDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">New Food Category</div>
        </q-card-section>

        <q-card-section>
          <q-select class="q-ma-sm" filled v-model="selectDishType" :options="foodDishOptions" label="Dish Type" emit-value map-options style="width: 500px"/>
          <q-input class="q-ma-sm" dense v-model="category" label="Category Name"/>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" @click="clear" v-close-popup />
          <q-btn flat label="Add Category" v-close-popup v-on:click="addCategory" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!--Modal for upadate-->
    <q-dialog v-model="editDialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Edit Category</div>
        </q-card-section>

        <q-card-section>
          <q-select class="q-ma-sm" filled v-model="updateDishType" :options="foodDishOptions" label="Dish Type" style="width: 500px"/>
          <q-input class="q-ma-sm" dense v-model="updateCategory" />
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
    computed: {
      foodDishOptions(){
                let optionss = this.Dish.map(Dish => {
                    return {
                        label: Dish.dishName,
                        value: Dish.dishName
                    }
                })

                return optionss
            }
    },
    mounted () {
      this.$binding('Category', this.$firestoreApp.collection('Category'))
        .then(Category => {
          console.log(Category, 'Category')
        }),
      this.$binding('Dish', this.$firestoreApp.collection('Dish'))
        .then(Dish => {
          console.log(Dish, 'Dish')
        })
    },
    methods: {
        clear(){
          this.selectDishType = ''
          this.category = ''
        },
        openEditDialog (task) {
          this.categoryId = task['.key']
          this.updateCategory = task.category
          this.updateDishType = { label: task.dishType, value: task.dishType }
          this.editDialog = true
        },
        openDeleteDialog (task) {
          // this.id = task['.key']
          // this.deleteFoodDialog = true
          // console.log(task, 'task')
          var id = task['.key']
          this.$q.dialog({
            title: 'Delete Category',
            message: 'Delete This Category?',
            ok: 'Yes',
            cancel: 'Cancel'
        }).onOk(() => { 
            this.$firestoreApp.collection('Category').doc(id).delete()
            this.$q.notify({
                    message: 'Category Deleted!',
                    icon: 'mdi-delete',
                    color: 'negative',
                    textColor: 'white',
                    position: 'center'
                })
        })
        },
        addCategory () {
            var category = {
                category: this.category,
                dishType: this.selectDishType
            }
            let optionss = this.$lodash.filter(this.Category, m => {
                if(m.category === this.category){
                    return m
                }
            })
            if(this.category === '' || this.selectDishType === '') {
              this.$q.dialog({
              title: 'Field Required!',
              message: 'Fill all Requirements?',
              ok: 'Ok',
              persistent: true
            }).onOk(()=>{
              this.addCategoryDialog = true
            })
            }else{
                if(optionss.length > 0){
                    this.$q.dialog({
                    title: 'Duplicate Entry!',
                    message: 'Unable to save?',
                    ok: 'Ok',
                    persistent: true
                    }).onOk(() => {
                        this.addCategoryDialog = true
                    })
                  }else{
                  this.$q.dialog({
                  title: 'Add Category',
                  message: 'Add This Category?',
                  ok: 'Yes',
                  cancel: 'Cancel',
                  persistent: true
                  }).onOk(() => { 
                      this.$firestoreApp.collection('Category').add(category)
                      this.$q.notify({
                              message: 'Category Added!',
                              icon: 'mdi-folder-plus-outline',
                              color: 'positive',
                              textColor: 'white',
                              position: 'center'
                          })
                            this.category = ''
                            this.selectDishType = ''
                  }).onCancel(()=>{
                    this.addCategoryDialog = true
                  })
                }
              }
        },
        setTask(){
            var categoryBago = {
            category: this.updateCategory,
            dishType: this.updateDishType.value
            }
            if(this.updateCategory === '' && this.updateDishType === ''){
             this.$q.dialog({
              title: 'Field Required!',
              message: 'Fill all Requirements?',
              ok: 'Ok', 
              cancel: 'Cancel'
            })
            }else
            this.$q.dialog({
            title: 'Update Category',
            message: 'Update This Category?',
            ok: 'Yes',
            cancel: 'Cancel'
        }).onOk(() => { 
            this.$firestoreApp.collection('Category').doc(this.categoryId).set(categoryBago)
            this.$q.notify({
                    message: 'Category Updated!',
                    icon: 'mdi-update',
                    color: 'positive',
                    textColor: 'white',
                    position: 'center'
                }) 
                this.editDialog = false
        })
            
        },
        deleteCategory (task) {
            var id = task['.key']
            this.$firestoreApp.collection('Category').doc(id).delete()
        }
    },
    data () {
        return {
            updateDishType: '',
            Dish: [],
            selectDishType: '',
            updateCategory: '',
            editDialog: false,
            addCategoryDialog: false,
            Category: [],
            filter: '',
            category: '',
            columns: [              
        { name: 'dishType', required: true, label: 'Dish Type', align: 'left', field: row => row.dishType, format: val => `${val}`, sortable: true },
        { name: 'category', align: 'center', label: 'Food Type', field: 'category', sortable: true },
        { name: 'action', label: 'Action' }
      ]
        }
    }
}
</script>