<template>
  <v-form ref="form">
    <v-row>
      <v-col cols="12">
        <v-checkbox
          v-for="t in availableTypes"
          :key="t"
          :label="t"
          :model-value="type && type[t]"
          density="compact"
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
          :rules="(requireKeyword && [required]) || []"
          @update:model-value="emit('update:keyword', $event)"
        />
      </v-col>
      <v-col sm="6" cols="12">
        <v-combobox
          label="Schlagwort"
          :items="catchphrases"
          :model-value="catchphrase"
          @update:model-value="emit('update:catchphrase', $event)"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-text-field
          label="Alarm"
          append-inner-icon="mdi-alarm-light-outline"
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
          append-inner-icon="mdi-map-marker-outline"
          :model-value="address"
          @update:model-value="emit('update:address', $event)"
        />
      </v-col>
    </v-row>

    <BaseDateTimeDialog
      v-model="showAlarmTimeDialog"
      :max-date="today"
      :min-date="limitAlarmTimeToRecently ? aWeekAgo : null"
      :date="alarmTime"
      @update:date="emit('update:alarmTime', $event)"
    />
  </v-form>
</template>

<script setup lang="ts">
import keywordsMap from "../../../../assets/keywords.json";
import { formatDateTime } from "@/utils/dates";
import { onlyPastAllowed, recently, required } from "@/utils/rules";
import { today, aWeekAgo } from "@/utils/dates";
import { computed, ref } from "vue";

interface GenericKeywordsMap {
  [key: string]: string[];
}

const props = withDefaults(
  defineProps<{
    type?: { [key: string]: boolean };
    keyword?: string;
    catchphrase?: string;
    alarmTime?: number;
    address?: string;
    requireKeyword: boolean;
    limitAlarmTimeToRecently: boolean;
  }>(),
  {
    type: undefined,
    keyword: undefined,
    catchphrase: undefined,
    alarmTime: undefined,
    address: undefined,
    requireKeyword: false,
    limitAlarmTimeToRecently: true,
  }
);

const emit = defineEmits([
  "update:type",
  "update:keyword",
  "update:catchphrase",
  "update:alarmTime",
  "update:address",
]);

const availableTypes = ["Brand", "THL", "UG-ÖEL"];
const showAlarmTimeDialog = ref(false);

const keywords = Object.keys(keywordsMap).sort();
const catchphrases = computed(
  () =>
    (props.keyword &&
      (keywordsMap as GenericKeywordsMap)[props.keyword]?.sort()) ||
    []
);

const alarmTimeFormatted = computed(() =>
  props.alarmTime ? formatDateTime(props.alarmTime) : ""
);

const alarmTimeRules = computed(() => {
  if (props.limitAlarmTimeToRecently) {
    return [required, onlyPastAllowed, recently];
  } else {
    return [required, onlyPastAllowed];
  }
});

function updateType(updatedType: string, value: boolean | null) {
  const newTypes = {
    ...props.type,
    [updatedType]: value === true,
  };
  emit("update:type", newTypes);
}
</script>
