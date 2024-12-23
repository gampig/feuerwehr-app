<template>
  <BaseEditDialog
    :model-value="modelValue"
    max-width="700"
    :title="personId"
    :saving="loading"
    @update:model-value="cancel"
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
import { defineComponent } from "vue";
import SelectStatus from "./SelectStatus.vue";
import { Person, PersonStatus } from "../models/Person";
import { usePeopleStore } from "../stores/people";

export default defineComponent({
  components: { SelectStatus },

  props: {
    modelValue: {
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
      status: "Aktiv" as PersonStatus,
    };
  },

  computed: {
    person(): null | Person | undefined {
      if (!this.personId) return null;
      return usePeopleStore().people.find(
        (person: Person) => person.id == this.personId
      );
    },
  },

  watch: {
    person() {
      this.loadData();
    },

    modelValue(showDialog) {
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
      this.$emit("update:model-value", false);
      (this.$refs.form as any).reset();
    },

    save() {
      if (!(this.$refs.form as any).validate()) return;
      if (this.status === null) return;

      this.loading = true;
      usePeopleStore()
        .update({
          id: this.personId,
          status: this.status,
        })
        .then(() => {
          this.$emit("update:model-value", false);
          (this.$refs.form as any).reset();
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
});
</script>
