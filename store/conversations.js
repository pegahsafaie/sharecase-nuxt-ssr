/*import notificationService from '../common/api/notificationService';*/

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
        return conversation.messages;
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
      notificationService.seen(messagesToBeSeen);
      // again I guess because of the listener and subscribeToChanges of firebase/hausura, we dont need to manually
      // update state here. but I keep it so in case we have decide to move to an rest api without ws support
      messagesToBeSeen.forEach(m => m.seen = true);
      state.all = [...state.all];
    },
    SET_MESSAGES(state, { participants, messages }) {
      console.log('Mutation SET_MESSAGES', messages);
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
    /*async Initialize (context, { user }) {
      const notifToMessage = (notification) => ({id: notification.uid, author: notification.author, data: { text: notification.data, meta: notification.date }, type: notification.type, seen: notification.seen});
      const notifications = await notificationService.getNotifications(user.user_id);
      notifications.forEach(notification => {
        context.dispatch('setConversation', {
          participants: [notification.UserByAuthor, notification.userByReceiver], 
          message: notifToMessage(notification)
        });
      });
      console.log('Initialize subscription', user.user_id);
      notificationService.getNewNotifications(user.user_id, notification => {
        console.log('getnotif', notification);
        context.dispatch('setConversation', {
          participants: [notification.UserByAuthor, notification.userByReceiver], 
          message: notifToMessage(notification)
        });
      });
    },
    seenMessages (context, { participants, reader }) {
      context.commit('SEEN_MESSAGES', { participants, reader });
      // TODO: it should also gather a pool which update the information after a while on server
    },
    setConversation(context, { participants, message }) {
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
      // no need to add it to state as we have created the listener in initializer. and it will register that
      // if you remove the listener there, you have to add it here to state
      // and actually i think it is better to do that.
      notificationService.addMessage({...message});
    }*/
  }
}