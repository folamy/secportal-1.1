<template>
	<v-layout row wrap>
		<panel title="Add New Admin User" class="panel">
			<v-flex xs8 md6 xl6 mt-4 class="addform">
				<v-form v-model="valid" @submit.prevent="submit" ref="form" lazy-validation>
				<v-text-field
					solo
					label="Enter User's Surname"
					v-model="user.lastname"
					:rules="textFieldRule"
					required
					single-line
				>
			</v-text-field>
				<v-text-field
					solo
					v-model="user.othername"
					label="Enter User's First Name"
					value=""
					:rules="textFieldRule"
					required
					single-line
				></v-text-field>
				<v-radio-group v-model="user.superUser"
            label="Your gender"
            row
            :rules="[v => !!v || 'Select your gender']"
            required
            >
            <v-radio class="mt-1 ml-4" label="Normal User" value="Normal" ></v-radio>
            <v-radio class="mt-1" label="Super User" value="Super"></v-radio>
          </v-radio-group>

				<div class="danger-alert" v-html="error"></div>

				<v-btn
					dark
					type="submit"
					>
					Login
				</v-btn>
			</v-form>
			</v-flex>
		</panel>
	</v-layout>
</template>

<script>
import swal from 'sweetalert'
export default {
	layout: "admin",
  middleware: "adminAuth",
	data () {
		return {
			error: '',
			valid: true,
      textFieldRule: [v => !!v || 'Name is required'],
			user: {
				lastname: '',
				othername: '',
				aid: '',
				superUser: ''
			}
		}
	},
	methods: {
		submit () {
			 if (this.$refs.form.validate()) {
				  this.user.aid = "ADM" + new Date().getTime().toString().substr(8,5) +
						Math.floor(Math.random()*10)

					this.user.superUser === 'Normal' ? this.user.superUser = false : this.user.superUser = true

					this.$axios.post('/add-admin-user', this.user)
					.then(res => {
						if (res.data.success) {
							swal(res.data.success, {
								closeOnClickOutside: false,
								icon: "success",
							})
							.then(okay => {
								this.$router.push({
									name: 'admin-dashboard'
								})
							})
						}
					})
			}
		}
	}
}
</script>

<style>
.addform{
	margin: auto;
}
</style>
