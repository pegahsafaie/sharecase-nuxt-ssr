import getConversations from '../apollo/queries/getConversations.gql'
import getNewConversations from '../apollo/queries/getNewConversations.gql'
import insertConversation from '../apollo/queries/insertConversation.gql'
import seenMessages from '../apollo/queries/seenMessage.gql'

export default {
  namespaced: true,
  state: () => {
    // [ {messages: [{type:'', text:'', author:'', data: {}, date: {}, seen: false},{}], partcipants: [{uid, name}}, {uid, name}}]} ]
    // should be plain. if no add Vue.set after adding new chats
    // be sure that you present the correct structure as version. here is the single truth of data and
    // developer should be able to know every thing about the data(containing structure of data) here

    // in the db layer we save notifications, but here we create a wrapper data structure around it named
    // conversation which group by messages by participants. this data structure looks like
    // conversation:  { participant[] participants, message[] messages }

    // TODO: for user, participant, message and conversation we need a type definition!!!
    return { all: [] };
  },
  getters: { // dont forget that getters are properties and not functions. you can return a function if you want!
    getRecentConversatnios(state) {
      return state.all;
    },
    readMessages(state) {
      return function({ participants }) {
        const conversation = state.all.find(c => JSON.stringify(c.participants.map(participant => participant.user_id).sort()) === JSON.stringify(participants.map(participant => participant.user_id).sort()));
        // Null Messages make problem for vue-beatiful-chat component
        return conversation.messages.filter(message => !!message.data && !!message.data.text);
      }
    }
  },
  mutations: { // are triggered from actions. They are used for devTools and logging purposes. They dont contain any asny call and are pretty staright fprward
    getChatsForUser(state) {
      
    },
    SEEN_MESSAGES(state, { participants, reader }) {
      console.log('Mutation SEEN_MESSAGES');
      // just the messages that current use is the reader should be seen and not all!
      const chat = state.all.find(c => JSON.stringify(c.participants.map(participant => participant.user_id).sort()) === JSON.stringify(participants.map(participant => participant.user_id).sort()));
      const messagesToBeSeen = chat.messages.filter(m => m.author !== reader)
      const client = this.app.apolloProvider.defaultClient;
      client.mutate({
        mutation: seenMessages,
        variables: {
          messageIds: messagesToBeSeen.map(message => message.uid)
        }
      })
      // again I guess because of the listener and subscribeToChanges of firebase/hausura, we dont need to manually
      // update state here. but I keep it so in case we have decide to move to an rest api without ws support
      messagesToBeSeen.forEach(m => m.seen = true);
      state.all = [...state.all];
    },
    SET_MESSAGES(state, { participants, messages }) {
      console.log('SET_MESSAGES');
      const existingConversation = state.all.find(c => JSON.stringify(c.participants.map(participant => participant.user_id).sort()) === JSON.stringify(participants.map(participant => participant.user_id).sort()));
      existingConversation.messages = [...existingConversation.messages, ...messages]
      state.all = [...state.all];
    },
    SET_CONVERSATION(state, { conversation }) {
      console.log('Mutation SET_CONVERSATION', conversation);
      state.all = [...state.all, conversation]
    }
  },
  actions: { // Actions are called from Vue components. can contain async actinos. they recieve context as input whcich is more general than state
    async Initialize (context, { user }) {
      console.log('INITIALIZES CONVERSATION STORE');
      const notifToMessage = (notification) => ({id: notification.uid, author: notification.author, data: { text: notification.data, meta: notification.date }, type: notification.type, seen: notification.seen});
      const client = this.app.apolloProvider.defaultClient;
      client.query({
        query: getConversations,
        variables: {
          user_id: user.user_id
        }
      }).then(({ data }) => {  
        console.log('CONVERSATIONS DATA', data);
        data.Notifications.forEach(notification => {
          context.dispatch('setConversation', {
            participants: [notification.UserByAuthor, notification.userByReceiver], 
            message: notifToMessage(notification)
          });
        });
      })

      // the client instance here is apollo-client
      // as you see you have access to the same functions that you have in vue-apollo instance
      const observer = client.subscribe({ 
        query: getNewConversations,
        variables: { user_id: user.user_id },
      });
      observer.subscribe({
        next ({data}) {
          console.log('getnotif', data)
          const notification = data.Notifications[0]
          context.dispatch('setConversation', {
            participants: [notification.UserByAuthor, notification.userByReceiver], 
            message: notifToMessage(notification)
          });
        },
        error (error) {
          
        },
      })
    },
    seenMessages (context, { participants, reader }) {
      context.commit('SEEN_MESSAGES', { participants, reader });
      // TODO: it should also gather a pool which update the information after a while on server
    },
    setConversation(context, { participants, message }) {
      console.log('setConversation');
      const existingConversation = context.state.all.find(c => 
        JSON.stringify(c.participants.map(participant => participant.user_id).sort()) === 
        JSON.stringify(participants.map(participant => participant.user_id).sort())
      );
      if(!existingConversation) {
        context.commit('SET_CONVERSATION', {conversation:  { participants, messages: message ? [message] : [] }});
      } else {
        const existingMessage = existingConversation.messages.find(m => m.id === message.id);
        if(!existingMessage) {
          context.commit('SET_MESSAGES', { participants, messages: message ? [message] : [] });
        }
      }
    },
    addMessage(context, { message }) {
      console.log('INSERT MESSAGE', message)
      // no need to add it to state as we have created the listener in initializer. and it will register that
      // if you remove the listener there, you have to add it here to state
      // and actually i think it is better to do that.
      const client = this.app.apolloProvider.defaultClient;
      return client.mutate({
        mutation: insertConversation,
        variables: {
          author: message.author, 
          receiver: message.receiver, 
          data: message.data, 
          date: message.date, 
          type: message.type
        }
      })
    }
  }
}