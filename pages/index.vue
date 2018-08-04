<template>
  <v-layout class="row wrap mt-0 pa-0"> 
    <v-flex xs12 class="schName" text-xs-center>
      <v-flex  class="display-2 mb-2" v-text="msg"></v-flex>
      <span class="msgText text-xs-center">
        We have an amazing group of passionate teaching and non-teaching staff who really love what they do.
      </span>
    </v-flex>

    <v-layout row wrap xs12>
      <div class="smallBoxes elevation-3 pa-3 mt-3"  @mouseover="b1 = true" @mouseleave="b1 = false">
        <v-layout ref="box1" row wrap>
          <v-flex xs2 class="ml-2  iconTxt">
          <v-btn fab :large="b1" class="">
            <v-icon dark outline class="bt" color="">people</v-icon>
          </v-btn>
        </v-flex>
        <v-flex xs9 class="ml-3 pl-2 iconTxt">
          <h2 class="mb-3">Passionate Staffs</h2>
          <span class="subtxt">We have an amazing group of passionate teaching and non-teaching staff who really love what they do.</span>
        </v-flex>
        </v-layout>
      </div>
      <div class="smallBoxes elevation-3 pa-3 mt-3"  @mouseover="b2 = true" @mouseleave="b2 = false">
        <v-layout ref="box1" row wrap>
          <v-flex xs2 class="ml-2  iconTxt">
            <v-btn fab :large="b2" class="">
              <v-icon dark class="bt">dashboard</v-icon>
            </v-btn>
          </v-flex>
        <v-flex xs9 class="ml-3 pl-2 iconTxt">
          <h2 class="mb-3">Boarding Facilities</h2>
          <span class="subtxt">We have an amazing group of passionate teaching and non-teaching staff who really love what they do.</span>
        </v-flex>
        </v-layout>
      </div>
    </v-layout>
    <v-layout row wrap xs12 mt-3>
      <div class="smallBoxes elevation-3 pa-3 mt-3"  @mouseover="b3 = true" @mouseleave="b3 = false">
        <v-layout ref="box1" row wrap>
          <v-flex xs2 class="ml-2  iconTxt">
            <v-btn fab :large="b3" class="">
              <v-icon dark class="bt">thumb_up_alt</v-icon>
            </v-btn>
          </v-flex>
        <v-flex xs9 class="ml-3 pl-2 iconTxt">
          <h2 class="mb-3">Sporting Facilities</h2>
          <span class="subtxt">We have an amazing group of passionate teaching and non-teaching staff who really love what they do.</span>
        </v-flex>
        </v-layout>
      </div>
      <div class="smallBoxes elevation-3 pa-3 mt-3"  @mouseover="b4 = true" @mouseleave="b4 = false">
        <v-layout ref="box1" row wrap>
          <v-flex xs2 class="ml-2  iconTxt">
            <v-btn fab :large="b4" color="">
              <v-icon dark class="bt">security</v-icon>
            </v-btn>
          </v-flex>
          <v-flex xs9 class="ml-3 pl-2 iconTxt">
            <h2 class="mb-3">Security</h2>
            <span class="subtxt">We have an amazing group of passionate teaching and non-teaching staff who really love what they do.</span>
          </v-flex>
        </v-layout>
      </div>
    </v-layout>
  </v-layout>
</template>

<script>
export default {
  data () {
    return {
      msg: 'Secportal Solutions',
      b1: false,
      b2: false,
      b3: false,
      b4: false
    }
  }
}
</script>

<style scoped>

.v-footer span{
  color: #ffffb3;
  font-size: 20px !important;
  font-family: '', cursive;
  text-decoration: none !important;
  text-transform: none !important;
}

.title {
  font-weight: bold;
  font-size: 43px !important;
  font-family: 'Great Vibes';
}
.footerTitle {
  font-weight: bold;
  font-style: oblique;
}
.footerchildren {
  font-size: 12px;

}
.childLink {
  text-decoration: none !important;
}
.footer {
  width: 100% !important;
  margin: auto !important;
}
.msgText {
  text-align: justify;
  font-size: 20px;
  color: rgb(75, 75, 71);
  font-family: sans-serif                 
}

.smallBoxes {
  margin: 0 auto;
  display: block;
  width: 47%;
  /* max-width: 600px; */
  /* border: 1px solid red */
}
.iconTxt h2, .bt{
  color: seagreen !important
}
.subtxt {
  color: rgb(97, 97, 92) !important
}
.about {
  /* margin: 0 auto !important; */
  width: 100% !important;
  border: 1px solid red
}
</style>
