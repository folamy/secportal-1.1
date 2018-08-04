<template>
  <panel title=" others" class="panel">
    <v-layout row wrap class="tableItems mt-4">
      <v-flex xs6>
        <v-subheader class="title">Payment for:</v-subheader>
      </v-flex>
        <v-flex xs6 class="mt-2">
          <v-select
            outline
            clearable
            v-model="select"
            :items="items"
            label="Select"
            item-value="value"
            required
            @input="itemsControl()"
          >
          </v-select>
        </v-flex>
      </v-layout>
      <v-layout row wrap class="tableItems mt-2" v-if="selectItems.length">
        <v-flex xs6>
          <v-subheader class="title" v-text="'Select Items'"></v-subheader>
        </v-flex>
        <v-flex xs6>
          <v-select
            outline
            clearable
            :items="selectItems"
            v-model="selecteds"
            label="Items"
            multiple
            return-object
            max-height="400"
            hint="Select books and click outside the dropdown box"
            persistent-hint
          ></v-select>
        </v-flex>
      </v-layout>

      <v-flex xs9 class="tableItems mt-5" v-if="selecteds.length">
        <span class="title">Selected Items</span> ( {{ selecteds.length}} )
      </v-flex>
      <v-flex xs9 class="tableItems mt-4 mb-4">
        <v-divider light></v-divider>
      </v-flex>
      <v-flex xs12 class="tableItems st mt-4" v-if="selecteds.length">
        <v-data-table
         :headers="headers"
         :items="selecteds"
         hide-actions
         class="elevation-1"
        >
        <template slot="items" slot-scope="props">
          <td>{{ props.item.name }}</td>
          <td class="text-xs-center">{{ props.item.class }}</td>
          <td class="text-xs-center">{{ props.item.price }}</td>
        </template>
        </v-data-table>
        <!-- <v-layout row wrap> -->
          <v-flex xs12 class="total" v-if="selecteds.length">
            <span class="label">Total </span> <span class="amount">N{{total}}</span>
          </v-flex>
        <!-- </v-layout> -->
        <v-divider dark></v-divider>
      </v-flex><br>
        <v-flex xs class="payMe" v-if="selecteds.length">
          <paystack
            class="payMe white--text"
            :amount="total * 100"
            :email="email"
            :paystackkey="paystackkey"
            :reference="reference"
            :callback="callback"
            :close="close"
            :embed="false"
          ></paystack>
        </v-flex>
         <div class="danger-alert mt-0 mb-2" v-text="msg" ></div>
  </panel>
</template>

<script type="text/javascript">
import swal from 'sweetalert'
import VueNotifications from 'vue-notifications'
import paystack from 'vue-paystack';
export default {
  middleware: 'studentAuth',
  components: {
      paystack
  },
  data(){
    return{
      headers: [
         {
           text: 'Items',
           align: 'left',
           sortable: false,
           value: 'name'
         },
         {
           text: 'Class',
           value: '',
           align: 'center',
           sortable: false,
           sortable: false,
         },
         {
           text: 'Price',
           value: '',
           align: 'center',
           sortable: false,
           sortable: false,
         },
       ],
       selectItems: [],
       books: null,
       uniforms: null,
       sports: null,
       book: false,
       Uniform: false,
       sport: false,
      select: '',
      selecteds:[],
      msg: '',
      items: [
        {text: 'School Fees', value: 1},
        {text: 'School Uniinlineform && Sport Wears', value: 2},
        {text: 'Books & Accessories', value: 3}
      ],
      student: this.$store.state.student,

      paystackBtnText: "",
      paystackkey: "pk_test_a81e972522ba87a9e8b92aedf7304f30b6c76d70", //paystack public key
      email: this.$store.state.student.email, // Customer email
      purpose: 'others',
    }
  },

  computed: {
    reference(){
      let text = "";
      let possible = new Date().getTime().toString() + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz012345678"

      for( let i=0; i < 10; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

      return text;
    },

    total() {
      let  total = null
      for (let i = 0; i < this.selecteds.length; i++)
        total += this.selecteds[i].price
        return total
    }
  },

  methods: {
    async callback (response){
      let id = this.student._id
      response.purpose = this.purpose
      let update = await this.$axios.post(`/other-payments`, response)
      this.msg = 'Payment was successful, please do not select the same set of items again'
      swal({
        title: "success!",
        text: this.msg,
        icon: "warning",
        button: "Okay",
      })
    },

    close: function(){
        // console.log("Payment closed")
    },

    async itemsControl() {
      this.select === 1 ? this.$router.push('/student/payments/') : this.select
      this.select === 2 ? this.selectItems = this.uniforms : this.selectItems
      this.select === 3 ? this.selectItems = this.books : this.selectItems
    },

    async resetItems() {
      this.selecteds = []
    },
  },

  async created () {
    // console.log();
    this.books = this.$store.state.schoolItems[0].books
    this.uniforms = this.$store.state.schoolItems[0].uniform

    for (var i = 0; i < this.books.length; i++) {
      this.books[i].text = this.books[i].name + ' ' + this.books[i].class
    }

    for (var i = 0; i < this.uniforms.length; i++) {
      this.uniforms[i].text = this.uniforms[i].name
    }

    for (var i = 0; i < this.selecteds.length; i++) {
      this.selecteds[i].text = this.selecteds[i].name
    }
  },
  async fetch ({ store, app: { $axios } }) {
    let schoolItems = await $axios.get(`/purchase-items/`)
    store.commit('setSchoolItems', schoolItems.data)
  }
}
</script>

<style scoped>
@media  only screen and (min-width:320px) and (max-width:768px) {
  .total .amount{
    margin-top: 9px;
    margin-right: 20px !important;
    font-weight: bold;
    float: right;
  }
}
.total {
  height: 40px;
  /* width: 250px; */
  border: 1px solid grey;
  /* float: right !important; */
}
.resetAll {
  /* float: left !important; */
}
.total .label{
  margin-top: 9px;
  margin-left: 20px;
  margin-right: 20px;
  font-weight: bold;
  float: left;
}
.total .amount{
  margin-top: 9px;
  margin-right: 108px;
  font-weight: bold;
  float: right;
}
.tableItems {
  width: 95%;
  margin: 0 auto;
}
  .payMe {
    background-color: #008b8b;
    margin: 0 auto !important;
    margin-top: 20px;
    width: 100px;
    height: 30px;
    /* border: 1px solid #000; */
  }
  .payMe:hover {
    background-color: red;
    color: #000 !important;
    /* border: 1px solid #000; */
  }
</style>
