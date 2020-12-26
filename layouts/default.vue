<template>
<div style="with:100%;">
<v-app>
  <!-- Navigation -->
  <toolbar></toolbar>
  <div style="margin-top:30px; height: 100%">
    <Nuxt />
   </div>
</v-app>
</div>
</template>

<script>
import toolbar from '~/components/Toolbar';
export default {
  components: {
    toolbar
  }
}
</script>
