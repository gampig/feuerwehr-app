<template>
  <BaseCreateDialog
    :model-value="modelValue"
    max-width="500"
    :loading="loading"
    title="Person hinzufügen"
    @update:model-value="cancel"
    @create="create"
  >
    <v-form ref="form">
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="firstName"
              label="Vorname"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="lastName"
              label="Nachname"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <SelectStatus v-model="status"></SelectStatus>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </BaseCreateDialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { PersonStatus } from "../models/Person";
import { usePeopleStore } from "../stores/people";
import SelectStatus from "./SelectStatus.vue";
import { VForm } from "vuetify/components";

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default defineComponent({
  components: { SelectStatus },

  props: {
    modelValue: {
      type: Boolean,
    },
  },

  data() {
    return {
      rules: {
        required: (value: string | null) => !!value || "Erforderlich",
      },

      loading: false,

      firstName: "",
      lastName: "",
      status: "Aktiv" as PersonStatus,
    };
  },

  methods: {
    cancel() {
      this.$emit("update:model-value", false);
      (this.$refs.form as any).reset();
    },

    async create() {
      if (!(await (this.$refs.form as VForm).validate()).valid) return;

      this.loading = true;
      const personId =
        capitalizeFirstLetter(this.lastName.trim()) +
        ", " +
        capitalizeFirstLetter(this.firstName.trim());

      usePeopleStore()
        .update({
          id: personId,
          status: this.status || "Aktiv",
        })
        .then(() => {
          (this.$refs.form as any).reset();
          this.$showMessage('"' + personId + '" hinzugefügt.');
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
});
</script>
