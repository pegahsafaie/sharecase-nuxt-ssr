import { getUser } from '../apollo/queries/getUser.gql';
/*
import addressService from '../common/api/addressService';
import cloudinaryService from '../common/api/cloudinaryService';
*/
export default {
  namespaced: true,
  state: () => { 
    return {
      user: {
        user_id: null,
        name: null,
        familly: null,
        phone: null,
        address: null,
        photoUrl: null,
        about: null,
        email: null
      },
      token: null
    } 
  },
  getters: {
    me(state) {
      return state.user;
    },
    isAuthenticated(state) {
      return !!state.token;
    }
  }, 
  mutations: {
    setUser(state, { user }) {
      state.user = user;
    },
    setAuthentication(state, { token }) {
      state.token = token;
    }
  }, 
  actions: {
    async login(context, { token, user_id, user }) {
      console.log(this.app);
      // TODO: replace localstorage with cookie
      localStorage.setItem('token', JSON.stringify(token))
      context.commit('setAuthentication', { token });
      if(!user) {
        const client = this.app.apolloProvider.defaultClient;
        const {data, loading} = await client.query({
          query: getUser, 
          variables: { user_id }
        });
        console.log(data.Users);
        localStorage.setItem('user', JSON.stringify(data.Users[0]));
        context.commit('setUser', { user: data.Users[0] });
      } else {
        localStorage.setItem('user', JSON.stringify(user));
        context.commit('setUser', { user });
      }

      // context.dispatch('conversations/Initialize', { user }, {root:true});
    },
    logout(context) {
      // Dont know why but it makes a loop of refreshing page!
      localStorage.setItem('user', null);
      localStorage.setItem('token', null);
      const auth0 = getInstance();
      if(auth0) {
        auth0.logout();
      }
      
      context.commit('setUser', {user: null});
      context.commit('setAuthentication', { token: null });
    },
    /*async updateProfile(context, { profile, blobPhoto, address, successfulCallback, errorCallback }) {
      try {
        if(blobPhoto) {
          const response = await cloudinaryService.uploadFileToCloudinary(blobPhoto);
          profile.photoUrl = response.url;
        }
        if(address) {
          const response = await addressService.insertAddress(address);
          profile.address = response.uid;
        }
        const user = await userService.updateUser(profile);
        localStorage.setItem('user', JSON.stringify(user));
        context.commit('setUser', { user });
        if(successfulCallback) successfulCallback(user);
      } catch (exception) {
        if(errorCallback) errorCallback(exception);        
      }
    }*/
  }
}