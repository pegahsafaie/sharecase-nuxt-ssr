<template>
<div class="h-100 blackboard">
  <div class="container h-100">
    <div class="col-sm-10 col-md-5 col-lg-5 h-75 mt-auto mx-auto pa-4 menu h-100">
      <div class="h-50"></div>
      <v-list three-line class="h-50 overflow-auto customscroll" dark style="background-color: transparent">
        <template v-for="conversation in conversations">
          <notification 
          :message="conversation.messages[conversation.messages.length -1].data.text" 
          :participant="conversation.participants[1]"
          :date="conversation.messages[conversation.messages.length-1].data.meta | relative" 
          :key="conversation.participants[1].user_id"
          @click="chat_open(conversation)" />
        </template>
      </v-list>
      
      <chat class="chat" :isChatOpen="!!selectedConversation" v-if="selectedConversation" 
      :participants="selectedConversation.participants" 
      :onMessageWasSent="chat_onMessageWasSent" />
    </div>
  </div>
</div>
</template>

<script>
import chat from '../components/Chat'
import notification from '../components/Notification'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

TimeAgo.addLocale(en)
const timeAgo = new TimeAgo('en-US')

export default {
  name: 'Notifications',
  data () {
    return {
      selectedConversation: null
    }
  },
  components: {
    notification,
    chat
  },
  filters: {
    relative: function (date) {
      if (date && date.seconds) {
        return timeAgo.format(new Date(date.seconds * 1000))
      } else if (date) {
        return timeAgo.format(new Date(date))
      }
      else {
        return ''
      }
    }
  },
  computed: {
    /**
     * get the last updated conversations and messages and sort them based on last first
     */
    conversations() {
        return this.$store.getters['conversations/getRecentConversatnios']
        .filter(conversation => conversation.messages.length > 0);
    },
    user() {
      return this.$store.getters['user/me'];
    }
  },
  methods: {
    chat_open: function (conversation) {
      this.selectedConversation = conversation
    },
    /**
     * add the message to the database using notification service
     */
    chat_onMessageWasSent: function(newMessage) {
      const convertedMessage = {
        author: this.user.user_id,
        receiver: this.selectedConversation.participants.find(participant => participant.user_id !== this.user.user_id).user_id,
        date: new Date(),
        type: newMessage.type,
        data: newMessage.data.text
      };
      this.$store.dispatch('conversations/addMessage', { participants: this.selectedConversation.participants, message: convertedMessage});
    }
  }
}
</script>

<style>
.blackboard {
  background: url('https://res.cloudinary.com/pegah/image/upload/q_auto/v1609876115/sharecafe/blackboard.jpg');
  background-size: 100%;
}

.menu {
  background: url('https://res.cloudinary.com/pegah/image/upload/q_auto/v1609876115/sharecafe/menu.jpg');
  background-size: cover;
}
.shadow {
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
} 
  .customscroll::-webkit-scrollbar {
    width: 20px;
  }

  /* Track */
  .customscroll::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px grey; 
    border-radius: 10px;
  }
  
  /* Handle */
  .customscroll::-webkit-scrollbar-thumb {
    background:white; 
    border-radius: 10px;
  }

  /* Handle on hover */
  .customscroll::-webkit-scrollbar-thumb:hover {
    background: white; 
  }

</style>

