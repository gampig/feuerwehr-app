<template>
  <v-list-item two-line @click="$emit('click')">
    <v-list-item-content>
      <v-list-item-title>
        {{ callout.keyword }}
      </v-list-item-title>
      <v-list-item-subtitle>
        {{ callout.catchphrase }}
      </v-list-item-subtitle>
      <v-list-item-subtitle v-if="callout.address">
        {{ callout.address }}
      </v-list-item-subtitle>
      <v-list-item-subtitle>
        {{ callout.alarmTime | formatDateTimeFromNow }} ({{
          callout.alarmTime | formatDateTime
        }})
      </v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script lang="ts">
/* eslint-disable no-unused-vars */
import Vue, { PropType } from "vue";
import { Callout } from "../models/Callout";
/* eslint-enable */

export default Vue.extend({
  props: {
    callout: {
      type: Object as PropType<Callout>,
      default: null,
    },
  },
});
</script>
