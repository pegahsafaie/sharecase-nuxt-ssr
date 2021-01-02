import getUser from '../apollo/queries/getUser.gql';
import insertAddress from '../apollo/queries/insertAddress.gql';
import updateUser from '../apollo/queries/updateUser.gql';
import cloudinaryService from '../mixins/cloudinaryService';

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
      /* It is exactly what this.$cokiz do
      if(process.client) {
        document.cookie = `token=${token}`
      } else {
        res.setHeader('Set-Cookie', [`token=${token}`]);
      } */
      this.$cookiz.set('token', token);
      context.commit('setAuthentication', { token });
      if(!user) {
        const client = this.app.apolloProvider.defaultClient;
        const {data, loading} = await client.query({
          query: getUser, 
          variables: { user_id }
        });
        this.$cookiz.set('user', data.Users[0]);
        context.commit('setUser', { user: data.Users[0] });
      } else {
        this.$cookiz.set('user', user);
        context.commit('setUser', { user });
      }

      // context.dispatch('conversations/Initialize', { user }, {root:true});
    },
    logout(context) {
      this.$auth0Lock.logout();
      this.$cookiz.remove('user');
      this.$cookiz.remove('token');
      context.commit('setUser', {user: null});
      context.commit('setAuthentication', { token: null });
    },
    async updateProfile(context, { profile, blobPhoto, address, successfulCallback, errorCallback }) {
      try {
        const client = this.app.apolloProvider.defaultClient;
        if(blobPhoto) {
          const response = await cloudinaryService.uploadFileToCloudinary(blobPhoto);
          profile.photoUrl = response.url;
        }
        if(address) {
          const { data } = await client.mutate({
            mutation: insertAddress, 
            variables: {
              country:address.country, 
              place: address.place, 
              poi: address.poi, 
              locality: address.locality, 
              postcode: address.postcode
            }
          });
          profile.address = data.insert_Address.returning[0].uid;
        }
        const { data } = await client.mutate({
          mutation: updateUser, 
          variables: {
            ...profile
          }
        });
        const user = data.update_Users.returning[0];
        this.$cookiz.set('user', user);
        context.commit('setUser', { user });
        if(successfulCallback) successfulCallback(user);
      } catch (exception) {
        if(errorCallback) errorCallback(exception);        
      }
    }
  }
}