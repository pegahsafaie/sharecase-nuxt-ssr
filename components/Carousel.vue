<template>
<div>
  <v-carousel class="w-100" style="height: 100px" v-if="items.length > count">
    <v-carousel-item :key="i" v-for="i in divide(items.length,count)">
      <v-layout row >
        <v-flex class="mr-2" :key="j" v-for="j in count">
          <img style="width: 100px;height:100px" :src="items[((i - 1)*count)+j].src">
        </v-flex>
      </v-layout>
    </v-carousel-item>
  </v-carousel>

  <v-carousel class="w-100" style="height: 100px" v-if="items.length < count">
    <v-carousel-item>
        <v-layout row >
        <div class="mr-2" :key="key" v-for="key in items.length-1">
          <img style="width: 100px;height:100px" :src="items[key].src">
        </div>
      </v-layout>
    </v-carousel-item>
  </v-carousel>
</div>
</template>

<script>
  export default {
    name: 'carousel',
    props: ['items'],
    data() {
      return {
        count: 4,
      }
    },
    methods: {
      divide: function(n1, n2) {
        return Math.floor(n1 / n2)
      }
    }
  }
</script>