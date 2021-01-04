<template>
  <div>
    <beautiful-chat
      :participants="participants"
      :titleImageUrl="titleImageUrl"
      :onMessageWasSent="sendMessage"
      :messageList="messageList"
      :newMessagesCount="newMessagesCount"
      :isOpen="isChatOpen"
      :icons="icons"
      :close="closeChat"
      :open="openChat"
      :showEmoji="true"
      :showFile="true"
      :showTypingIndicator="showTypingIndicator"
      :colors="colors"
      :alwaysScrollToBottom="alwaysScrollToBottom"
      :messageStyling="messageStyling"
      @onType="handleOnType"
      @edit="editMessage" >
      <template v-slot:header> 
        <h4 class="text-center text-light">
          🤔 Good chat between {{participants.map(m=>m.name).join(' & ')}} 
        </h4>
      </template>
      <template v-slot:user-avatar="{ message }">
        <avatar :size="35" :image="getAuthor(message).photoUrl" :name="getAuthor(message).name" :family="getAuthor(message).familly" 
                 class="cursor-pointer greyscale pa-2" style="border-size: 1px; border-color: black" />
      </template>
      </beautiful-chat>
  </div>
</template>

<script>
import avatar from './Avatar';
import CloseIcon from '~/assets/images/close-icon.png'
import OpenIcon from '~/assets/images/open-chat.png'
import FileIcon from '~/assets/images/file.svg'
import CloseIconSvg from '~/assets/images/close.svg'

export default {
  name: 'chat',
  data() {
    return {
      icons:{
        open:{
          img: OpenIcon,
          name: 'default',
        },
        close:{
          img: CloseIcon,
          name: 'default',
        },
        file:{
          img: FileIcon,
          name: 'default',
        },
        closeSvg:{
          img: CloseIconSvg,
          name: 'default',
        },
      },
      titleImageUrl: 'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png',
      newMessagesCount: 0,
      showTypingIndicator: '', // when set to a value matching the participant.id it shows the typing indicator for the specific user
      colors: {
        header: {
          bg: '#4e8cff',
          text: '#ffffff'
        },
        launcher: {
          bg: '#4e8cff'
        },
        messageList: {
          bg: '#ffffff'
        },
        sentMessage: {
          bg: '#4e8cff',
          text: '#ffffff'
        },
        receivedMessage: {
          bg: '#eaeaea',
          text: '#222222'
        },
        userInput: {
          bg: '#f4f7f9',
          text: '#565867'
        }
      }, // specifies the color scheme for the component
      alwaysScrollToBottom: false, // when set to true always scrolls the chat to the bottom when new events are in (new message, user starts typing...)
      messageStyling: true // enables *bold* /emph/ _underline_ and such (more info at github.com/mattezza/msgdown)
    }
  },
  components: {
    avatar
  },
  computed: {
    messageList() {
      this.$store.dispatch('conversations/seenMessages', { participants: this.participants, reader: this.userId });
      return this.$store.getters['conversations/readMessages']({ participants: this.participants });
    },
    participantsWithAvatars() {
      return this.participants.map(participant => { participant.imageUrl = participant.photoUrl; return participant; });
    }
  },
  props: ['participants', 'onMessageWasSent', 'isChatOpen', 'userId'],
  methods: {
    sendMessage (message) {
      this.onMessageWasSent(message, this.participants)
    },
    getAuthor(message) {
      return this.participants.find(participant => participant.user_id ===  message.author)
    },
    openChat () {
      // called when the user clicks on the fab button to open the chat
      this.isChatOpen = true
      this.newMessagesCount = 0
    },
    closeChat () {
      // called when the user clicks on the botton to close the chat
      this.isChatOpen = false
    },
    handleScrollToTop () {
      // called when the user scrolls message list to top
      // leverage pagination for loading another page of messages
  	},
    handleOnType () {
      console.log('Emit typing event')
    },
    editMessage(message){
      const m = this.messageList.find(m=>m.id === message.id)
      m.isEdited = true
      m.data.text = message.data.text
    }
  }
}
</script>