<template>
  <v-navigation-drawer
    persistent
    enable-resize-watcher
    app
  >
    <v-list dense v-for="item of items" :key="item.id">
      <v-list-tile @click="onClickItem" :data-id="item.id">
        <v-list-tile-action :data-id="item.id">
          <v-icon :data-id="item.id">{{item.icon}}</v-icon>
        </v-list-tile-action>
        <v-list-tile-content :data-id="item.id">
          <v-list-tile-title :data-id="item.id">{{item.caption}}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'sidebar',
  props: ['drawer'],
  data: () => ({
    items: [{
      id: 'home',
      caption: 'Home',
      icon: 'home'
    }, {
      id: 'whiteboard',
      caption: 'White Board',
      icon: 'playlist_add_check'
    }]
  }),
  methods: {
    onClickItem: function (e) {
      this.$emit('clicked_item', e.target.dataset.id)
    }
  }
}
</script>
