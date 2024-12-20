<template>
  <v-form ref="form">
    <v-row>
      <v-col cols="12">
        <v-checkbox
          v-for="t in availableTypes"
          :key="t"
          :label="t"
          :model-value="type && type[t]"
          @update:model-value="updateType(t, $event)"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col sm="6" cols="12">
        <v-combobox
          label="Stichwort"
          :items="keywords"
          :model-value="keyword"
          :rules="(requireKeyword && [rules.required]) || []"
          @update:model-value="$emit('update:keyword', $event)"
        />
      </v-col>
      <v-col sm="6" cols="12">
        <v-combobox
          label="Schlagwort"
          :items="catchphrases"
          :model-value="catchphrase"
          @update:model-value="$emit('update:catchphrase', $event)"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-text-field
          label="Alarm"
          prepend-icon="mdi-alarm-light-outline"
          :model-value="alarmTimeFormatted"
          :rules="alarmTimeRules"
          readonly
          @click="showAlarmTimeDialog = true"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-text-field
          label="Adresse"
          prepend-icon="mdi-map-marker-outline"
          :model-value="address"
          @update:model-value="$emit('update:address', $event)"
        />
      </v-col>
    </v-row>

    <BaseDateTimeDialog
      v-model="showAlarmTimeDialog"
      :max-date="today"
      :min-date="limitAlarmTimeToRecently ? aWeekAgo : null"
      :date="alarmTime"
      @update:date="$emit('update:alarmTime', $event)"
    />
  </v-form>
</template>

<script>
import FormMixin from "@/mixins/FormMixin";
import keywordsMap from "@/assets/keywords.json";
import { formatDateTime } from "@/utils/dates";

export default FormMixin.extend({
  props: {
    type: null,
    keyword: null,
    catchphrase: null,
    alarmTime: null,
    address: null,

    requireKeyword: {
      type: Boolean,
      default: false,
    },
    limitAlarmTimeToRecently: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      availableTypes: ["Brand", "THL", "UG-ÖEL"],

      showAlarmTimeDialog: false,

      ruleSelectionIsNotEmpty: (value) =>
        (value && value.length > 0) || "Bitte wähle mindestens einen Typ aus",
    };
  },

  computed: {
    keywords() {
      return Object.keys(keywordsMap).sort();
    },
    catchphrases() {
      return (
        (keywordsMap[this.keyword] && keywordsMap[this.keyword].sort()) || []
      );
    },

    alarmTimeFormatted() {
      return this.alarmTime ? formatDateTime(this.alarmTime) : "";
    },

    alarmTimeRules() {
      if (this.limitAlarmTimeToRecently) {
        return [
          this.rules.required,
          this.rules.onlyPastAllowed,
          this.rules.recently,
        ];
      } else {
        return [this.rules.required, this.rules.onlyPastAllowed];
      }
    },
  },

  methods: {
    updateType(updatedType, value) {
      const newTypes = {
        ...this.type,
        [updatedType]: value === true,
      };
      this.update("type", newTypes);
    },
  },
});
</script>
