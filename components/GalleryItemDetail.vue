<template>
  <v-card
    :loading="loading"
    class="mx-auto my-12 pa-2"
    max-width="374"
  >
  <v-img height="250" :src="invite.photoUrl"></v-img>

  <v-card-title>
    <avatar v-if="invite.User" @click="goToProfile()" 
      :image="invite.User.photoUrl" 
      :name="invite.User.name" 
      :family="invite.User.familly" 
    class="pointer" />
    <span class="pa-2">{{invite.User.name}} {{$t('says')}}:</span>
  </v-card-title>
  
  <v-card-text>  
    <div class="truncate">{{invite.description}}</div>
  </v-card-text>
      
    <v-divider class="mx-4"></v-divider>

    <v-card-title>{{$t('availability')}}</v-card-title>

    <v-card-text class="icon-links">
        <span class="icon-wallet" :class="{'icon-links-selected': invite.price}"></span>
        <span class="icon-bag" :class="{'icon-links-selected': invite.takeaway}"></span>
        <span class="icon-user-female" :class="{'icon-links-selected': invite.female}"></span>
        <span class="icon-user" :class="{'icon-links-selected': invite.male}"></span>
    </v-card-text>

    <v-card-actions>
      <button class="btn btn-primary" @click="close()">
        {{$t('close')}}
      </button>
    </v-card-actions>
  </v-card>
</template>

<script>
import avatar from './Avatar';
export default {
  name: 'galleryItemDetail',
  props: ['invite'],
  components: { avatar },
  methods: {
    goToProfile: function () {
      this.$router.push({ name: 'Profile', params: {uid: this.invite.User.user_id, owner: false}})
    },
    close: function() {
      this.$emit('close-dialog')
    }
  }
}
</script>

<style scoped>
.icon-links-selected {
  background-color: #1d809f;
  color: white;
  cursor:pointer;
}

.truncate {
  word-wrap: break-word;
  width: 300px;
}

.pointer {
  cursor: pointer;
}

.icon-links {
  color: #1d809f;
  font-size: 1.4em;
}
</style>