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
          <td class="text-xs-right">{{ props.item.status }}</td>
          <td class="text-xs-right">{{ props.item.amount }}</td>
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
           sortable: false,
         },
         {
           text: 'Amount',
           value: '',
           sortable: false,
           sortable: false,
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
      // console.log(response)
      let update = await this.$axios.post(`/fresh-payment/${id}`, response)
      window.location.reload(true);
    },

    close: function(){
        // console.log("Payment closed")
    }
  },
  async created () {
    console.log($nuxt.$route.path);
    if (this.student.sch_fees) {
      for (let i = 0; i < this.schoolItems.length; i++)
        this.schoolItems[i].status = 'Paid'
    }
  }
}
</script>
<style media="screen">

</style>
