<template>
  <v-snackbar
    :value="show"
    :color="color"
    :multi-line="true"
    :timeout="timeout"
    right
    top
  >
    {{ text }}
    <template v-if="subText">
      <p>{{ subText }}</p>
    </template>
    <template #action="{ attrs }">
      <v-btn v-bind="attrs" icon @click.native="close">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import { mapMutations, mapState } from "vuex";

export default {
  data() {
    return {
      timer: null,
    };
  },

  computed: {
    ...mapState("notifications", [
      "show",
      "id",
      "queue",
      "color",
      "subText",
      "text",
      "timeout",
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
    ...mapMutations("notifications", ["setShow"]),

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
};
</script>
