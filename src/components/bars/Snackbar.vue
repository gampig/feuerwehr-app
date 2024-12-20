<template>
  <v-snackbar
    :model-value="show"
    :color="color"
    :multi-line="true"
    :timeout="timeout"
    location="right top"
  >
    {{ text }}
    <template v-if="subText">
      <p>{{ subText }}</p>
    </template>
    <template #actions="{ attrs }">
      <v-btn v-bind="attrs" icon @click.native="close">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import { useNotificationsStore } from "@/stores/notifications";
import { mapActions, mapState } from "pinia";
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      timer: null as number | null,
    };
  },

  computed: {
    ...mapState(useNotificationsStore, [
      "id",
      "show",
      "timeout",
      "text",
      "subText",
      "color",
    ]),
  },

  watch: {
    id() {
      if (this.show) {
        this.setTimer();
      }
    },
  },

  methods: {
    ...mapActions(useNotificationsStore, ["setShow"]),

    setTimer() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.setShow(false);
      }, this.timeout);
    },

    close() {
      this.setShow(false);
    },
  },
});
</script>
