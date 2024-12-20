<template>
  <v-list-item lines="two" @click="$emit('click')">
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
      {{ formatDateTimeFromNow(callout.alarmTime) }} ({{
        formatDateTime(callout.alarmTime)
      }})
    </v-list-item-subtitle>
  </v-list-item>
</template>

<script lang="ts">
import { formatDateTime, formatDateTimeFromNow } from "@/utils/dates";
import { defineComponent, PropType } from "vue";
import { Callout } from "../models/Callout";

export default defineComponent({
  props: {
    callout: {
      type: Object as PropType<Callout>,
      default: null,
    },
  },

  methods: {
    formatDateTime: formatDateTime,
    formatDateTimeFromNow: formatDateTimeFromNow,
  },
});
</script>
