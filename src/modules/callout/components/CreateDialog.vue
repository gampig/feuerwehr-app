<template>
  <v-dialog
    :model-value="modelValue"
    persistent
    max-width="900"
    @update:model-value="cancel"
  >
    <v-card>
      <v-card-title> Neuer Einsatz </v-card-title>

      <v-divider></v-divider>

      <v-card-text>
        <CalloutForm
          ref="form"
          v-model:type="item.type"
          v-model:keyword="item.keyword"
          v-model:catchphrase="item.catchphrase"
          v-model:alarm-time="item.alarmTime"
          v-model:address="item.address"
        ></CalloutForm>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn variant="text" @click="cancel"> Abbrechen </v-btn>
        <v-spacer />
        <v-btn :loading="loading" color="primary" variant="text" @click="save">
          Speichern
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from "pinia";
import CalloutForm from "./form/Form.vue";
import { useCalloutStore } from "../stores/callout";
import { useCalloutsStore } from "../stores/callouts";

export default {
  components: { CalloutForm },

  props: {
    modelValue: {
      type: Boolean,
    },
  },

  emits: ["update:model-value", "save"],

  data() {
    return {
      item: {},
      loading: false,
    };
  },

  created() {
    this.reset();
  },

  methods: {
    ...mapActions(useCalloutsStore, ["create"]),
    ...mapActions(useCalloutStore, ["selectCallout"]),

    reset() {
      this.item = {
        type: null,
        keyword: null,
        catchphrase: null,
        alarmTime: null,
        endTime: null,
        address: null,
      };
      this.loading = false;
    },

    cancel() {
      this.$emit("update:model-value", false);
      this.reset();
    },

    async save() {
      if ((await this.$refs.form.$refs.form.validate()).valid) {
        this.loading = true;
        this.create(this.item)
          .then((ref) => {
            if (ref) {
              this.selectCallout(ref.key);
              this.$emit("update:model-value", false);
              this.$emit("save", ref.key);
              this.reset();
            }
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
  },
};
</script>
