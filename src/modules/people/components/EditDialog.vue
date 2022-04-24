<template>
  <v-dialog :value="value" max-width="700" @input="cancel">
    <v-card>
      <v-card-title> {{ personId }} </v-card-title>

      <v-divider></v-divider>

      <v-card-text>
        <v-form ref="form">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-chip-group
                  v-model="status"
                  active-class="primary"
                  mandatory
                  column
                >
                  <v-chip
                    v-for="availableStatus in availableStatusValues"
                    :key="availableStatus"
                  >
                    {{ availableStatus }}
                  </v-chip>
                </v-chip-group>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn text @click="cancel">Abbrechen</v-btn>
        <v-spacer></v-spacer>
        <v-btn text color="primary" :loading="loading" @click="save">
          Speichern
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
/* eslint-disable no-unused-vars */
import {
  Person,
  ALL_PERSON_STATUS_VALUES,
} from "../../fireDepartment/models/Person";
/* eslint-enable */

export default Vue.extend({
  props: {
    value: {
      type: Boolean,
    },

    personId: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      availableStatusValues: ALL_PERSON_STATUS_VALUES,
      loading: false,
      status: null as null | number,
    };
  },

  computed: {
    person(): null | Person {
      if (!this.personId) return null;
      return this.$store.state.people.people.find(
        (person: Person) => person.id == this.personId
      );
    },
  },

  watch: {
    personId() {
      this.loadData();
    },

    value(showDialog) {
      if (showDialog) this.loadData();
    },
  },

  methods: {
    loadData() {
      const statusText = this.person?.status;
      if (statusText)
        this.status = this.availableStatusValues.indexOf(statusText);
      else this.status = null;
    },

    cancel() {
      this.$emit("input", false);
      (this.$refs.form as any).reset();
    },

    save() {
      if (!(this.$refs.form as any).validate()) return;
      if (this.status === null) return;

      this.loading = true;
      this.$store
        .dispatch("people/set", {
          id: this.personId,
          status: this.availableStatusValues[this.status],
        })
        .then(() => {
          this.$emit("input", false);
          (this.$refs.form as any).reset();
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
});
</script>
