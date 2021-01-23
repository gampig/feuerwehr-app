<template>
  <div>
    <template v-for="item in links">
      <v-list-item
        v-if="!item.auth || item.auth()"
        :key="item.title"
        v-on="item.click !== undefined ? { click: item.click } : {}"
        :to="item.to"
        :href="item.href"
      >
        <v-list-item-avatar v-if="item.icon">
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    links: {
      type: Array,
      required: true,
    },
  },
};
</script>
