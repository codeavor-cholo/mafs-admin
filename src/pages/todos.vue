<template>
    <q-page>
        <!-- <q-input standout v-model="todo" dense label="Enter" @keyup.enter="addTodo">
        <template v-slot:append>
          <q-btn  color="primary" icon="mdi-send" @click="addTodo" />
        </template>
      </q-input>
      

        <q-list bordered padding class="rounded-borders">
      <q-item-label header>To Do List</q-item-label>

      <q-item clickable v-ripple v-for="(todo, index) in todos" :key="index">
        <q-item-section avatar top>
          <q-checkbox v-model="todo.isDone" @input="updateTask(todo)" />
        </q-item-section>

        <q-item-section>
          
          <q-item-label lines="1">{{todo.todoName}}</q-item-label>
          <q-item-label caption>February 22nd, 2019</q-item-label>
        </q-item-section>

        <q-item-section side>
          <div class="row">
          <q-btn round color="primary" icon="mdi-pencil" @click="openEditDialog(todo)" />
          <q-btn round color="negative" icon="mdi-delete" @click="deletetodo(todo)" />
          </div>
        </q-item-section>
      </q-item>

    </q-list>
         <q-dialog v-model="editDialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Edit Task</div>
        </q-card-section>

        <q-card-section>
          <q-input dense v-model="editTodoName" autofocus />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Update Task" @click="setTask" />
        </q-card-actions>
      </q-card>
    </q-dialog> -->
    <div>
      <apexcharts width="800" type="bar" :options="options" :series="getData"></apexcharts>
      <strong class="q-pl-xl">Most Booked Months</strong>
    </div>

    </q-page>   
</template>
<script>
import VueApexCharts from 'vue-apexcharts'
import VueChart from 'vue-chart-js'
import { date } from 'quasar'
export default { 
    components:{
      VueChart,
      apexcharts: VueApexCharts,
    },  
    mounted () {
      this.$binding('todos', this.$firestoreApp.collection('todos'))
        .then(todos => {
          console.log(todos, 'todos')
        })
      this.$binding('Reservation', this.$firestoreApp.collection('Reservation'))
        .then(Reservation => {
          console.log(Reservation, 'Reservation')
        })
    },
    data () {
        return {
            todo: '',
            Reservation: [],
            isDone: false,
            todos: [],
            editDialog: false,
            editTodoName: '',
            editTodoId: '',
            options: {
            chart: {
              id: 'vuechart-example'
            },
            xaxis: {
              categories: ['Nov 2019', 'Dec','Jan 2020', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep' , 'Oct']
            }
          },
            series: [{
              name: 'series-1',
              data: [30, 40, 45, 50, 49, 60, 70, 91,12,32,169,20]
            }]

        }
    },
    computed:{
        getData(){
          let dates = this.$lodash.filter(this.Reservation, a=>{
            let check = date.formatDate(a.clientReserveDate, 'MMM')
            a.checkMonth = check
            return a
          })
          console.log(dates,'getData')
          let count = this.$lodash.countBy(dates, 'checkMonth')
          let months = ['Nov', 'Dec','Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep' , 'Oct']
          let pushValues = []
          for(var x=0; x<months.length; x++){
            let mapKey = this.$lodash.map(count, function(value, key){
              if(key == months[x]){
                pushValues.push(value)
              } else {
                pushValues.push(0)
              }
            })

          }

          console.log(count,'count')
          console.log(pushValues,'pushValues')
          let returnThis = {
            name: 'series-1',
            data: pushValues
          }
          console.log(returnThis,'return')
          return [returnThis]
        }
    },
    methods: {
        addTodo () {
            var todo = {
                todoName: this.todo,
                isDone: this.isDone,
                createdAt: new Date()
            }

            // this.todos.push(todo)
            // console.log(this.todos, 'laman')
            this.$firestoreApp.collection('todos').add(todo)
            this.todo = ''
        },
        deletetodo (task) {
            var id = task['.key']
            this.$firestoreApp.collection('todos').doc(id).delete()
        },
        updateTask(task){
          var id = task['.key']
          this.$firestoreApp.collection('todos').doc(id).update({
            isDone: task.isDone
          })
        },
        openEditDialog (task) {
          this.editTodoId = task['.key']
          this.editTodoName = task.todoName
          this.editDialog = true
        },
        setTask(){
          var todoBago = {
            todoName: this.editTodoName,
            isDone: false,
            createdAt: new Date()
          }
          this.$firestoreApp.collection('todos').doc(this.editTodoId).set(todoBago)
          this.editDialog = false
        },
        test () {
            console.log(this.todos)
        }
    }
}
</script>