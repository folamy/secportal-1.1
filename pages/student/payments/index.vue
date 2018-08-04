<template>
  <v-layout row wrap>
    <panel title="Payments > New Student Fees" class="panel">
      <v-flex xs9 class="tableItems mt-2">
        <v-data-table
         :headers="headers"
         :items="schoolItems"
         hide-actions
         class="elevation-1"
        >
        <template slot="items" slot-scope="props">
          <td>{{ props.item.name }}</td>
          <td class="text-xs-center">{{ props.item.status }}</td>
          <td class="text-xs-center">{{ props.item.amount }}</td>
        </template>
        </v-data-table>
        <v-flex class="total">
          <span class="label">Total </span> <span class="amount">N{{totalAmount}}</span>
        </v-flex><br>
        <v-divider></v-divider>
        <div class="">
          <v-flex xs class="payMe" v-if="!student.sch_fees">
            <paystack
              class="payMe white--text"
              :amount="totalAmount * 100"
              :email="email"
              :paystackkey="paystackkey"
              :reference="reference"
              :callback="callback"
              :close="close"
              :embed="false"
              :metadata="metadata"
            ></paystack>
          </v-flex>
          <v-btn v-else class="payMe">Print Receipt</v-btn>
        </div>
      </v-flex>
    </panel>
  </v-layout>

</template>

<script type="text/javascript">
import paystack from 'vue-paystack';
export default {
  middleware: 'studentAuth',
  components: {
      paystack
  },
  data(){
    return{
      purpose: 'newIntake',
      student: this.$store.state.student,
      headers: [
         {
           text: 'Items',
           align: 'left',
           sortable: false,
           value: 'name'
         },
         {
           text: 'Status',
           value: '',
           sortable: false,
           align: 'center',
         },
         {
           text: 'Amount',
           value: '',
           sortable: false,
           align: 'center',
         },
       ],
      schoolItems: [
        {
          name: 'Admission Fee',
          amount: 0,
          status: 'not-paid'
        },
        {
          name: 'Tution Fee/compulsary',
          amount: 38500,
          status: 'not-paid'
        },
        {
          name: 'Registration',
          amount: 5000,
          status: 'not-paid'
        },
        // {
        //   name: 'Adminsion Fee',
        //   amount: 3500,
        //   status: 'not-paid'
        // },
        {
          name: 'Uniforms',
          amount: 5000,
          status: 'not-paid'
        },
        {
          name: 'ICT',
          amount: 10000,
          status: 'not-paid'
        },
        {
          name: 'Medical',
          amount: 2500,
          status: 'not-paid'
        },
        {
          name: 'ID Card',
          amount: 1500,
          status: 'not-paid'
        },
      ],
      paystackBtnText: "",
      paystackkey: "pk_test_a81e972522ba87a9e8b92aedf7304f30b6c76d70", //paystack public key
      email: "folaa@example.com", // Customer email
      // amount: 5000, // in kobo
      plan: 'PLN_80x8o1l947c16iv', // in kobo
      metadata: {custom_fields: [{"display_name":"Cart ID","variable_name":"cart_id","value":"8393"}]}
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
    totalAmount() {
      // return 0
      let  total = null
      for (let i = 0; i < this.schoolItems.length; i++)
        total += this.schoolItems[i].amount
        return total
    },
    // student () {
    //   return this.$store.state.student
    // }
  },
  methods: {
    async callback (response){
      let id = this.student._id
      response.purpose = this.purpose
      console.log(response)
      let update = await this.$axios.post(`/fresh-payment/${id}`, response)
      window.location.reload(true);
    },

    close: function(){
        console.log("Payment closed")
    }

  },

  async created () {
    if (this.student.sch_fees) {
      for (let i = 0; i < this.schoolItems.length; i++)
        this.schoolItems[i].status = 'Paid'
    }
  },

  async fetch ({ store, params, redirect, app: { $axios } }) {
    const student = store.state.student
    const term = store.state.term
    let payments = await $axios.get(`/get-payments/${student.studId}`)
    const pays = payments.data
    console.log(pays);
    for (var i = 0; i < pays.length; i++) {
      if (pays[i].class === student.classLevel && pays[i].term === term && pays[i].purpose === 'returning') {
        console.log(pays[i].class);
        redirect('/student/payments/returning')
      }
    }

    if (!pays.length && !student.newIntake) {
      redirect('/student/payments/returning')
    }
  }
}
</script>

<style scoped>
.total {
  height: 40px;
  width: 250px;
  border: 1px solid grey;
  float: right !important;
}
.total .label{
  margin-top: 9px;
  margin-left: 20px;
  font-weight: bold;
  float: left !important;
}
.total .amount{
  /* width: 250px; */
  /* border: 1px solid #000; */
  margin-top: 9px;
  margin-right: 20px;
  font-weight: bold;
  float: right !important;
}
.tableItems {
  width: 80%;
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
