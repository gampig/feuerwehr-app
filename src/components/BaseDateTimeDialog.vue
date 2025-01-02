<template>
  <v-dialog
    :model-value="modelValue"
    persistent
    width="auto"
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

          <VForm ref="timeForm">
            <v-container grid-list-md>
              <v-layout wrap>
                <div>
                  <v-text-field
                    v-model="hour"
                    type="number"
                    min="0"
                    max="23"
                    variant="filled"
                    :rules="[isHour]"
                  />
                </div>
                <p class="align-self-center mb-6 ml-3 mr-3">:</p>
                <div>
                  <v-text-field
                    v-model="minute"
                    type="number"
                    min="0"
                    max="59"
                    variant="filled"
                    :rules="[isMinute]"
                  />
                </div>
              </v-layout>
            </v-container>
          </VForm>
        </v-tabs-window-item>
        <v-tabs-window-item key="date">
          <v-date-picker
            v-model="dateVal"
            :max="maxDate"
            :min="minDate"
            color="primary"
            class="elevation-0"
            tile
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

<script setup lang="ts">
import { ref, watch } from "vue";
import { VForm } from "vuetify/components";

const hourRegex = new RegExp("^([01]?\\d|2[0-3])$");
const minuteRegex = new RegExp("^([0-5]?\\d)$");

function pad(n: number) {
  return n < 10 ? "0" + n : n.toString();
}

const emit = defineEmits(["update:model-value", "update:date"]);

const { modelValue, date, maxDate, minDate } = defineProps<{
  modelValue: boolean;
  date?: number;
  maxDate?: string;
  minDate?: string;
}>();

const timeForm = ref<VForm>();
const dateTabs = ref<string>();
const dateVal = ref<Date>();
const hour = ref("00");
const minute = ref("00");

function isHour(value: any) {
  return hourRegex.test(value) || "Ungültig";
}

function isMinute(value: any) {
  return minuteRegex.test(value) || "Ungültig";
}

function reset() {
  dateTabs.value = undefined;

  const currentMoment = date ? new Date(date * 1000) : new Date();
  dateVal.value = currentMoment;
  hour.value = pad(currentMoment.getHours());
  minute.value = pad(currentMoment.getMinutes());
}

function cancel() {
  dateTabs.value = undefined;
  emit("update:model-value", false);
}

async function save() {
  if (!timeForm.value || !dateVal.value) {
    return;
  }

  if (!(await timeForm.value.validate()).valid) {
    dateTabs.value = "time";
  } else {
    dateTabs.value = undefined;
    emit("update:model-value", false);

    dateVal.value.setHours(Number(hour.value));
    dateVal.value.setMinutes(Number(minute.value));
    emit("update:date", dateVal.value.getTime() / 1000);
  }
}

watch(() => modelValue, reset);
</script>

<style scoped>
.v-dialog > .v-overlay__content > .v-card {
  display: block;
}
</style>
