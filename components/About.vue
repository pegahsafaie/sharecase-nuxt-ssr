  <template>
  <v-form v-model="isValid">
  <div class="column text-animation pa-4">
    
    <v-snackbar v-model="snackbar" :color="snackbarColor">
      {{ snackbarText }}
      <v-btn dark @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
    <!--<v-btn dark fab small @click="edit()" ><v-icon>edit</v-icon></v-btn>-->
    <div>
      <image-uploader v-on:file-changed="setAvatar" :disabled="!editMode">
        <template #activator>
          <div v-if="!user.photoUrl" class="card-img-responsive pic-animation greyscale">
            <div style="height: 400px; width: 400px; display: flex; flex-direction:column; border: 1px dashed; backgroundColor: grey" class="text-center">
              <v-spacer/>
              <div>
                <v-icon large>icon-camera</v-icon>
                <p class="display-6">{{$t('profile.photo-upload')}}</p>
              </div>
              <v-spacer/>
            </div>
          </div>
          <div v-else>
            <img class="card-img-responsive pic-animation greyscale" :src="user.photoUrl">
            <div class="overlay-edit-icon" v-if="editMode">
              <v-icon large>icon-pencil</v-icon>
            </div>
          </div>
        </template>
      </image-uploader>
    </div>
    
    <div class="ml-4 mt-4">
      <div class="row start ma-1">
          <div>
            <v-text-field v-if="editMode" :label="`${$t('profile.name')}*`" v-model="user.name" :rules="[required]"></v-text-field>
            <div v-if="!editMode">
              <span class="small">{{$t('profile.name')}}</span>
              <p class="lead">{{user.name}}</p>
            </div>
          </div>
      </div>

      <div class="row start ma-1">
        <div>
            <v-text-field v-if="editMode" :label="`${$t('profile.familly')}*`" v-model="user.familly" :rules="[required]"></v-text-field>
            <div v-if="!editMode">
              <span class="small">{{$t('profile.familly')}}</span>
              <p class="lead">{{user.familly}}</p>
            </div>
        </div>
      </div>
      
      <div class="row start ma-1">
        <div>
          <v-text-field v-if="editMode" :label="`${$t('profile.phone')}*`" v-model="user.phone"  :rules="[required]"></v-text-field>
          <div v-if="!editMode">
              <span class="small">{{$t('profile.phone')}}</span>
              <p class="lead">{{user.phone}}</p>
            </div>
        </div>
      </div>
      
      <div class="full-width">
        <div class="row start ma-1">
          <div v-if="editMode">
            <label class="text-secondary text-small">{{$t('profile.address')}}*</label>
            <address-input v-model="user.Address" :autofocus="false" @input="addressChanged" />
          </div>
            <div v-if="!editMode">
              <span class="small">{{$t('profile.address')}}</span>
              <p class="lead">{{serializedAddress}}</p>
            </div>
        </div>


        <div class="row start ma-1 mt-4">
            <v-textarea v-if="editMode" outline :label="`${$t('profile.about')}*`" v-model="user.about"  :rules="[required]" counter="500"></v-textarea>
            <div v-if="!editMode">
              <span class="small">{{$t('profile.about')}}</span>
              <p class="lead truncate">{{user.about}}</p>
            </div>
        </div>

        <div v-if="items && items.length > 0">
          <!--<carousel :items="items" />-->
        </div>
      </div>
    </div>
    <div class="ml-4" v-if="owner">
      <v-btn class="btn btn-primary"  v-if="editMode"  @click="updateUser()" >
        <span>{{$t('save')}}</span>
      </v-btn>
      <v-btn class="btn btn-primary"  v-if="editMode"  @click="goToViewMode()">
        <span>{{$t('cancel')}}</span>
      </v-btn>
      <v-btn class="btn btn-primary"  v-if="!editMode" @click="goToeditMode()" >
        <span>{{$t('Edit')}}</span>
      </v-btn>
    </div>

  </div>
  </v-form>
</template>

<script>
import addressInput from '../components/AddressInput'
import carousel from '../components/Carousel'
import imageUploader from '../components/ImageUploader'
import getUser from '../apollo/queries/getUser.gql';

export default {
  name: 'about',
  data: () => {
    return {
      isValid: true,
      required: value => !!value || 'Required.',
      snackbar: false,
      snackbarColor: null,
      snackbarText: null,
      editMode: false,
      user: {},
      blobPhoto: null,
      address: null,
    }
  },
  computed: {
    isSaveDisabled() {
      return !this.isValid || !this.user.Address || !this.user.photoUrl
    },
    serializedAddress() {
      if(!this.user || !this.user.Address) {
        return null;
      }
      return `${this.user.Address.postcode} ${this.user.Address.country} ${this.user.Address.place} ${this.user.Address.locality}`;    
    },
  },
  components: { carousel, imageUploader, addressInput },
  props: ['owner', 'uid', 'items'],
  async mounted() {
    this.editMode = this.owner ? true: false
  },
  fetch() {
    const client = this.$nuxt.context.app.apolloProvider.defaultClient
    if(this.$cookiz.get('token')) {
      return client.query({
        query: getUser,
        variables: {
          user_id: this.$route.params.uid || this.$nuxt.context.$cookiz.get('user').user_id
        }
      }).then(({ data }) => {
        //  Nuxt.js will automatically merge the returned object with the component data
        this.user = data.Users[0];
      })
    } else {
    }
  },
  /*apollo: {
    Users: {
      query: getUser,
      variables() {
        return { user_id: this.uid }
      }
    }
  },*/
  methods: {
    edit: function () {
      this.$emit('click')
    },
    /**
     * TODO: type definition for address 
     * address looks like {
     *  string country,
        string  locality,
        string place,
        string postcode,
        string region
      }
     */
    addressChanged: function (address) {
      this.address = address;
    },
    setAvatar: function (avatar) {
      this.user.photoUrl = avatar.imageURL;
      this.blobPhoto = avatar.imageFile;
    },
    goToNotification: function() {
      this.$emit('onGoToNotification')
    },
    updateUser: function() {
      this.$store.dispatch('user/updateProfile', {
        profile: {
          user_id: this.user.user_id,
          about: this.user.about,
          email: this.user.email,
          name: this.user.name,
          familly: this.user.familly,
          phone: this.user.phone,
          address: this.user.address_id,
          photoUrl: this.user.photoUrl
        },
        blobPhoto: this.blobPhoto,
        address: this.address,
        successfulCallback:() => 
        { this.$emit('afterSave', this.user); this.goToViewMode(); } ,
        errorCallback:(error)=> {
          console.log(error);
          this.snackbarColor= 'red'
          this.snackbarText= 'Error is occured'
          this.snackbar = true;}
      });
    },
    goToeditMode: function() {
      this.editMode = true
    }, goToViewMode: function() {
      this.user = this.$store.getters['user/me'];
      this.editMode = false
    }
  }
}
</script>
<style scoped lang="scss">
.card-img-responsive {
  width: 100%;
}

.card-text-responsive{
  width: 75%;
}

.overlay-edit-icon {
  position: relative;
  top: 100%;
  left: 100%;
  z-index: 100;
}

@media screen and (min-width:700px) {
  .full-width {
    width: 50%;
  }
  .card-img-responsive {
    width: 50%;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 60%;
    padding: 2.25rem;
  }

  .card-text-responsive {
    width: 50%;
  }

  .card-carousel-overlay {
    position: absolute;
    top: 70%;
    left: 0;
    padding: 2.25rem;
  }

  .pic-animation {
    -webkit-animation-name: scaledown; /* Safari 4.0 - 8.0 */
    -webkit-animation-duration: 4s; /* Safari 4.0 - 8.0 */
    animation-name: scaledown;
    animation-duration: 4s;
  }
  .text-animation {
    animation:  move 3s;
  }
  .button-outside {
    position: absolute;
    top: p;
    right: 0;
    bottom: 0;
    left: 0;
  }
  .button-outside-down {
    position: absolute;
    top: 50px;
    left: -85px;
  }
  @keyframes moveup {
    0% {
      transform: translate(0,50%);
      opacity: 0;
    }
    100% {
      transform: translate(0,0);
      opacity: 1;
    }
  }
  @keyframes move {
    0% {
      transform: translate(50%);
      opacity: 0;
    }
    100% {
      transform: translate(0);
      opacity: 1;
    }
  }
  @keyframes scaledown {
    0% {
      transform: scale(1.2);
      opacity: 0;
    }
    60% {
      transform: scale(1);
      opacity: 1;
    }
    100% {
      transform: scale(1);
    }
  }

}

.greyscale {
  filter: grayscale(100%);
}

.rotate {
  transform: rotate(-90deg);
}

.form-control {
  .v-text-field {
    margin-top: 0px;
    padding-top: 0px;
  }
}
</style>