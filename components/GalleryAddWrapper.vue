<template>
  <v-card>
    <v-card-text>

    <div>
      <v-avatar size="50px" class="grey lighten-3 ma-3">
        <fa icon="pen" />
      </v-avatar>
      <span class="address">{{$t('invitation_title')}}</span>
    </div>

      <div class="container">
        <avatar class="overlap-tick-icon" :image="user.photoUrl" :name="user.name" :family="user.familly" :size="50" /> 
      </div>

      <div>
        <v-textarea v-model="invite.description"
            rounded
            solo
            counter="500"
            :label="`${$t('you')} ${user.name}! ${$t('invite_share_your_joy')} ;)`"
          >
        </v-textarea>
        <address-input v-model="address" />
      </div>
    

    
      <v-chip-group multiple column style="display: flex;justify-content: center;">
        <v-chip :class="`icon-links${invite.price ? '-selected' : ''}`" 
        :title="$t('invite_pay')" @click="togglePrice">
          <fa icon="wallet" />
        </v-chip>
        <v-chip :class="`icon-links${invite.takeaway ? '-selected' : ''}`" 
        :title="$t('invite_takeway')" @click="toggleTakeaway">
          <fa icon="shopping-bag" />
        </v-chip>
        <v-chip :class="`icon-links${invite.female ? '-selected' : ''}`" 
        :title="$t('invite_women')" @click="toggleFemale">
          <fa icon="female" />
        </v-chip>
        <v-chip :class="`icon-links${invite.male ? '-selected' : ''}`" 
        :title="$t('invite_men')" @click="toggleMale">
          <fa icon="male" />
        </v-chip>
        <v-chip :class="`icon-links${invite.event ? '-selected' : ''}`" 
        :title="$t('invite_event')" @click="toggleEvent">
          <fa icon="user-friends" />
        </v-chip>
      </v-chip-group>

    <div style="display: flex;justify-content: center;">
      <div class="attach">
        <div class="middle">
          <image-uploader v-model="originPhoto" v-on:file-changed="setOriginPhoto">
              <template #activator v-if="!originPhoto">
                <div>
                  <v-icon large>icon-cloud-upload</v-icon>
                  <p>JPG | PNG | GIF</p>
                </div>
              </template>
              <template #visualizer v-else>
                <div>
                  <vue-cropper
                    ref="cropper"
                    :src="originPhoto.imageURL"
                    alt="Here sit your foods' image"
                    @ready="ready"
                    @crop="crop"
                  >
                  </vue-cropper>
                </div>
              </template>
          </image-uploader>
        </div>
    </div>
    </div>
    </v-card-text>

    <v-card-actions>
    <v-spacer></v-spacer>
      <v-btn class="cancel" text @click="cancel">
        {{$t('cancel')}}
      </v-btn>
      <v-btn color="btn-primary accent-4" text @click="saveItem" :disabled="!isFormValid">
        {{$t('send')}}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import imageUploader from './ImageUploader'
import addressInput from './AddressInput'
import avatar from './Avatar'

import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';

import insertInvite from '../apollo/queries/insertInvite.gql'
import insertAddress from '../apollo/queries/insertAddress.gql'
import cloudinaryService from '../mixins/cloudinaryService'

export default {
  name: 'galleryNewItem',
  data: () => {
    return {
      originPhoto: null,
      modifiedCanvas: null,
      address: null,
      invite: {
        request: false, // if somebody wants to send a request
        price: false,
        male: false,
        female: false,
        takeaway: false,
        event: false,
        blobPhoto: {}
      }
    }
  },
  props: ['user'],
  mounted () {
    this.address = { ...this.user.Address };
  },
  components: {
    imageUploader,
    addressInput,
    avatar,
    VueCropper
  },
  methods: {
    ready: function() {
      if(this.$refs.cropper) {
        this.modifiedCanvas = this.$refs.cropper.getCroppedCanvas();
      }
      // this.modifiedPhoto = canvas.toDataURL("image/png");
    },
    crop: function () {
      if(this.$refs.cropper) {
        this.modifiedCanvas = this.$refs.cropper.getCroppedCanvas();
      }
      // this.modifiedPhoto = canvas.toDataURL("image/png");
    },
    saveItem: function () {
      this.invite.address = { ...this.address }; // the default address comes from the useraddress but use always can change it
      this.invite.sender = this.user.user_id;
      this.modifiedCanvas.toBlob((blob) => {
        this.invite.blobPhoto = blob
        this.addInvite({ ...this.invite }, () => this.$emit('close-dialog'));
      }, "image/jpeg", 0.75)
    },
    async addInvite({description, price, takeaway, address, event, female, male, sender, blobPhoto}, successCallback) {
      const client = this.$nuxt.context.app.apolloProvider.defaultClient;
      let alternativeAddress;
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
        alternativeAddress = data.insert_Address.returning[0].uid;
      }
      const response = await cloudinaryService.uploadFileToCloudinary(blobPhoto);
      const { data: { uid } } = await client.mutate({
        mutation: insertInvite,
        variables: {
          description,
          price, 
          takeaway,
          alternativeAddress,
          date: new Date(),
          event,
          female,
          male,
          sender,
          photoUrl: response.url
        },
      })
      successCallback(uid);
    },
    setOriginPhoto: function (originPhoto) {
      this.originPhoto = originPhoto
    },
    togglePrice: function() {
      this.invite.price = !this.invite.price
    },
    toggleTakeaway: function() {
      this.invite.takeaway = !this.invite.takeaway
    },
    toggleMale: function() {
      this.invite.male = !this.invite.male
    },
    toggleFemale: function() {
      this.invite.female = !this.invite.female
    },
    toggleEvent: function() {
      this.invite.event = !this.invite.event
    },
    cancel: function() {
      this.$emit('close-dialog')
    },
    convertImageUrlToCanvas (imageUrl) {
      var modifiedCanvas = new Image
      modifiedCanvas.src = require(imageUrl)
      return modifiedCanvas
    }
  },
  computed: {
    isFormValid: function() {
      return this.invite.description && this.invite.description.length < 500 && this.originPhoto
    },
  }
}
</script>

<style scoped>
.container {
    display: grid;
    justify-content: center;
    align-content: center;
    justify-items: center;
}
.attach {
  display: flex;
  justify-content: center;
  justify-items: center;
  border: 2px dashed #1d809f;
  background-color: white;
  color: #1d809f;
  height: 300px;
  width: 300px;
}

.icon-links {
  background: grey;
  color: #1d809f;
  font-size: 1.2em;
}

.icon-links:hover {
  background-color: #1d809f;
  color: white;
}

.icon-links-selected {
  background-color: #1d809f;
  color: white;
  cursor:pointer;
}

.middle {
  display:flex;
  justify-content:center;
  align-items: center;
  text-align: center;
}

.image-preview {
  display: block;
  max-height: 229px;
  max-width: 100%;
}

.container {
  position: relative;
}

.overlap-tick-icon {
  position: absolute;
  top: 20px;
  left: 80%;
  z-index: 100;
}

</style>