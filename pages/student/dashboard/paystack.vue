<template>
  <v-layout row wrap>
    <v-flex xs8>
      <panel title="paystack">
        <v-form>
          <v-text-field
            label="studentID"
            v-model="student.studId"
            readonly
            disabled
            id="id"
          ></v-text-field>
          <v-text-field
            label="Card Number:"
            v-model="payment.cardNumber"
            id="id"
          ></v-text-field>
          <v-text-field
            label="CVV:"
            v-model="payment.cvv"
            id="id"
          ></v-text-field>
          <v-btn color="primary">submit</v-btn>
        </v-form>
      </panel>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      payment: {
        cardNumber: '',
        cvv: '',
        expiryMonth: '',
        expiryYear: ''
      }
    }
  },
  computed: mapState({
    student: 'student',
    // studId: 'studId'
  })
}
</script>

<style lang="css">
</style>
