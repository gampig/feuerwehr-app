<template>
  <v-dialog :value="value" persistent max-width="600" @input="cancel">
    <v-card>
      <v-tabs v-model="dateTabs" fixed-tabs>
        <v-tab key="time"> Uhrzeit </v-tab>
        <v-tab key="date"> Datum </v-tab>
      </v-tabs>

      <v-tabs-items v-model="dateTabs">
        <v-tab-item key="time">
          <v-time-picker
            v-model="timeVal"
            color="primary"
            format="24hr"
            class="elevation-0"
            style="border-radius: 0"
            full-width
          />
        </v-tab-item>
        <v-tab-item key="date">
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
        </v-tab-item>
      </v-tabs-items>

      <v-card-actions>
        <v-btn text @click="cancel"> Abbrechen </v-btn>
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
      dateTabs: null,
      dateVal: null,
      timeVal: null,
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
      this.dateTabs = null;
      if (this.date) {
        this.dateVal = moment.unix(this.date).format("YYYY-MM-DD");
        this.timeVal = moment.unix(this.date).format("HH:mm");
      } else {
        this.dateVal = moment().format("YYYY-MM-DD");
        this.timeVal = moment().format("HH:mm");
      }
    },
    cancel() {
      this.$emit("input", false);
      this.reset();
    },
    save() {
      this.$emit("input", false);
      const date = moment(this.dateVal + " " + this.timeVal);
      this.$emit("update:date", date.unix());
    },
  },
};
</script>
