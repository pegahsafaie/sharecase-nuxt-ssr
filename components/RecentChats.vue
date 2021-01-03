<template>
  <v-card max-width="500" class="mx-auto" :class="{ 'minimized': minimized, 'maximized': !minimized }">
    <v-toolbar color="deep-purple accent-4" dark>
      <v-toolbar-title>Recent Chats</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon @click="toggle()">
        <v-icon v-if="minimized">vertical_align_top</v-icon>
        <v-icon v-else>vertical_align_bottom</v-icon>
      </v-btn>
    </v-toolbar>

    <v-list subheader>
      <v-subheader>Recent chat</v-subheader>

      <v-list-tile
        v-for="conversation in conversations"
        :key="conversation.participants.join('-')"
        @click="openChat(conversation)"
      >

        <v-list-tile-avatar>
          <custom-avatar :image="conversation.participants[1].photoUrl" :name="conversation.participants[1].name" :size="30" />
        </v-list-tile-avatar>

        <v-list-tile-content>
          <v-list-tile-title>{{getLastMessages(conversation).data.text}}</v-list-tile-title>
        </v-list-tile-content>

        <v-list-tile-avatar>
          <v-badge color="green" overlap :value="getUnreadMessagesCount(conversation)">
             <span slot="badge">{{getUnreadMessagesCount(conversation)}}</span>
            <v-icon :color="getLastMessages(conversation).data.seen ? 'deep-purple accent-4' : 'grey'">chat_bubble</v-icon>
          </v-badge>
        </v-list-tile-avatar>
      </v-list-tile>
    </v-list>
  </v-card>
</template>

<script>
import avatar from './Avatar';
  export default {
    name: 'recentChats',
    components: { 'custom-avatar': avatar },
    props: ['openChat'],
    data: () => ({
      minimized: false,
    }),
    computed: {
      conversations() {
        //TODO: you can define a date as properties of this component and just show the message after that date +
        // the ones that are not readen yet
        return this.$store.getters['conversations/getRecentConversatnios']
        .filter(conversation => conversation.messages.length > 0);
      },
    },
    methods: {
      toggle: function () {
        this.minimized = !this.minimized;
      },
      getUnreadMessagesCount: function (chat) {
        // const messages = this.$store.getters['conversations/readMessages']({ participants: chat.participants });
         return chat.messages.filter(m => !m.seen).length;
      },
      getLastMessages: function (conversation) {
        return conversation.messages[conversation.messages.length -1];
      }
    },
  }
</script>

<style scoped>
.minimized {
  transform: translate(0px, 90%);
}
.maximized {
  transform: translate(0px, 0px);
}
</style>