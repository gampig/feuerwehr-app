<template>
  <BaseEditDialog
    :value="value"
    max-width="700"
    :title="personId"
    :saving="loading"
    @input="cancel"
    @save="save"
  >
    <v-form ref="form">
      <v-container>
        <v-row>
          <v-col cols="12">
            <SelectStatus v-model="status"></SelectStatus>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </BaseEditDialog>
</template>

<script lang="ts">
import Vue from "vue";
import SelectStatus from "./SelectStatus.vue";
/* eslint-disable no-unused-vars */
import { Person } from "../models/Person";
/* eslint-enable */

export default Vue.extend({
  components: { SelectStatus },

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
      loading: false,
      status: "Aktiv",
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
    person() {
      this.loadData();
    },

    value(showDialog) {
      if (showDialog) this.loadData();
    },
  },

  mounted() {
    this.loadData();
  },

  methods: {
    loadData() {
      if (this.person) this.status = this.person.status;
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
        .dispatch("people/update", {
          id: this.personId,
          status: this.status,
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
