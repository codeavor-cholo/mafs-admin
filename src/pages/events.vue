<template>
    <q-page padding>
        <q-table title="" :data="Events" :columns="columns" :filter="filter" row-key="name">
    <template v-slot:body="props">
        <q-tr :props="props">
            <q-td key="name" :props="props">
            {{ props.row.name }}
            <q-popup-edit v-model="props.row.event" title="Edit the Name">
              <q-input v-model="props.row.event" dense autofocus counter />
            </q-popup-edit>
          </q-td>
          <q-td key="event" :props="props">{{props.row.event}}</q-td>
          <q-td key="description" :props="props">{{props.row.description}}</q-td>
          <q-td key="action" :props="props">
            <q-btn no-caps dense color="primary" label="Update Event" icon="mdi-pencil" @click="openEditDialog(props.row)"></q-btn>
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
            <q-btn fab icon="add" color="accent" @click="addEventDialog = true" />
            <q-tooltip>
                Add Event
            </q-tooltip>
          </q-page-sticky>
    <!--dialog-->
    <q-dialog v-model="addEventDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">New Event Name</div>
        </q-card-section>

        <q-card-section>
          <q-input class="q-ma-sm" v-model="event" label="Event Name"/>
          <q-input class="q-ma-sm" v-model="descriptions" label="Event Description" autogrow/>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" @click="clear" v-close-popup />
          <q-btn flat label="Add Event" v-close-popup v-on:click="addEvent" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!--Modal for upadate-->
    <q-dialog v-model="editDialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Edit Event</div>
        </q-card-section>

        <q-card-section>
          <q-input  class="q-ma-sm" v-model="updateEvent" label="Event Name" />
          <q-input class="q-ma-sm" v-model="updateDescription" label="Event Description" autogrow/>
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
    mounted () {
      this.$binding('Events', this.$firestoreApp.collection('Events'))
        .then(Events => {
          console.log(Events, 'Events')
        })
    },
    computed: {
          reverseItems() {
              return this.Events.slice().reverse();
        }     
      },
    methods: {
        clear(){
            this.event = ''
            this.descriptions = ''
        },
        openEditDialog (task) {
          this.eventId = task['.key']
          this.updateEvent = task.event
          this.updateDescription = task.description
          this.editDialog = true
        },

        addEvent () {
            var event = {
                event: this.event,
                description: this.descriptions
            }
            let optionss = this.$lodash.filter(this.Events, m => {
                if(m.event === this.event){
                    return m
                }
            })   
                console.log(optionss, 'option')
            if(this.event === '' || this.descriptions === '') {
              this.$q.dialog({
              title: 'Field Required!',
              message: 'Fill all Requirements?',
              ok: 'Ok',
              persistent: true
            }).onOk(()=>{
              this.addEventDialog = true
            })
            }else{
              if(optionss.length > 0){
                        this.$q.dialog({
                    title: 'Duplicate Entry!',
                    message: 'Unable to save?',
                    ok: 'Ok',
                    persistent: true
                    }).onOk(() => {
                        this.addEventDialog = true
                    })
                }else{
                    this.$q.dialog({
                    title: 'Add Event',
                    message: 'Add This Event?',
                    ok: 'Yes',
                    cancel: 'Cancel',
                    persistent: true
                  }).onOk(() => { 
                      this.$firestoreApp.collection('Events').add(event)
                      this.$q.notify({
                              message: 'Event Added!',
                              icon: 'mdi-folder-plus-outline',
                              color: 'positive',
                              textColor: 'white',
                              position: 'center'
                          })
                            this.event = ''
                            this.descriptions = ''
                  }).onCancel(()=>{
                        this.addEventDialog = true
                  })
                }
            }
        },
        openDeleteDialog (task) {
          // this.id = task['.key']
          // this.deleteFoodDialog = true
          // console.log(task, 'task')
          var id = task['.key']
          this.$q.dialog({
            title: 'Delete Event',
            message: 'Delete This Event?',
            ok: 'Yes',
            cancel: 'Cancel'
        }).onOk(() => { 
            this.$firestoreApp.collection('Events').doc(id).delete()
            this.$q.notify({
                    message: 'Event Deleted!',
                    icon: 'mdi-delete',
                    color: 'negative',
                    textColor: 'white',
                    position: 'center'
                })
        })

        },
        deleteEvents (task) {
            var id = task['.key']
            this.$firestoreApp.collection('Events').doc(id).delete()
        },
        setTask(){
          var eventBago = {
            event: this.updateEvent,
            description: this.updateDescription
            }
            if(this.updateEvent === '' || this.updateDescription === ''){
             this.$q.dialog({
              title: 'Field Required!',
              message: 'Fill all Requirements?',
              ok: 'Ok',
              cancel: 'Cancel'
            })
            }else
            this.$q.dialog({
            title: 'Update Event',
            message: 'Update This Event?',
            ok: 'Yes',
            cancel: 'Cancel'
        }).onOk(() => { 
            this.$firestoreApp.collection('Events').doc(this.eventId).set(eventBago)
            this.$q.notify({
                    message: 'Event Updated!',
                    icon: 'mdi-update',
                    color: 'positive',
                    textColor: 'white',
                    position: 'center'
                }) 
                this.editDialog = false
        })
        }
    },
    data () {
        return {
            eventId: '',
            updateEvent: '',
            descriptions: '',
            updateDescription: '',
            editDialog: false,
            addEventDialog: false,
            editEvent: '',
            addEventDialog: false,
            Events: [],
            filter: '',
            event: '',
            columns: [
        { name: 'event', required: true, label: 'Event', align: 'left', sortable: true },
        { name: 'description', label: 'Event Description', field: 'description', sortable: true },
        { name: 'action', label: 'Action' }
      ]
        }
    }
}
</script>