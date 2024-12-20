<template>
  <BaseEditDialog
    :value="value"
    max-width="900"
    :title="(clothingType && clothingType.name) || 'Kleidungsstück bearbeiten'"
    :loading="loading"
    :saving="saving"
    @input="cancel"
    @save="save"
  >
    <v-container fluid>
      <TypeForm ref="form" v-bind.sync="item" />
    </v-container>
  </BaseEditDialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TypeForm from "./TypeForm.vue";
import { mapState } from "vuex";
import { ClothingType } from "../../models/ClothingType";

export default defineComponent({
  components: {
    TypeForm,
  },

  props: {
    value: {
      type: Boolean,
    },
  },

  data() {
    return {
      saving: false,

      item: {} as Partial<ClothingType>,
      emptyItem: {
        category: undefined,
        name: undefined,
        price: undefined,
        isAvailable: undefined,
        sizes: undefined,
      } as Partial<ClothingType>,
    };
  },

  computed: {
    ...mapState("clothingTypes", {
      clothingType: "type",
      loading: "loadingType",
    }),
  },

  watch: {
    loading(loading) {
      if (!loading) {
        this.reset();
      }
    },
  },

  methods: {
    validate() {
      return (this.$refs?.form as any)?.$refs?.form?.validate();
    },

    reset() {
      if (this.clothingType) {
        this.item = Object.assign({}, this.emptyItem, this.clothingType);
      } else {
        this.item = { ...this.emptyItem };
      }
    },

    closeDialog() {
      this.reset();
      this.$emit("input", false);
    },

    cancel() {
      this.closeDialog();
    },

    save() {
      if (this.validate()) {
        this.saving = true;

        this.$store
          .dispatch("clothingTypes/set", this.item)
          .then(() => {
            this.$showMessage("Gespeichert");
            this.closeDialog();
          })
          .finally(() => {
            this.saving = false;
          });
      }
    },
  },
});
</script>
