<template>
  <v-app>
    <toolbar/>
    <v-flex class="header pa-0 ma-0">
      
    </v-flex>
    <v-content pt-0 mt-0>
      <v-container pt-0 mt-0>
        <nuxt />
      </v-container>
    </v-content>

     <v-footer height="auto">
      <v-card flat tile class="flex">
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
import accordion from '~/components/accordionTeacher'
import toolbar from '~/components/ToolbarAdmin'
  export default {
    components: {
      toolbar,
    },
    
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
      }
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
  }
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
  background-color: #2e8b57 !important;
}

.header {
  display: block;
  margin: 0 auto !important;
  margin-bottom: 0px !important;
  width: 100% !important;
  height: 253px !important;
  background: linear-gradient(rgba(0, 0, 0, 0.7)),
    url("/images/banner1.jpg");
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

