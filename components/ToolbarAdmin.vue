<template>
  <div column wrap class="">
    <v-navigation-drawer
      :clipped="clipped"
      v-model="drawer"
      app
      temporary
      hide-overlay
      elevation-2
      class="drawer hidden-md-and-up"
     >
        <v-list class="pa-0">
          <v-list-tile avatar class="listTitle pa-0">
            <v-list-tile-avatar size="55px" class="mt-3">
              <!-- <img src="../assets/logo_white.jpg"> -->
            </v-list-tile-avatar>

            <v-list-tile-content class="pa-1" style="">
              <nuxt-link class="title" to="/">My School Name</nuxt-link>
            </v-list-tile-content>
            <v-btn
              icon
              @click="drawer = !drawer"
            >
              <v-icon>compare_arrows</v-icon>
            </v-btn>
          </v-list-tile>
          <v-list-tile
						nuxt
						exact
						to="/admin"
					>
            <v-list-tile-action>
              <v-icon>home</v-icon>
            </v-list-tile-action>
              <v-list-tile-title>
                Home
              </v-list-tile-title>
          </v-list-tile>

          <v-list-group
            prepend-icon="help_outline"
            :value=false
          >
            <v-list-tile slot="activator">
              <v-list-tile-title>Subjects</v-list-tile-title>
            </v-list-tile>

            <v-list-tile
              v-for="(item, i) in subjects"
              :key="i"
              nuxt
              :to="{
                name: item.route
              }"
            >
              <v-list-tile-title class="subgroup">{{item.title}}</v-list-tile-title>
            </v-list-tile>
            
          </v-list-group> 
          <v-list-group
            prepend-icon="help_outline"
            :value=false
          >
            <v-list-tile slot="activator">
              <v-list-tile-title>Result Upload</v-list-tile-title>
            </v-list-tile>

            <v-list-tile
              v-for="(item, i) in results"
              :key="i"
              nuxt
              :to="{
                name: item.route
              }"
            >
              <v-list-tile-title class="subgroup">{{item.title}}</v-list-tile-title>
            </v-list-tile>
            
          </v-list-group> 
        

        <v-list-tile v-if="isAdminLoggedIn" @click="logout">
          <v-list-tile-action>
            <!-- <v-icon>home</v-icon> -->
          </v-list-tile-action>
            <v-list-tile-title>
              Logout
            </v-list-tile-title>
        </v-list-tile> 
        </v-list>
        
       
    </v-navigation-drawer>
    <!-- <v-navigation-drawer
      :mini-variant="miniVariant"
      :clipped="clipped"
      :right="right"
      v-model="rightDrawer"
      wrap
      height="420"
      app
      floating
      :absolute="$vuetify.breakpoint.mdAndUp"
      hide-overlay
      v-if="isAdminLoggedIn"
     >
         <v-list>
         <v-list-tile @click.native="rightDrawer = !rightDrawer">
           <v-list-tile-action>
             <v-icon light>compare_arrows</v-icon>
           </v-list-tile-action>
           <v-list-tile-title class="title">My Dashboard</v-list-tile-title>
         </v-list-tile>
       </v-list>
       <accordion/>
    </v-navigation-drawer> -->
    
    <v-toolbar scroll-toolbar-off-screen :scroll-threshold="100" app flat elevation-8 :clipped-left="clipped" :clipped-right="clipped" color="transparent" class="toolbars" >
      <v-toolbar-side-icon class="sideIcon hidden-md-and-up" @click="toggleDrawer"> </v-toolbar-side-icon>
      <v-toolbar-title class="white--text" fixed>
        <nuxt-link class="title" to="/">SecPortal</nuxt-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn
          v-if="!isAdminLoggedIn"
          flat
          dark
          nuxt
          exact
          active-class="default-class activelink"
          class="tbLinks"
          to="/admin">
          Home
        </v-btn>
        <v-btn
          v-if="isAdminLoggedIn"
          flat
          dark
          nuxt
          exact
          active-class="default-class activelink"
          class="tbLinks"
          to="/admin/dashboard">
          Dashboard
        </v-btn>

        <v-menu open-on-click open-on-hover bottom offset-y >
          <v-btn
            slot="activator"
            dark
            class="tbLinks"
            active-class="default-class activelink"
            flat
          >
            Subjects
            <v-icon dark class="bt">$vuetify.icons.dropdown</v-icon>
          </v-btn>
          <v-list>
            <v-list-tile 
              nuxt
              class="tbLinks"
              active-class="default-class activelink"
              :to="{
                name: item.route
              }"
              v-for="(item, i) in subjects"
              :key="i"
            >
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
        <v-menu open-on-click open-on-hover bottom offset-y >
          <v-btn
            slot="activator"
            dark
            class="tbLinks"
            active-class="default-class activelink"
            flat
          >
            Result Upload
            <v-icon dark class="bt">$vuetify.icons.dropdown</v-icon>
          </v-btn>
          <v-list>
            <v-list-tile 
              nuxt
              class="tbLinks"
              active-class="default-class activelink"
              :to="{
                name: item.route
              }"
              v-for="(item, i) in results"
              :key="i"
            >
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
        <v-menu open-on-click open-on-hover bottom offset-y >
          <v-btn
            slot="activator"
            dark
            class="tbLinks"
            active-class="default-class activelink"
            flat
          >
            Schedules
            <v-icon dark class="bt">$vuetify.icons.dropdown</v-icon>
          </v-btn>
          <v-list>
            <v-list-tile 
              nuxt
              class="tbLinks"
              active-class="default-class activelink"
              :to="{
                name: item.route
              }"
              v-for="(item, i) in schedule"
              :key="i"
            >
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>

        <v-btn
          v-if="isAdminLoggedIn"
          flat
          class="tbLinks"
          dark
          @click="logout"
          >
          Logout
        </v-btn>
      <!-- <v-avatar
        size="56px"
        class="mt-1 mr-0"
        absolute
        v-if="isAdminLoggedIn"
      >
        <img :src="'/uploads/teachers/finals/'+ Tpassport" alt="alt">
      </v-avatar> -->

      </v-toolbar-items>
      <!-- <v-toolbar-side-icon 
        class="sideIcon rightDrawerSwitch"
        v-if="isAdminLoggedIn"
        @click.native="rightDrawer = !rightDrawer"
      >
      </v-toolbar-side-icon> -->
    </v-toolbar>
  </div>
</template>

<script>
import accordion from "~/components/accordionAdmin";
import { mapState } from "vuex";
export default {
  layout: 'admin',
  components: {
    accordion
  },

  data() {
    return {
      clipped: true,
      // drawer: true,
      // profilePix: '',
      fixed: false,
      miniVariant: false,
      // right: true,
      rightDrawer: this.$vuetify.breakpoint.mdAndUp ? true : true,
      title: "SecPortal",

      right: true,
      drawer: null,
      drawerWasClosed: false,
      subjects: [
        { title: "Add Subject", route: "admin-subject" },
        { title: "View All Subjects", route: "admin-subject-view" }
      ],
      results: [
        { title: "Single Upload", route: "admin-results-single" },
        { title: "Batch Upload", route: "admin-results-batch" }
      ],
      schedule: [
        { title: "Subject Time Table", route: "admin-timetable" },
        { title: "Exams Time Table", route: "admin-etimetable" }
      ]
    };
  },
  watch: {
    drawer(val) {
      if (!val) {
        this.drawerWasClosed = true;
        setTimeout(() => {
          this.drawerWasClosed = false;
        }, 0);
      }
    }
  },
  methods: {
    toggleDrawer() {
      this.drawer = !this.drawerWasClosed;
    },

    async logout() {
      try {
        await this.$store.dispatch("adminLogout");
        this.$router.push("/admin");
      } catch (e) {
        console.log(e);
      }
    }
  },

  computed: {
    ...mapState([
        "isAdminLoggedIn"
      ])
  }
};
</script>
<style scoped>
.title {
  text-decoration: none !important;
}
.title:visited {
  color: White;
}
.activelink {
  background-color: darkseagreen !important;
}
.toolbars {
  width: 100% !important;
  background: linear-gradient(rgba(0, 0, 0, 0.7) rgba(0, 0, 0, 0.7));
}
.drawer {
  overflow: hidden;
  /* background-color: #008b8b !important; */
}

.tbLinks:hover {
  background-color: darkseagreen !important;
}
.tbLinks {
  text-transform: none
}

.rightDrawerSwitch {
  overflow:  hidden !important;
}
.sideIcon {
  color: blanchedalmond
}
.subgroup {
  margin-left: 75px !important;
  /* border: 1px solid red; */
}
</style>
