<template>
  <v-row>
    <v-col sm="6" cols="12">
      <v-text-field
        :label="'Datum ' + label"
        type="date"
        :prepend-icon="prependIcon"
        :value="date"
        :rules="rulesDate"
        :clearable="clearable"
        readonly
        @click="editDate = true"
        @click:clear="updateDate(null)"
      />
    </v-col>
    <v-col sm="6" cols="12">
      <v-text-field
        :label="'Uhrzeit ' + label"
        type="time"
        :prepend-icon="prependIcon"
        :value="time"
        :rules="rulesTime"
        :clearable="clearable"
        @input="updateTime"
      />
    </v-col>

    <DateTimeFieldsDateDialog
      v-model="editDate"
      :max-date="maxDate"
      :min-date="minDate"
      :date="date"
      @update:date="updateDate"
    />
  </v-row>
</template>

<script>
import moment from "moment";
import DateTimeFieldsDateDialog from "./DateTimeFieldsDateDialog";

export default {
  components: { DateTimeFieldsDateDialog },

  props: {
    label: {
      type: String,
      default: null,
    },
    prependIcon: {
      type: String,
      default: null,
    },
    maxDate: {
      type: String,
      default: null,
    },
    minDate: {
      type: String,
      default: null,
    },
    rulesDate: {
      type: Array,
      default: null,
    },
    rulesTime: {
      type: Array,
      default: null,
    },
    clearable: {
      type: Boolean,
      default: false,
    },

    value: {
      type: Number,
      default: null,
    },
  },

  data() {
    return {
      editDate: false,
      date: null,
      time: null,
    };
  },

  watch: {
    value(value) {
      if (value) {
        const dateObj = moment.unix(value);
        this.date = dateObj.format("YYYY-MM-DD");
        this.time = dateObj.format("HH:mm");
      } else {
        this.date = null;
        this.time = null;
      }
    },
  },

  methods: {
    updateDate(date) {
      this.date = date;
      this.emit();
    },
    updateTime(time) {
      this.time = time;
      this.emit();
    },
    emit() {
      const value =
        this.date && this.time
          ? moment(this.date + " " + this.time).unix()
          : null;
      this.$emit("input", value);
    },
  },
};
</script>
