<template>
    <v-layout row wrap>
      <panel title="Change Passport" class="panel">
        <!-- <v-flex  class="" > -->
        <h3 class="center ">Select Passport <i class="studentNames">{ {{student.lastname + ' ' + student.firstname}} }</i></h3>
          <v-flex xs class="center">
            <span class="TypeSize">Passport must be of type JPG|JPEG|PNG and size 1 megabite or less</span>
          </v-flex>
          <v-divider class=" mb-3" />
          <v-flex class="center">
            <input class="" v-if="!image" type="file" id="file" ref="file" @change="handleFileUpload" />
            <img v-else :src="image" />
          </v-flex>
          <v-divider class="mt-3"></v-divider>
          <v-flex xs3 class="danger-alert" v-html="errorMsg"></v-flex>
          <v-flex class="center">
            <v-btn
              v-if="image"
              class=""
              type="submit"
              @click="changePassport">
              Upload
            </v-btn>
            <v-btn
              v-if="image"
              color="red darken-2"
              class=""
              type="submit"
              @click="removeImage">
              Remove Image
            </v-btn>
          </v-flex>
      <!-- </v-flex> -->
    </panel>
    </v-layout>
</template>
<script>
import { mapState } from 'vuex'
import { log } from 'util';
export default {
  middleware: 'studentAuth',
  data () {
    return {
      image: '',
      file: '',
      errorMsg: '',
      mode: '',
      regNum: '',
    }
  },
  computed: mapState({
    student: 'student',
    // studId: 'studId'
  }),
  methods: {
    handleFileUpload(e){
      const maxSize = 1e+6
      this.file = this.$refs.file.files[0];
      const files = e.target.files || e.dataTransfer.files;
      if (!files.length) {
        return;
      }
      if ( ! /\.(jpg|jpeg|png)$/i.test(files[0].name)) {
        this.errorMsg = 'Invalid image type'
        return;
      }
      if (files[0].size > maxSize) {
        this.errorMsg = 'Invalid image size'
        return;
      }
      this.errorMsg = ''
      this.createImage(files[0]);
      console.log(files[0].size);
    },
    createImage(file) {
      var image = new Image();
      var reader = new FileReader()
      var vm = this;

      reader.onload = (e) => {
        vm.image = e.target.result
      }
      reader.readAsDataURL(file)
    },
    removeImage: function (e) {
      this.image = '';
    },

    async changePassport (event) {
      event.preventDefault()
      // submit registration here
      // process passport and update student passport
      let formData = new FormData();
      const studId = this.student.studId
      formData.append('file', this.file);
      const response = await this.$axios.put(`/change-passport/${studId}`,
        formData,
        {
          headers: {
              'Content-Type': 'multipart/form-data'
          }
        }
      )
      console.log(response.data);
      this.$store.commit('setStudent', response.data)
      this.$router.push({
        name: 'student-dashboard',
      })
    }

  },
}
</script>

<style lang="css" scoped>
img {
  width: 200px;
  height: 200px;
  margin: auto;
  /* display: block; */
  margin-bottom: 10px;
}
.studentNames {
  color: #808080 !important;
  font-size: 16px !important;
}
.TypeSize {
  font-style: italic !important;
  color: #808080 !important;
  font-size: 14px !important;
}
.center {
  text-align: center;
  /* width: 450px; */
  margin: 0 auto !important;
}
/* .center input {
  border: 1px solid #000;
  margin: 0 auto;
} */
.danger-alert {
  color: red;
  text-align: center;
  font-weight: 600;
  /* width: auto; */
  margin: auto
}
</style>
