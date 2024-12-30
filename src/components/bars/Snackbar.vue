<template>
  <VSnackbarQueue v-model="snackbarQueue" location="right top" closable>
  </VSnackbarQueue>
</template>

<script lang="ts">
import { useNotificationsStore } from "@/stores/notifications";
import { mapActions, mapState } from "pinia";
import { defineComponent } from "vue";
import { VSnackbarQueue } from "vuetify/labs/components";

type Writable<T> = { -readonly [P in keyof T]: T[P] };

export default defineComponent({
  components: {
    VSnackbarQueue,
  },

  data() {
    return {
      snackbarQueue: [] as Writable<
        NonNullable<VSnackbarQueue["$props"]["modelValue"]>
      >,
    };
  },

  computed: {
    ...mapState(useNotificationsStore, ["notificationsQueueLength"]),
  },

  watch: {
    notificationsQueueLength(length) {
      if (length > 0) {
        this.processNotifications();
      }
    },
  },

  methods: {
    ...mapActions(useNotificationsStore, ["popNotification"]),

    processNotifications() {
      while (this.notificationsQueueLength > 0) {
        const notification = this.popNotification();
        if (notification) {
          const snackbar = {
            text: notification.text,
            timeout: notification.timeout,
            color: notification.color,
          };
          this.snackbarQueue.push(snackbar);
        }
      }
    },
  },
});
</script>
