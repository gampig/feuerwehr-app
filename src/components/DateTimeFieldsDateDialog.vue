<template>
  <v-dialog
    :model-value="modelValue"
    persistent
    max-width="600"
    @update:model-value="cancel"
  >
    <v-card>
      <v-date-picker
        v-model="dateVal"
        :max="maxDate"
        :min="minDate"
        color="primary"
        class="elevation-0"
        style="border-radius: 0"
        full-width
      />

      <v-card-actions>
        <v-btn variant="text" @click="cancel"> Abbrechen </v-btn>
        <v-spacer />
        <v-btn color="primary" @click="save"> Speichern </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import moment from "moment";

export default {
  props: {
    modelValue: {
      type: Boolean,
    },

    date: {
      type: String,
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

  emits: ["update:model-value", "update:date"],

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

  created() {
    this.reset();
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
      this.$emit("update:model-value", false);
      this.reset();
    },

    save() {
      this.$emit("update:model-value", false);
      this.$emit("update:date", this.dateVal);
    },
  },
};
</script>
