<template>
    <q-page padding>
        <q-table title="" :data="Gallery" :columns="columns" :filter="filter" row-key="name">
            <template v-slot:body="props">
                <q-tr :props="props">
                    <q-td key="eventPic" :props="props">
                        <q-img :src="props.row.eventPic" style="width: 150px" :ratio="1" basic spinner-color="white"></q-img>
                    </q-td>
                    <q-td key="eventName" :props="props">{{props.row.eventName}}</q-td>
                    <q-td key="eventDes" :props="props">{{props.row.eventDes}}</q-td>
                    <q-td key="action" :props="props">
                        <q-btn no-caps dense color="primary" icon="mdi-pencil" @click="viewGalleryPic = true, openGalleryPic(props.row)"></q-btn>
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
                <q-btn fab icon="add" color="accent" @click="addPicDialog = true" />
                <q-tooltip>
                    Add Picture
                </q-tooltip>
        </q-page-sticky>
        <!--dialog-->
        <q-dialog v-model="addPicDialog" persistent>
            <q-card style="min-width: 400px">
                <q-card-section>
                    <div class="text-h6">New Picture</div>
                </q-card-section>

                <q-card-section>
                    <q-uploader ref="foodref" extensions="'.gif,.GIF,.jpg,.JPG,.jpeg,.JPEG,.png,.PNG'" @added="photoAdded" @removed="photoRemove" :url="foodpic" label="Upload Photo" color="purple" square flat bordered style="width: 500px" />
                    <q-input class="q-ma-sm" v-model="picdes" label="Description" autogrow/>
                    <q-select class="q-ma-sm" :options="eventOptions" emit-value map-options v-model="eventName" label="Event"/>
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                    <q-btn flat label="Cancel" v-close-popup />
                    <q-btn flat label="Add Pic" v-close-popup v-on:click="addPic" />
                </q-card-actions>
            </q-card>
        </q-dialog>

        <q-dialog v-model="viewGalleryPic" persistent>
            <q-card style="min-width: 600px">
                            <q-img :src="this.selectedGalleryPic.eventPic" v-show="hideGalleryImage" class="full-width" style="height: 300px">
                                <q-btn @click="hideGalleryUploader = true, hideGalleryImage = false" round color="blue" icon="mdi-pencil">
                                  <q-tooltip>
                                      Update Image
                                  </q-tooltip>  
                                </q-btn> 
                            </q-img>
                            <div v-show="hideGalleryUploader">
                            <q-btn @click="hideGalleryUploader = false, hideGalleryImage = true" flat round dense icon="close">
                                <q-tooltip>
                                    cancel
                                </q-tooltip>  
                            </q-btn> 
                            <q-uploader class="full-width" ref="foodref" extensions="'.gif,.GIF,.jpg,.JPG,.jpeg,.JPEG,.png,.PNG'" @added="photoAdded" @removed="photoRemove" :url="foodpic" label="Upload Photo" color="purple" square flat bordered />
                            </div>
                            <q-select class="q-ma-sm" :options="eventOptions" v-model="editEventName" label="Event"/>
                            <q-input class="q-ma-sm" label="Description" v-model="editEventDes" autogrow />
                        <q-card-section>
                    </q-card-section>

                    <q-card-actions align="right" class="text-primary">
                        <q-btn flat label="Cancel" @click="hideGalleryUploader = false, hideGalleryImage = true" v-close-popup />
                        <q-btn flat label="Update" @click="setTask" v-close-popup />
                    </q-card-actions>
                </q-card>
        </q-dialog>
        
    </q-page>
</template>
<script>
    let sri = require('simple-random-id')
export default {
    data(){
        return {
            hideGalleryUploader: false,
            hideGalleryImage: true,
            Gallery: [],
            Events: [],
            picdes: '',
            addPicDialog: false,
            eventName: '',
            picFood: '',
            viewGalleryPic: false,
            editEventName: '',
            selectedGalleryPic: [],
            editEventDes: '',
            foodpic: '',
            newFoodPic: '',
            storageRef: null,
            filter: '',
            columns: [
                { name: 'eventPic', align: 'left', label: 'Picture', field: 'eventPic', sortable: true },
                { name: 'eventName', align: 'left', label: 'Event Name', field: 'eventName', sortable: true },
                { name: 'eventDes', required: true, label: 'Event Description', align: 'center', field: 'eventDes', sortable: true },
                { name: 'action', label: 'Action' }
            ]
        }
    },
    mounted () {
        this.$binding('Events', this.$firestoreApp.collection('Events'))
        .then(Events => {
          console.log(Events, 'Events')
        }),
        this.$binding('Gallery', this.$firestoreApp.collection('Gallery'))
        .then(Gallery => {
          console.log(Gallery, 'Gallery')
        }),
        this.storageRef = this.$firebase.storage().ref()
            console.log(this.storageRef, 'store')
    },
    computed:{
        eventOptions(){
                let optionss = this.Events.map(Events => {
                    return {
                        label: Events.event,
                        value: Events.event
                    }
                })

                return optionss
            },
    },
    methods: {
        openGalleryPic (props) {
          this.selectedGalleryPic = props 
          this.galleryId = props['.key']
          this.editEventDes = props.eventDes
          this.editEventName = {label: props.eventName, value: props.eventName}
        },
        photoAdded (p) {
            var photo = this.$refs.foodref.files[0]
            
            this.picFood = photo
            console.log('photo2', photo)
        },
        uploadFoodPhoto: async function () {
                let promise = new Promise((resolve, reject ) => {
                
                let foodss = this.picFood
                let random = sri(9)
                console.log(random, 'rand')
                console.log(this.foodpic, 'foodref')
                let vm = this
                let uploadTask = vm.storageRef.child(`eventPhotos/${random}`).put(foodss)
                uploadTask.on('state_changed', function (snapshot) {
                }, function (error) {
                // Handle unsuccessful uploads
                // this.$q.notify({
                //     message: 'An error occur',
                //     type: 'negative',
                //     color: 'negative',
                //     textColor: 'white',
                //     icon: 'warning'
                // })
                console.log('error occur', error)
                }, function () {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                    console.log(uploadTask, 'upload')
                    vm.foodpic = downloadURL
                    resolve(downloadURL)
                    console.log(downloadURL, 'download')
                })
                })
            })
            let result = await promise
            console.log('result',result)
            this.newFoodPic = result
            this.foodpic = this.newFoodPic
            return result
        },
        addPic () {
            let vm = this
                if(this.picdes === '' && this.eventName === ''){
                  this.$q.dialog({
                  title: 'Field Required!',
                  message: 'Fill all Requirements?',
                  ok: 'Ok',
                  persistent: true
                }).onOk(()=>{
                    this.addPicDialog = true
                })
                }else
                this.$q.dialog({
                title: 'Add Food',
                message: 'Add This Food?',
                ok: 'Yes',
                cancel: 'Cancel'
            }).onOk(() => {
                vm.uploadFoodPhoto()
                .then((user) => {
                  var picEvent = {
                  eventPic: this.newFoodPic,
                  eventName: this.eventName,
                  eventDes: this.picdes
                  }
                  vm.$firestoreApp.collection('Gallery').add(picEvent)
                  this.$q.notify({
                        message: 'Picture Added!',
                        icon: 'mdi-folder-plus-outline',
                        color: 'positive',
                        textColor: 'white',
                        position: 'center'
                    })
                        this.eventName = ''
                        this.picdes = ''
                    })
                }).onCancel(()=>{
                    this.addPicDialog = true
                })
        },
        openDeleteDialog (task) {
          var id = task['.key']
          this.$q.dialog({
            title: 'Delete Gallery',
            message: 'Delete This Gallery?',
            ok: 'Yes',
            cancel: 'Cancel'
        }).onOk(() => { 
            this.$firestoreApp.collection('Gallery').doc(id).delete()
            this.$q.notify({
                    message: 'Gallery Deleted!',
                    icon: 'mdi-delete',
                    color: 'negative',
                    textColor: 'white',
                    position: 'center'
                })
        })

        },
        setTask(){
              if(this.$refs.foodref.files.length === 0){
                  var picBago = {
                        eventPic: this.selectedGalleryPic.eventPic,
                        eventName: this.editEventName.value,
                        eventDes: this.editEventDes
                        }
                      if(this.editEventDes === '' && this.editEventName === ''){
                          this.$q.dialog({
                          title: 'Field Required!',
                          message: 'Fill all Requirements?',
                          ok: 'Ok',
                          cancel: 'Cancel'
                        })
                        }else{
                        this.$q.dialog({
                        title: 'Update Gallery',
                        message: 'Update This Gallery?',
                        ok: 'Yes',
                        cancel: 'Cancel'
                        }).onOk(() => { 
                            this.$firestoreApp.collection('Gallery').doc(this.galleryId).set(picBago)
                            this.$q.notify({
                                    message: 'Gallery Updated!',
                                    icon: 'mdi-update',
                                    color: 'positive',
                                    textColor: 'white',
                                    position: 'center'
                                })
                                  this.viewGalleryPic = false  
                        }).onCancel(()=>{
                             this.viewGalleryPic = true
                        })  
                    }
                  }else{
                      let vm = this
                      if(this.editEventName === '' && this.editEventDes === ''){
                          this.$q.dialog({
                          title: 'Field Required!',
                          message: 'Fill all Requirements?',
                          ok: 'Ok',
                          persistent: true
                        }).onOk(()=>{
                            viewGalleryPic = true
                        })
                        }else{
                        this.$q.dialog({
                        title: 'Update Gallery',
                        message: 'Update This Gallery?',
                        ok: 'Yes',
                        cancel: 'Cancel',
                        persistent: true
                        }).onOk(() => { 
                          console.log('rtgrh')
                          vm.uploadFoodPhoto()
                          .then((user) => {
                            var picBago = {
                                eventPic: this.newFoodPic,
                                eventName: this.editEventName.value,
                                eventDes: this.editEventDes
                            }
                            this.$firestoreApp.collection('Gallery').doc(this.galleryId).set(picBago)
                            this.$q.notify({
                                    message: 'Gallery Updated!',
                                    icon: 'mdi-update',
                                    color: 'positive',
                                    textColor: 'white',
                                    position: 'center'
                                })
                                  this.viewGalleryPic = false      
                          })
                        }).onCancel(()=>{
                             this.viewGalleryPic = true
                        })
                      }
                    } 
                  }
    }
}
</script>