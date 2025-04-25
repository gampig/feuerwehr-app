<template>
  <Form
    v-model:type="item.type"
    v-model:keyword="item.keyword"
    v-model:catchphrase="item.catchphrase"
    v-model:alarm-time="item.alarmTime"
    v-model:address="item.address"
  ></Form>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from "vue";
import { useCalloutStore } from "../../stores/callout";
import Form from "./Form.vue";
import { Callout } from "../../models/Callout";

const calloutStore = useCalloutStore();
const item = ref<Partial<Callout>>({});

watchEffect(() => {
  if (!calloutStore.loading) {
    if (calloutStore.callout === undefined) {
      item.value = {};
    } else {
      item.value = { ...calloutStore.callout };
    }
  }
});
</script>
