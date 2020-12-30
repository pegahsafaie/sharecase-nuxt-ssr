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
      if(process.client) {
        console.log('vuex login try by client:');
        document.cookie = `token=${token}`
      } else {
        console.log('vuex login try by sever:');
        res.setHeader('Set-Cookie', [`token=${token}`]);
      } 
      // this.$cookiz.set('token', token);
      context.commit('setAuthentication', { token });
      if(!user) {
        const client = this.app.apolloProvider.defaultClient;
        const {data, loading} = await client.query({
          query: getUser, 
          variables: { user_id }
        });
        if(process.client) {
          localStorage.setItem('user', JSON.stringify(data.Users[0]));
        }
        context.commit('setUser', { user: data.Users[0] });
      } else {
        if(process.client) {
          localStorage.setItem('user', JSON.stringify(user));
        }
        context.commit('setUser', { user });
      }

      // context.dispatch('conversations/Initialize', { user }, {root:true});
    },
    logout(context) {
      if(process.client) {
        localStorage.setItem('user', null);
        this.$auth0Lock.logout();
      }
      this.$cookiz.remove('token');
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