<template>
  <div class="container row justify-content-center">
    <about class="col-sm-10 col-md-10 col-lg-10 h-100 left-nav"
          v-if="uid"
          :uid="uid"
          :items="Invites" 
          :owner="ownerMode"/>
  </div>
</template>

<script>
import about from '../components/About'
import getInvites from '../apollo/queries/getInvites';

export default {
  name: 'profile',
  middleware: 'auth',
  data: function () {
    return {
      uid: null,
      ownerMode: false,
      Invites: []
    }
  },
  computed: {
    user() {
      return this.$store.getters['user/me'];
    }
  },
  components: { about },
  async mounted() {
    this.uid = this.$route.params.uid || this.user.user_id;
    this.ownerMode = this.uid === this.user.user_id
    this.Invites = this.Invites.map(invite => {src: invite.imageUrl});
  },
  asyncData (context) {    
    const client = context.app.apolloProvider.defaultClient
    const query =  {
        query: getInvites,
        variables: { 
      }
    };
    if(context.$cookiz.get('token')) {
      console.log('invites: ssr rendering + token available');
      return client.query(query)
        .then(({ data }) => {
        //  Nuxt.js will automatically merge the returned object with the component data
        return { Invites: data.Invites };
      })
    } else {
      console.log('invites: static rendering || ssr rendering and token not available');
    }
  },
  /*apollo: {
    Invites: {
      query: getInvites,
      variables: {
        
      }
    }
  },*/
}
</script>
<style scoped lang="scss">
.shadow {
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
} 
.left-nav {
  @extend .shadow;
  border-radius: 10px;
}
.container {
  height:100%;
  align-items: center;
} 

.button-group {
  position: absolute;
  top: 10%;
  left: 10%;
}


</style>