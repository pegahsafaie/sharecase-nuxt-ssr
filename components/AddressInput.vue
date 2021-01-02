<template>
  <div>
    <v-autocomplete v-if="isMapbox"
        ref="address"
        v-model="select"
        :loading="loading"
        :items="items"
        :search-input.sync="search"
        cache-items
        flat
        hide-no-data
        hide-details
        :label="$t('address_search')"
        solo
        clearable
        return-object
        @input="getAddressData"
        prepend-inner-icon="mdi-city"
        @click:prepend-inner="setCurrentLocation"
      ></v-autocomplete>
  </div>
</template>

<script>

import locationService from '../mixins/locationService'
import { debounce } from 'lodash';
export default {
  name:'AddressInput',
  props: {
    isGoogle: {
      type: Boolean, default: false,
    },
    isMapbox: {
      type: Boolean, default: true
    },
    value: { type: Object },
    autofocus: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      items: [],
      select: null,
      search: null
    }
  },
  watch: {
    search: debounce(function(val) {
      val && val !== this.select && this.querySelections(val)
    }, 2000),
    // to support v-model this custom component. it created a text out of value
    value: function(val) {
      if(!this.items.includes(val)) {
        this.items.push({ text: Object.values(val).join(', '), value: val});
      }
      this.select = {...val}; 
    },
  },
  mounted() {
    if(this.autofocus) {
      this.$refs.address.focus();
    }
  },
  methods: {
    querySelections (v) {
      this.loading = true
      
      locationService.search('mapbox', v, true, (items) => {
        this.items = [...items];
        this.loading = false;
      });
    },
    // value contains different address contexts like locality, postcode, place, region and country
    getAddressData: function (data) {
      // to support @input for this custom component
      this.$emit('input', data ? data.value : {})
    },
    setCurrentLocation() {  
      if(navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          locationService.getReverseedGeoCode(position.coords.longitude, position.coords.latitude, (val) => {
            if(!this.items.includes(val)) {
              this.items.push({ text: Object.values(val).join(', '), value: val});
            }
            this.select = {...val}; 
          });
        })
      }
    }
  }
}
</script>
<style scoped>

</style>