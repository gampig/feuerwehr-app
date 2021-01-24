<template>
  <v-form ref="form">
    <BaseDateTimeFields
      label="Ende"
      prepend-icon="mdi-calendar-check-outline"
      :value="endTime"
      :min-date="alarmDate"
      :max-date="tomorrow"
      :rules-date="[rules.restrictFuture, calloutRules.endAfterAlarm]"
      clearable
      @input="update('endTime', $event)"
    />
  </v-form>
</template>

<script>
import FormMixin from "@/mixins/FormMixin";
import moment from "moment";

export default FormMixin.extend({
  props: {
    alarmTime: null,
    endTime: null,
  },

  data() {
    return {
      calloutRules: {
        endAfterAlarm: (value) =>
          !value ||
          !this.alarmTime ||
          moment(value).add(1, "day").unix() >= this.alarmTime ||
          "Ende kann nicht vor Alarm sein",
      },
    };
  },

  computed: {
    alarmDate() {
      return moment.unix(this.alarmTime).format("YYYY-MM-DD");
    },
  },
});
</script>
