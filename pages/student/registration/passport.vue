<template>
  <div class="">
    <v-layout row wrap>
      <panel title="Upload Passport" class="panel">
        <v-flex xs9 class="" >
          <h3 class="center">Select Passport <i class="studentNames">{ {{regNames.lastname + ' ' + regNames.firstname}} }</i></h3>
          <div class="center">
            <span class="TypeSize">Passport must be of type JPG|JPEG|PNG and size 1 megabite or less</span>
          </div>
          <v-divider class=" mb-3" />
          <div class="">
            <input class="" v-if="!image" type="file" id="file" ref="file" @change="handleFileUpload" />
            <img v-else :src="image" />
          </div>
          <v-divider class="mt-3"></v-divider>
          <div class="danger-alert" v-html="errorMsg"></div>
          <div class="center">
            <v-btn
              v-if="image"
              class=""
              type="submit"
              @click="save">
              Register
            </v-btn>
            <v-btn
              v-if="image"
              color="red darken-2"
              class=""
              type="submit"
              @click="removeImage">
              Remove Image
            </v-btn>
          </div>
        </v-flex>
      </panel>
    </v-layout>
      <v-snackbar
      absolute
        auto-height
        :timeout="timeout"
        :top="y === 'top'"
        :bottom="y === 'bottom'"
        :right="x === 'right'"
        :left="x === 'left'"
        :vertical="mode === 'vertical'"
        v-model="snackbar"
      >
        {{ Message }} {{ regNum }}
        <v-btn flat color="pink" @click.native="snackbar = false">Close</v-btn>
      </v-snackbar>

  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      image: '',
      file: '',
      errorMsg: '',
      // studId: '',
      snackbar: false,
      y: 'top',
      x: null,
      mode: '',
      regNum: '',
      timeout: 10000,
      Message: `Your registration still in progress and your Identification Number Has been generated: `
    }
  },
  computed: mapState({
    regNames: 'studentRegData',
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

    async save (event) {
      event.preventDefault()

      // submit registration here
      // process passport and update student passport
      let formData = new FormData();
      formData.append('file', this.file);
      await this.$axios.put(`/upload-passport/`,
        formData,
          {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
          }
        )
        .then((success) => {
          if (success) {
            this.$router.push({
              name: 'student-registration-confirmation'
            })
          }
        })
        .catch(function(){
          console.log('FAILURE!!')
        })
    }

  },

  middleware: 'showStudentReg',
}
</script>

<style lang="css" scoped>
img {
  width: 200px;
  height: 200px;
  margin: auto;
  display: block;
  margin-bottom: 10px;
}
input{
  margin: 0 auto;
  display: block;
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
  width: 450px;
  margin: 0 auto !important;
}
.danger-alert {
  color: red;
  font-weight: 600;
  width: auto;
  margin: auto
}
</style>
