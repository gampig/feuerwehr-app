<template>
  <v-dialog :value="value" @input="cancel" persistent max-width="600">
    <v-card>
      <v-date-picker
        v-model="dateVal"
        :max="maxDate"
        :min="minDate"
        first-day-of-week="1"
        color="primary"
        class="elevation-0"
        style="border-radius: 0"
        full-width
      />

      <v-card-actions>
        <v-btn @click="cancel" text> Abbrechen </v-btn>
        <v-spacer />
        <v-btn @click="save" color="primary"> Speichern </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import moment from "moment";

export default {
  props: {
    value: {
      type: Boolean,
    },
    date: {
      default: null,
    },
    maxDate: {
      type: String,
      default: undefined,
    },
    minDate: {
      type: String,
      default: undefined,
    },
  },

  data() {
    return {
      dateVal: null,
    };
  },

  watch: {
    date() {
      this.reset();
    },
  },

  methods: {
    reset() {
      if (this.date) {
        this.dateVal = this.date;
      } else {
        this.dateVal = moment().format("YYYY-MM-DD");
      }
    },
    cancel() {
      this.$emit("input", false);
      this.reset();
    },
    save() {
      this.$emit("input", false);
      this.$emit("update:date", this.dateVal);
    },
  },

  created() {
    this.reset();
  },
};
</script>
