
<template>
<div>
  <section>
      <div class="header-gallery"></div>
      <div class="container text-center">
        <h2>{{$t('gallery_title')}}</h2>
        <p class="lead mb-2">{{$t('gallery_description')}}</p>
      </div>
  </section>
  <div class="col-md-10 col-lg-8 col-xl-7 mx-auto">
    <div class="form-row justify-center shadow pa-2 ma-4">
      <div class="col-12 col-md-9 my-auto">
        <address-input :auto-focus="true" @change="changeAddress" v-model="selectedAddress" />
      </div>
      <div class="col-12 col-md-3 my-auto">
        <v-btn @click="search()" class="btn btn-block btn-lg btn-primary" >{{$t('start')}}</v-btn>
      </div>
    </div>
  </div>
  <div class="gallery ml-auto mr-auto">
    <div class="item" v-on:click="add()">
      <div class="visible">
          <button v-if="!user" class="absolute-top btn btn-primary" @click.prevent="login">{{$t('share.add_login_required')}}</button>
          <div class="middle">
            <span 
              :title="getTitleForAddButton" 
              class="icon-links-big" 
              :class = "{'cursor-point': isUserProfileCompleted}">
              <fa icon="plus"/>
              </span>
          </div>
      </div>
    </div>
    <div v-for="invite in invites" :key="invite.key" >
      <gallery-item v-on:join-chat="joinChat" 
                    @on-delete="deleteItem"
                    @click="open"
                    class="item" 
                    :user= "invite.User" 
                    :item="invite"
                    :is-user-profile-completed="isUserProfileCompleted">
      </gallery-item>
    </div>
  </div>
  <v-dialog v-if="isUserProfileCompleted" v-model="dialog" max-width="500">
    <gallery-new-item v-if="dialog" :user="user" v-on:close-dialog="close"></gallery-new-item>
  </v-dialog>
  <v-dialog v-model="openDialog" max-width="374">
    <gallery-item-detail v-if="openDialog" :invite="selectedItem" v-on:close-dialog="close"/>
  </v-dialog>
  <recent-chats style="position:fixed; bottom:25px; right:25px" :openChat="openChat" />
  <chat
    v-if="activeChat"
    :participants="activeChat.participants"
    :onMessageWasSent = "onMessageWasSent"
    :userId = "user.user_uid"
    isChatOpen
    />
  </div>
</template>

<script>
import recentChats from '../components/RecentChats'
import chat from '../components/Chat'
import galleryItemDetail from '../components/GalleryItemDetail'
import galleryNewItem from '../components/GalleryAddWrapper'
import galleryItem from '../components/GalleryItem'

import addressInput from '../components/AddressInput'
import getInvites from '../apollo/queries/getInvites.gql'
import getNewInvites from '../apollo/queries/getNewInvites.gql'
import deleteInvite from '../apollo/queries/deleteInvite.gql'
import getUser from '../apollo/queries/getUser.gql'

const getInviteVariables = (user, selectedAddress) => {
  const variables = {}
  if(user) {
    variables['user_id'] = user.user_id
  }
  if(selectedAddress) {
    ['country', 'locality', 'place', 'poi', 'postcode'].forEach(addressProp => {
      if(selectedAddress[addressProp]) {
        variables[addressProp] = selectedAddress[addressProp]
      }
    })
  }          
  return variables
}
export default ({
  data() {
    return {
      items: [],
      invites: [],
      dialog: false,
      openDialog: false,
      selectedItem: null,
      selectedAddress: null,
      activeChat: null,
      newInvites: []
    }
  },
  middleware: 'auth',
  asyncData(context) {
    if(context.$cookiz.get('token')) {
      const client = context.app.apolloProvider.defaultClient
      const variables = getInviteVariables(context.$cookiz.get('user'),context.route.query);
      const query = {
        query: getInvites,
        variables,
      }
      return client.query(query).then(({ data }) => {
        return { invites: data.Invites };
      })
    }
  },
  async mounted () {
    this.selectedAddress = this.$route.query;
  },
  apollo: {
    $subscribe: {
      newInvites: {
        query: getNewInvites,
        result ({ data }) {
          data.Invites.forEach(invite => {
            this.invites.unshift(invite);
          })
        },
      },
    },
},
  components: {
    recentChats,
    galleryItem,
    galleryNewItem,
    chat,
    galleryItemDetail,
    addressInput
  },
  methods: {
    openChat: function (activeChat) {
      this.activeChat = activeChat;
    },
    changeAddress: function (address) {
      this.selectedAddress = address
    },
    search: async function () {
      const client = this.$nuxt.context.app.apolloProvider.defaultClient
      const variables = getInviteVariables(this.user,this.selectedAddress)
      const query = {
        query: getInvites,
        variables
      }
      const { data } = await client.query(query)
      this.invites = data.Invites;
    },
    deleteItem: async function(invite) {
      try {
        const client = this.$nuxt.context.app.apolloProvider.defaultClient
        const mutation = {
          mutation: deleteInvite,
          variables: {
            uid: invite.uid
          },
        }
        await client.mutate(mutation);
        this.invites = this.invites.filter(item => item.uid !== invite.uid)
      }
      catch (err) {
        console.log('error in deleteing invitation', err)
      }
    },
    add: function () {
      this.dialog = true
    },
    open: function (item) {
      this.openDialog = true
      this.selectedItem = item
    },
    close: function () {
      this.dialog = false
      this.openDialog = false
    },
    // when user ask tp open a new chat we first check if it is already open or no
    // when no, we create a chat and subscribe it to changes
    joinChat: async function (item) {
      const openChatWithItemSender = this.conversations.find(chat => chat.participants.find(cp => cp.user_id === item.sender_id));
      if (!openChatWithItemSender) {
        const client = this.$nuxt.context.app.apolloProvider.defaultClient
        const query = {
          query: getUser,
          variables: {
            user_id: item.sender_id
          }
        }
        const { data } = await client.query(query)
        const chatParticipant = data.Users[0]
        this.$store.dispatch('conversations/setConversation', { participants: [chatParticipant, this.user] });
        this.activeChat = { participants: [chatParticipant, this.user] };
      } else {
        this.activeChat = openChatWithItemSender;
      }
    },
    onMessageWasSent: function(message, participants) {
      message.author = this.user.user_id;
      message.date = new Date();
      message.seen = false;
      message.receiver = participants.find(participant => participant.user_id !== this.user.user_id).user_id;
      message.data = message.data.text;
      this.$store.dispatch('conversations/addMessage', { message });
    },
    login: function() {
    },
  },  
  computed: {
    user() {
      return this.$store.getters['user/me'];
    },
    conversations() {
      return this.$store.getters['conversations/getRecentConversatnios'];
    },
    chatMessageList: function() {
      if(this.isUserProfileCompleted && this.chatParticipant) {
        return this.messageList.map(message => {
          if(message.author === this.user.user_id) {
            message.author = 'me'
          }
          return message
        })
      } else {
        return []
      }
    },
    isUserProfileCompleted: function () {
      return this.user
    },
    getTitleForAddButton: function () {
      if(this.invites) {
        return this.$t('share.add');
      } else {
        return this.$t('share.add_first_time');
      }
    },
  }
})
</script>

<style scoped>
.header-gallery {
    min-height: 10rem;
    width: 100%;
    height: auto;
    margin-bottom: 2rem;
    background: url('https://res.cloudinary.com/pegah/image/upload/q_auto/v1609413219/bg-mastheahd.jpg');
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
    @media (min-width: 992px) {
      height: 100vh;
      h1 {
        font-size: 5.5rem;
      }
    }
}

h2 {
  font-family: "Mangaba", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-weight: 400;
}

.gallery {
  width: 80%;
  height: 100%;
  display: grid;
  grid-row-gap: 10px;
  grid-column-gap: 10px;
  justify-content: center;
  grid-template-columns: repeat(auto-fill, 350px);
  flex-wrap: wrap;
}

.visible {
  border: 2px dashed #1d809f;
  background-color: #cfd8dc;
  width:100%;
  height: 100%;
  opacity: 1;
}

.middle {
  transition: .9s ease;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  text-align: center;
}

.item:hover .middle {
  opacity: 1;
}

.icon-links-big {
  color: #1d809f;
  font-size: 3em;
}

.item {
  justify-center: strech;
  background-color: black;
  position: relative;
  overflow: hidden;
  height: 350px;
  min-width: 300px;
  flex-grow: 1;
}

.shake-item:hover {
  animation: shake 0.5s;
}

@keyframes shake {
  0% { transform: translate(1px, 1px) rotate(0deg); }
  10% { transform: translate(-1px, -2px) rotate(-1deg); }
  20% { transform: translate(-3px, 0px) rotate(1deg); }
  30% { transform: translate(3px, 2px) rotate(0deg); }
  40% { transform: translate(1px, -1px) rotate(1deg); }
  50% { transform: translate(-1px, 2px) rotate(-1deg); }
  60% { transform: translate(-3px, 1px) rotate(0deg); }
  70% { transform: translate(3px, 1px) rotate(-1deg); }
  80% { transform: translate(-1px, -1px) rotate(1deg); }
  90% { transform: translate(1px, 2px) rotate(0deg); }
  100% { transform: translate(1px, -2px) rotate(-1deg); }
}

.cursor-point {
  cursor: pointer;
}

.absolute-top {
  position: absolute;
  top: 0;
}
</style>
