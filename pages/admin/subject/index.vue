<template>
  <v-layout row wrap>
		<panel title="Add New Subject" class="panel">
			<v-flex xs8 md8 xl8 mt-4 class="addform">
				<v-form v-model="valid" @submit.prevent="submit" ref="form" lazy-validation>
					<v-layout row wrap>
						<v-flex xs5>
							<v-text-field
								solo
								label="Subject Name"
								v-model="sub.name"
								:rules="textFieldRule"
								required
								single-line
							>
							</v-text-field>
						</v-flex>
						<v-radio-group v-model="sub.school"
							label="Set subject school"
							row
							class="ml-4"
							:rules="[v => !!v || 'Choose School']"
							required
							>
							<v-radio class="mt-1 ml-4" label="JS School" value="JSS" ></v-radio>
							<v-radio class="mt-1" label="SS School" value="SS"></v-radio>
						</v-radio-group>
						<v-flex xs5 >
							<v-select
							:items="sub.school === 'SS' ? SSGroups : subGroups"
							v-model="sub.groupID"
							label="Select subject group"
							:rules="[v => !!v || 'Select group for this subject']"
							required
							></v-select>
						</v-flex>
						<v-radio-group v-model="sub.status"
							label="Set subject status"
							row
							class="ml-4"
							:rules="[v => !!v || 'Selete Status']"
							required
							>
							<v-radio class="mt-1 ml-4" label="Compulsary" value="C" ></v-radio>
							<v-radio class="mt-1" label="Elective" value="E"></v-radio>
						</v-radio-group>
					</v-layout>
				<div class="danger-alert" v-html="error"></div>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn
						dark
						type="submit"
						>
						Login
					</v-btn>
				</v-card-actions>
			</v-form>
			</v-flex>
		</panel>
	</v-layout>
</template>

<script>
import { mapState } from "vuex"
import swal from 'sweetalert'
export default {
	layout: "admin",
  middleware: "adminAuth",
	data () {
		return {
			subGroups: [
				{text: "General Subject", value: '0'},
				{text: "Language Subject", value: 1},
				{text: "Religion Subject", value: 2},
			],
			SSGroups: [
				{text: "General Subject", value: '0'},
				{text: "Art Subject", value: 3},
				{text: "Commercial Subject", value: 4},
				{text: "Science Subject", value: 5},
				{text: "Language Subject", value: 1},
				{text: "Religion Subject", value: 2},
			],
			error: '',
			valid: true,
      textFieldRule: [v => !!v || 'Field is required'],
			sub: {
				// name: '',
				// school: '',
				// subGroup: '',
				// status: '',
			}
		}
	},
	methods: {
		async submit () {
			try {
				if (this.$refs.form.validate()) {
					let str = this.sub.name.toLowerCase().split(' ')
					let name = ''
					for (let i = 0; i < str.length; i++) {
						str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
						name += str[i] + " "
					}
					this.sub.name = name.trim()
					console.log(this.sub);
					await this.$axios.post('/save-subject', this.sub)
					.then(res => {
						swal(res.data, {
							closeOnClickOutside: false,
							icon: "success",
						});
						console.log(res);
					})
				}
			} catch (error) {
				swal(error.response.data, {
					closeOnClickOutside: false,
					icon: "error",
				});
				console.log(error.response);
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
