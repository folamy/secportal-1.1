<template>
  <v-app>
    <toolbar/>
    <v-flex class="header pt-0 mt-0">
      
    </v-flex>
    <v-content pt-0 mt-0>
      <v-container pt-0 mt-0>
        <nuxt />
      </v-container>
    </v-content>

     <v-footer height="auto">
      <v-card flat tile class="flex">
        <v-flex xs12 class="about white--text pt-5 pb-5" text-xs-center v-if="this.$store.state.aboutHome">
          <h1 class="mb-4"> About SecPortal</h1>
          <v-flex xs10 class="abtText mb-5">
            <span>
              Kings College, Lagos, a boys-only Secondary School was established by an Act of 
              British Parliament on Monday 20th of September 1909, with Mr. Lomax as its first 
              Principal. The College (originally called King's School, Lagos) opened with ten scholars.
              It was established to produce students of profound character and academic distinction – men 
              who would build an independent Nigeria. In the words of the colonialists, the College was 
              established.
            </span>
          </v-flex>
          <v-flex class="">
            <v-btn color="" class="abtBtn white--text" large outline>Read More</v-btn>
            <v-btn color="" class="abtBtn white--text" large outline>SecPortal</v-btn>
          </v-flex>
        </v-flex>
        <v-card-title class="footer white--text">
          <strong class="subheading">Get connected with us on social networks!</strong>
          <v-spacer></v-spacer>
          <v-btn
            v-for="icon in icons"
            :key="icon"
            icon
            dark
            class="mx-3"
          >
            <v-icon size="24px">{{ icon }}</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="grey lighten-3">
          <v-layout>
            <v-flex
              v-for="(col, i) in rows"
              :key="i"
              xs3
            >
              <span class="body-2" v-text="col.title.toUpperCase()"></span>
              <div
                v-for="(child, i) in col.children"
                :key="i"
                v-text="child"
              ></div>
            </v-flex>
            <v-flex xs3 layout column>
              <span class="body-2">CONTACT</span>
              <div>
                <v-icon size="18px" class="mr-3">fa fa-home</v-icon>
                New York, NY 10012, US
              </div>
              <div>
                <v-icon size="18px" class="mr-3">fa fa-envelope</v-icon>
                info@example.com
              </div>
              <div>
                <v-icon size="18px" class="mr-3">fa fa-phone</v-icon>
                + 01 234 567 88
              </div>
              <div>
                <v-icon size="18px" class="mr-3">fa fa-print</v-icon>
                + 01 234 567 89
              </div>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions class="grey lighten-2 justify-center">
          &copy;2018 — <strong>Proudly Powered by FolWeb-IT Solutions</strong>
        </v-card-actions>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>
import accordion from "~/components/accordion";
import toolbar from "~/components/Toolbar";
export default {
  components: {
    toolbar,
    accordion
  },
  middleware: "about",
  data() {
    return {
      icons: [
        "fa fa-facebook",
        "fa fa-twitter",
        "fa fa-google-plus",
        "fa fa-linkedin",
        "fa fa-instagram"
      ],
      rows: [
        {
          title: "Company Name",
          children: [
            "Here you can use rows and columns here to organize your footer content. Lorem ipsum dolor sit amet, consectetur adipisicing elit"
          ]
        },
        {
          title: "Products",
          children: [
            "MDBootstrap",
            "MDWordPress",
            "BrandFlow",
            "Bootstrap Angular"
          ]
        },
        {
          title: "Useful Links",
          children: [
            "Your account",
            "Become an Affiliate",
            "Shipping Rates",
            "Helper"
          ]
        }
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
    }
  }
};
</script>
<style>

.panel {
  margin: 0 auto;
  width: 95%;
}

.footer {
  background-color: seagreen;
}
.danger-alert {
  margin: auto;
  text-align: center;
  font-weight: 500;
  color: red;
}

.toolbar {
  background-color: seagreen !important;
}


.header {
  display: flex;
  /* width: 100% !important; */
  height: 253px;
  align-items: center;
  background: linear-gradient(rgba(0, 0, 0, 0.7) rgba(0, 0, 0, 0.7)), url("/images/banner1.jpg");
    
}
.abtText {
  margin: auto;
  font-size: 20px;
}
.abtBtn {
  background-color: transparent;
}
.about {
  margin: auto;
  background-attachment: fixed;
  background-position: center;
  background: linear-gradient(rgba(0, 0, 0, 0.6) rgba(0, 0, 0, 0.42)),
    url("/images/scrabble.jpg");
  background-color: seagreen;
}
</style>
