<template>
<div>
  <v-toolbar fixed height="50px">
      <toggle v-model="language" @change="changeLanguage"/>
      <v-spacer></v-spacer>
      <!--<div class="icons ladybug" v-html="require('~/assets/icons/ladybug.svg')"></div>-->
      <v-toolbar-title @click="goHome()" class="ballet bigger">
        <span style="color:red">S</span><span>HARE </span><span style="color:red">C</span><span>AFE</span>
      </v-toolbar-title>
      
      <v-spacer></v-spacer>
      <div v-if="authenticated">
        <v-menu  :nudge-width="200" offset-y>
          <template v-slot:activator="{ on }">
            <div>
              <div v-if="user" ref="logo" v-on="on">
                <avatar :size="35" :image="avatarImageURL" :name="user.name" :family="user.familly" 
                 class="cursor-pointer greyscale pa-2" style="border-size: 1px; border-color: black" />
              </div>
            </div>
          </template>
          <v-card>
            <v-list class="text-center">
              <v-list-item class="cursor-pointer" @click="openProfile()">
                <v-list-item-content>
                  <v-list-item-title>
                    <fa icon="user"/> {{$t('navigation.user')}}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item class="cursor-pointer" @click="goToNotifications()">
                <v-list-item-content>
                  <v-list-item-title>
                    <fa icon='envelope'/>{{$t('navigation.notifications')}}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item class="cursor-pointer" @click="logout()">
                <v-list-item-content>
                  <v-list-item-title>
                    <fa icon="door-closed"/> {{$t('navigation.signout')}}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
      </div>
      <div v-if="!authenticated">
        <button @click.prevent="login" class="btn btn-primary">{{$t('register.login')}}</button>
      </div>
  </v-toolbar>
</div>
</template>

<script>
import toggle from './Toggle'
import avatar from './Avatar';
export default {
  name: 'Toolbar',
  components: { 
    toggle, avatar 
  },
  methods: {
    //#Event Handlers######################################
    login () {
      this.$auth0Lock.show();
    },
    changeLanguage: function (newSelectedLanguage) {
      this.$i18n.locale = newSelectedLanguage
    },
    goHome: function() {
      this.$router.replace( { path: '/' })
    },
    goToNotifications: function () {
      this.$router.push({path: '/Notifications', params: {uid: this.user.user_id }})
    },
    openProfile: function() {
      this.$router.push( { path: '/Profile', params: {owner: true, uid: this.user.user_id} })
    }, logout: function() {
      return this.$store.dispatch('user/logout');
    },
  },
  computed: {
    user() {
      return this.$store.getters['user/me'];
    },
    language() {
      return this.$i18n.locale
    },
    avatarImageURL() {
      return this.user && this.user.photoUrl ? this.user.photoUrl: null 
    },
    authenticated() {
      return this.$store.getters['user/isAuthenticated'];
    }
  }
}
</script>

<style scoped>
  img {
   cursor: pointer; 
  }

  .cursor-pointer {
    cursor: pointer; 
  }

  .v-toolbar__title {
    cursor: pointer; 
  }

  .icons {
    width: 24px;
  }

  .ladybug {
    offset-path: path('M 10 30 C 40 10, 65 10, 95 30 S 150 10, 180 10');
    animation: motionpathguy 10s ease-in infinite both;
  }

  @keyframes motionpathguy {
    from {
      offset-distance: 0%;
    }
    to {
      offset-distance: 100%;
    }
  }

  @font-face {
    font-family: 'ballet';
    src: url('~assets/fonts/Ballet.ttf');
    font-weight: normal;
    font-style: normal;
    font-display: swap
  }

  .ballet {
    font-family: ballet;
    font-weight: bold;
  }
  .bigger {
    font-size: 150%;
  }
  .greyscale {
  filter: grayscale(100%);
}
</style>