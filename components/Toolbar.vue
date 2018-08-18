<template>
  <div column wrap>
    <v-navigation-drawer
      :clipped="clipped"
      v-model="drawer"
      app
      temporary
      hide-overlay
      elevation-20
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
            to="/"
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
              <v-list-tile-title>Help Desk</v-list-tile-title>
            </v-list-tile>

            <v-list-tile
              v-for="(item, i) in helpDesk"
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
            v-if="!isStudentLoggedIn"
            prepend-icon="fa fa-user-plus"
            :value=false
          >
            <v-list-tile slot="activator">
              <v-list-tile-title>Student Portal</v-list-tile-title>
            </v-list-tile>

            <v-list-tile
              v-for="(item, i) in students"
              :key="i"
              nuxt
              :to="{
                name: item.route
              }"
            >
              <v-list-tile-title  class="subgroup">{{item.title}}</v-list-tile-title>
            </v-list-tile>
            
            
        </v-list-group> 

          <v-list-group
            v-if="!isStudentLoggedIn"
            prepend-icon="fa fa-sign-in"
            :value=false
          >
            <v-list-tile slot="activator">
              <v-list-tile-title>Teacher</v-list-tile-title>
            </v-list-tile>

            <v-list-tile
              v-for="(item, i) in teachers"
              :key="i"
              nuxt
              :to="{
                name: item.route
              }"
            >
              <v-list-tile-title class="subgroup">{{item.title}}</v-list-tile-title>
            </v-list-tile>
        </v-list-group>
        <v-list-tile
          nuxt
          exact
          to="/"
        >
          <v-list-tile-action>
            <v-icon>insert_photo</v-icon>
          </v-list-tile-action>
            <v-list-tile-title>
              Gallary
            </v-list-tile-title>
        </v-list-tile>
        <v-list-tile
          nuxt
          exact
          to="/"
        >
          <v-list-tile-action>
            <v-icon>fa fa-info-circle</v-icon>
          </v-list-tile-action>
            <v-list-tile-title>
              About
            </v-list-tile-title>
        </v-list-tile>
        <v-list-tile v-if="isStudentLoggedIn" @click="logout">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
            <v-list-tile-title>
              Logout
            </v-list-tile-title>
        </v-list-tile> 
        </v-list>
        
       
    </v-navigation-drawer>
    <v-navigation-drawer
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
      v-if="isStudentLoggedIn"
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
    </v-navigation-drawer>
    
    <v-toolbar scroll-toolbar-off-screen :scroll-threshold="100" app flat elevation-8 :clipped-left="clipped" :clipped-right="clipped" color="transparent" class="toolbars" >
      <v-toolbar-side-icon class="sideIcon hidden-md-and-up" @click="toggleDrawer"> </v-toolbar-side-icon>
      <v-toolbar-title class="white--text" fixed>
        <nuxt-link class="title" to="/">SecPortal</nuxt-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn
        flat
        dark
        nuxt
        active-class="default-class activelink"
        class="tbLinks"
        to="/">
        HOME
      </v-btn>
      <v-menu open-on-click open-on-hover bottom offset-y >
        <v-btn
          slot="activator"
          dark
          class="tbLinks"
          active-class="default-class activelink"
          flat
        >
          Help Desk
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
            v-for="(item, i) in helpDesk"
            :key="i"
          >
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>

      <v-menu v-if="!isStudentLoggedIn" open-on-click open-on-hover bottom offset-y >
        <v-btn
          slot="activator"
          flat
          class="tbLinks"
          dark
        >
          Student Portal
          <v-icon dark class="bt">$vuetify.icons.dropdown</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile 
            v-for="(item, i) in students"
            :key="i"
            nuxt
            class="tbLinks"
            exact-active-class="default-class activelink"
            :to="{
              name: item.route
            }"
          >
            <v-list-tile-title >{{ item.title }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
      <v-menu  v-if="!isStudentLoggedIn" open-on-click open-on-hover bottom offset-y >
        <v-btn
          slot="activator"
          flat
          class="tbLinks"
          dark
        >
          Teacher
          <v-icon dark class="bt">$vuetify.icons.dropdown</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile 
            v-for="(item, i) in teachers"
            :key="i"
            class="tbLinks"
            nuxt
            active-class="default-class activelink"
            :to="{
              name: item.route
            }"
          >
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
      <v-menu  v-if="!isStudentLoggedIn" open-on-click open-on-hover bottom offset-y >
        <v-btn
          slot="activator"
          flat
          class="tbLinks"
          dark
        >
          Gallary
        </v-btn>
      </v-menu>
      <v-menu  v-if="!isStudentLoggedIn" open-on-click open-on-hover bottom offset-y >
        <v-btn
          slot="activator"
          flat
          class="tbLinks"
          dark
        >
          About
        </v-btn>
      </v-menu>
      <v-btn
        v-if="isStudentLoggedIn"
        flat
        active-class="default-class activelink"
        class="tbLinks"
        dark
        @click="logout"
        >
        LogOut
      </v-btn>
      <v-avatar
        size="56px"
        class="mt-1 mr-0"
        absolute
        v-if="isStudentLoggedIn"
      >
        <img :src="'/uploads/students/finals/'+ Spassport" alt="alt">
      </v-avatar>

      </v-toolbar-items>
      <v-toolbar-side-icon 
        class="sideIcon rightDrawerSwitch"
        v-if="isStudentLoggedIn"
        @click.native="rightDrawer = !rightDrawer"
      >
      </v-toolbar-side-icon>
    </v-toolbar>
  </div>
</template>

<script>
import accordion from "~/components/accordion";
import { mapState } from "vuex";
export default {
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
      helpDesk: [
        { title: "Contact Admin", route: "admin-help" },
        { title: "Portal Help", route: "admin-help" }
      ],
      teachers: [
        { title: "Registration", route: "teacher-registration" },
        { title: "login", route: "teacher" }
      ],
      students: [
        { title: "Registration", route: "student-registration" },
        { title: "Login", route: "student" }
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
        this.$router.push("/student");
        await this.$store.dispatch("studentLogout");
      } catch (e) {
        console.log(e);
      }
    }
  },

  computed: {
    ...mapState(["Spassport", "isStudentLoggedIn"])
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
  background: linear-gradient(rgba(0, 0, 0, 0.7) rgba(0, 0, 0, 0.7));
}
.drawer {
  overflow: hidden;
  /* background-color: #008b8b !important; */
}

.tbLinks{
  text-decoration: none !important;
  /* text-transform:  */
}

.tbLinks:hover{
  background-color: darkseagreen !important;
}
.rightDrawerSwitch {
  min-width: auto !important;
  min-height: auto !important;
  float: right !important;
  margin-left: 10px;
}
.sideIcon {
  color: blanchedalmond
}
.subgroup {
  margin-left: 75px !important;
  /* border: 1px solid red; */
}
</style>
