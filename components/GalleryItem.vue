<template>
<div class="item">
    <img :src="item.photoUrl">
    <div class="middle hidden">
    <p>
        <span 
          v-if="!isOwner"
          :class = "{'cursor-point': !!user}"
          @click="joinChat(item)" 
          :title="$t('ask')" 
          class="icon-links-big">
          <fa icon="envelope"/>
          </span>
        <span 
          v-if = "isOwner"
          :class = "{'cursor-point': !!user}"
          @click="removeItem(item)" 
          :title="$t('remove')" 
          class="icon-links-big">
          <fa icon="minus"/>
          </span>
        <span 
          @click="openDetail(item)" 
          :class = "{'cursor-point': !!user}"
          :title="$t('view')" 
          class="icon-links-big">
          <fa icon="expand-alt"/>
          </span>
    </p>
    <h2 style="color: #fff"><span>{{item.User.name}}</span></h2>
    <p class="description truncate">
      {{item.description}}
    </p>
    <p class="icon-links">
        <span :title="$t('invite_pay')" v-if="item.price"><fa icon="wallet"/></span>
        <span :title="$t('invite_women')" v-if="item.female"><fa icon="female"/></span>
        <span :title="$t('invite_men')" v-if="item.male" ><fa icon="male"/></span>
        <span :title="$t('invite_takeway')" v-if="item.takeaway"><fa icon="shopping-bag"/></span>
        <span :title="$t('invite_event')" v-if="item.event"><fa icon="user-friends"/></span>
    </p>
    </div>
</div>
</template>

<script>
export default {
  name: 'galleryItem',
  props: ['item', 'user'],
  data () {
    return {
    }
  },
  methods: {
    openDetail: function() {
      this.$emit('click', this.item)
    },
    joinChat: function(item) {
      if(!this.isOwner) {
        this.$emit('join-chat', item)
      }
    },
    removeItem: function (item) {
      this.$emit('on-delete', item)
    }
  },
  computed: {
    isOwner() {
      return this.user && this.user.user_id === this.item.User.user_id
    }
  }
}
</script>

<style scoped>
.hidden {
  opacity: 0;
}

.middle {
  transition: .9s ease;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  text-align: center;}

.icon-links {
  color: #1d809f;
  font-size: 1.4em;
}

.icon-links-big {
  color: #1d809f;
  font-size: 3em;
}

.cursor-point {
  cursor: pointer;
}

.description {
  color: #fff;
  text-transform: none;
  font-size: 1em;
  transition: opacity 0.35s;
}

.truncate {
  width: 250px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item img {
  width:100%;
  height: 100%;
}

.item:hover .middle {
  opacity: 1;
}

.item:hover img {
  border-color: white;
  border: 1px;
  opacity: 0.3;
  -webkit-transform: scale(1.15);
  -webkit-transition: opacity 0.35s, -webkit-transform 0.8s;
}

.chat {
  position: absolute;
  top: 3em;
  right: 0;
  bottom: 3em;
  left: 0;
}

</style>
