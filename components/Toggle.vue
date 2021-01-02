<template>
<div class="icons cursor-pointer" :title="value" @click="change">
  <germany v-if="value === 'de'" />
  <iran v-if="value === 'ir'"/>
  <english v-if="value === 'en'"/>
</div>
</template>

<script>
import germany from '~/assets/icons/germany.svg'
import iran from '~/assets/icons/iran.svg'
import english from '~/assets/icons/en.svg'
export default {
  name:'Toggle',
  props: ['value'],
  data() {
    return {
      states: ['en','de','ir'],
    }
  },
  components: { germany, iran, english },
  methods :{
    change: function() {
      const index = this.states.indexOf(this.value);
      this.$emit('change', this.states[index+1] || this.states[0]);
    }
  }
}
</script>
<style scoped>
.cursor-pointer {
  cursor: pointer; 
}
</style>