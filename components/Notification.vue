<template>
<div>
  <v-list @click="emitClick()">
    <v-list-item-avatar>
      <avatar no-vuetify="true" :size="35" :image="participant.photoUrl"  :name="participant.name" :familly="participant.familly" ></avatar>
    </v-list-item-avatar>

    <v-list-item-content>
      <v-list-item-title v-html="participant.name"></v-list-item-title>
      <v-list-item-subtitle>
        <span>{{message}}</span>: {{date}}
      </v-list-item-subtitle>
    </v-list-item-content>

  </v-list>
  
  <v-divider class="ma-4"></v-divider>
</div>
</template>

<script>
import avatar from './Avatar';
export default {
  name: 'notification',
  props: ['message', 'image', 'date', 'participant', 'author'],
  components: { avatar },
  methods: {
    emitClick() {
      this.$emit('click')
    }
  }
}
</script>

<style scoped>

</style>