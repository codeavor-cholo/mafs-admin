<template>
    <q-page>  
        <div class="mapouter col-12" >
          <div class="gmap_canvas row justify-center q-pt-md">
                  <iframe width="70%" height="500" id="gmap_canvas" :src="'https://maps.google.com/maps?q='+locationRecode+'&t=&z=13&ie=UTF8&iwloc=&output=embed'" frameborder="1" scrolling="no" marginheight="0" marginwidth="0"></iframe>
                  <a href="https://www.embedgooglemap.net"></a>
          </div>
        </div>
    </q-page>
</template>
<script>
export default {
    data(){
        return {
            
        }
    },
    computed: {
        locationRecode () {
        try {
                let location = '39 Pugad Lawin, Project 8, Lungsod Quezon, Philippines'
                // let location = this.selectedSchedule.location
                location = encodeURIComponent(location.trim())
                // console.log('for g-map location', location)
                return location
            } catch (err) {
                return ''
            }
        }
    }
}
</script>
<style lang="stylus">
.mapouter{
  text-align:right;height:350px;width:auto;
}
.gmap_canvas {
  overflow:hidden;background:none!important;height:350px;width:auto;
}
</style>