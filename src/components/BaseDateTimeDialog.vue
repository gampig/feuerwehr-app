<template>
  <v-dialog :value="value" persistent max-width="600" @input="cancel">
    <v-card>
      <v-tabs v-model="dateTabs" fixed-tabs>
        <v-tab key="time"> Uhrzeit </v-tab>
        <v-tab key="date"> Datum </v-tab>
      </v-tabs>

      <v-tabs-items v-model="dateTabs">
        <v-tab-item key="time">
          <v-toolbar color="primary" dark>
            <v-toolbar-title> Zeit einstellen </v-toolbar-title>
          </v-toolbar>

          <v-form ref="timeForm">
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs3>
                  <v-text-field
                    v-model="hour"
                    label="Stunde"
                    type="number"
                    min="0"
                    max="23"
                    :rules="[rules.isHour]"
                  />
                </v-flex>
                <v-flex shrink align-self-center>
                  <p class="mb-0">:</p>
                </v-flex>
                <v-flex xs3>
                  <v-text-field
                    v-model="minute"
                    label="Minute"
                    type="number"
                    min="0"
                    max="59"
                    :rules="[rules.isMinute]"
                  />
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
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

const hourRegex = new RegExp("^([01]?\\d|2[0-3])$");
const minuteRegex = new RegExp("^([0-5]?\\d)$");

export default {
  props: {
    value: {
      type: Boolean,
    },

    date: {
      type: Number,
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
      rules: {
        isHour: (value) => hourRegex.test(value) || "Ungültig",

        isMinute: (value) => minuteRegex.test(value) || "Ungültig",
      },

      dateTabs: null,
      dateVal: null,
      hour: "00",
      minute: "00",
    };
  },

  watch: {
    value(value) {
      if (value) {
        this.reset();
      }
    },
  },

  methods: {
    reset() {
      this.dateTabs = null;

      const currentMoment = this.date ? moment.unix(this.date) : moment();
      this.dateVal = currentMoment.format("YYYY-MM-DD");
      this.hour = currentMoment.format("HH");
      this.minute = currentMoment.format("mm");
    },

    cancel() {
      this.dateTabs = null;
      this.$emit("input", false);
    },

    save() {
      if (!this.$refs.timeForm.validate()) {
        this.dateTabs = "time";
      } else {
        this.dateTabs = null;
        this.$emit("input", false);
        const date = moment(`${this.dateVal} ${this.hour}:${this.minute}`);
        this.$emit("update:date", date.unix());
      }
    },
  },
};
</script>
