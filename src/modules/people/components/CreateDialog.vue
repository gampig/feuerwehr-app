<template>
  <v-dialog :value="value" @input="cancel">
    <v-card>
      <v-card-title> Person hinzufügen </v-card-title>

      <v-divider></v-divider>

      <v-card-text>
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
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn text @click="cancel">Abbrechen</v-btn>
        <v-spacer></v-spacer>
        <v-btn text color="primary" :loading="loading" @click="create">
          Hinzufügen
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import NotificationMixin from "@/mixins/NotificationMixin";
import SelectStatus from "./SelectStatus.vue";

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default NotificationMixin.extend({
  components: { SelectStatus },

  props: {
    value: {
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
      status: null as null | string,
    };
  },

  methods: {
    cancel() {
      this.$emit("input", false);
      (this.$refs.form as any).reset();
    },

    create() {
      if (!(this.$refs.form as any).validate()) return;

      this.loading = true;
      const personId =
        capitalizeFirstLetter(this.lastName.trim()) +
        ", " +
        capitalizeFirstLetter(this.firstName.trim());

      this.$store
        .dispatch("people/set", {
          id: personId,
          status: this.status || "Aktiv",
        })
        .then(() => {
          (this.$refs.form as any).reset();
          this.showMessage('"' + personId + '" hinzugefügt.');
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
});
</script>
