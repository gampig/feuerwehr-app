<template>
  <v-form ref="form">
    <v-text-field
      label="Einsatzende"
      prepend-icon="mdi-calendar-check-outline"
      :value="endTimeFormatted"
      :rules="[rules.restrictFuture, calloutRules.endAfterAlarm]"
      readonly
      clearable
      @click="showEndTimeDialog = true"
      @click:clear="update('endTime', null)"
    />

    <BaseDateTimeDialog
      v-model="showEndTimeDialog"
      :max-date="tomorrow"
      :min-date="alarmDate"
      :date="endTime"
      @update:date="update('endTime', $event)"
    />
  </v-form>
</template>

<script>
import FormMixin from "@/mixins/FormMixin";
import { formatDateTime } from "@/utils/dates";
import moment from "moment";

export default FormMixin.extend({
  props: {
    alarmTime: {
      type: Date,
      default: null,
    },
    endTime: {
      type: Date,
      default: null,
    },
  },

  data() {
    return {
      calloutRules: {
        endAfterAlarm: (value) =>
          !value ||
          !this.alarmTime ||
          moment(value, "L LT").toDate() >= this.alarmTime ||
          "Ende kann nicht vor Alarm sein",
      },

      showEndTimeDialog: false,
    };
  },

  computed: {
    alarmDate() {
      return moment(this.alarmTime).format("YYYY-MM-DD");
    },

    endTimeFormatted() {
      return this.endTime ? formatDateTime(this.endTime) : "";
    },
  },
});
</script>
