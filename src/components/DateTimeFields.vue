<template>
  <v-row>
    <v-col sm="6" cols="12">
      <v-text-field
        :label="'Datum ' + label"
        type="date"
        :prepend-icon="prependIcon"
        :value="date"
        :rules="rulesDate"
        @click="editDate = true"
        @click:clear="updateDate(null)"
        :clearable="clearable"
        readonly
      />
    </v-col>
    <v-col sm="6" cols="12">
      <v-text-field
        :label="'Uhrzeit ' + label"
        type="time"
        :prepend-icon="prependIcon"
        :value="time"
        @input="updateTime"
        :rules="rulesTime"
        :clearable="clearable"
      />
    </v-col>

    <date-dialog
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
import DateDialog from "@/components/dialogs/DateDialog";

export default {
  props: {
    label: {
      type: String,
    },
    prependIcon: {
      type: String,
    },
    maxDate: {
      type: String,
    },
    minDate: {
      type: String,
    },
    rulesDate: {
      type: Array,
    },
    rulesTime: {
      type: Array,
    },
    clearable: {
      type: Boolean,
      default: false,
    },

    value: {
      type: Number,
    },
  },

  components: {
    DateDialog,
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
