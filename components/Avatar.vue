<template>
  <v-avatar :size="size" class="overlap-tick-icon" color="indigo">
    <img v-if="showImage" :src="image" />
    <span v-if="showAvatarLetters " :class="size" class="white--text headline">{{getAvatarLetters}}</span>
    <img v-if="showFallback" src="~/assets/images/unknown.jpg" :class="size" />
  </v-avatar>
</template>

<script>
export default {
  name: 'avatar',
  data() {
    return {
      fallback: '~/assets/images/unknown.jpg'
    }
  },
  props: ['image', 'name', 'family', 'size'],
  computed: {
    getAvatarLetters: function () {
      return this.name.substring(0,1).toUpperCase()
    },
    showImage: function () {
      return !!this.image;
    },
    showAvatarLetters: function () {
      return !this.image && !!this.name;
    },
    showFallback: function() {
      return !this.image && !this.name
    }
  }
}
</script>

<style scoped>
.small {
  height: 40px;
  width: 40px;
}
</style>