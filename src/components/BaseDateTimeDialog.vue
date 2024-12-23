<template>
  <v-dialog
    :model-value="modelValue"
    persistent
    max-width="600"
    @update:model-value="cancel"
  >
    <v-card>
      <v-tabs v-model="dateTabs" fixed-tabs>
        <v-tab key="time"> Uhrzeit </v-tab>
        <v-tab key="date"> Datum </v-tab>
      </v-tabs>

      <v-tabs-window v-model="dateTabs">
        <v-tabs-window-item key="time">
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
        </v-tabs-window-item>
        <v-tabs-window-item key="date">
          <v-date-picker
            v-model="dateVal"
            :max="maxDate"
            :min="minDate"
            color="primary"
            class="elevation-0"
            style="border-radius: 0"
            full-width
          />
        </v-tabs-window-item>
      </v-tabs-window>

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

const hourRegex = new RegExp("^([01]?\\d|2[0-3])$");
const minuteRegex = new RegExp("^([0-5]?\\d)$");

function pad(n) {
  return n < 10 ? "0" + Number(n) : Number(n);
}

export default {
  props: {
    modelValue: {
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
    modelValue(modelValue) {
      if (modelValue) {
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
      this.$emit("update:model-value", false);
    },

    save() {
      if (!this.$refs.timeForm.validate()) {
        this.dateTabs = "time";
      } else {
        this.dateTabs = null;
        this.$emit("update:model-value", false);

        // Pad: MomentJS expects a leading zero for the hour and minute
        const date = moment(
          `${this.dateVal} ${pad(this.hour)}:${pad(this.minute)}`
        );
        this.$emit("update:date", date.unix());
      }
    },
  },
};
</script>
