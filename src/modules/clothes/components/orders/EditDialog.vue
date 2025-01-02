<template>
  <BaseEditDialog
    :model-value="modelValue"
    max-width="900"
    title="Bestellung bearbeiten"
    :loading="loading"
    :saving="saving"
    @update:model-value="cancel"
    @save="save"
  >
    <OrderForm
      ref="form"
      v-model:person="item.person"
      v-model:clothing-type="item.clothingType"
      v-model:size="item.size"
      v-model:count="item.count"
      v-model:paid="item.paid"
      v-model:submitted-on="item.submittedOn"
      v-model:ordered-on="item.orderedOn"
      v-model:done-on="item.doneOn"
    />
  </BaseEditDialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import OrderForm from "./OrderForm.vue";
import { VForm } from "vuetify/components";
import { Order } from "../../models/Order";
import { mapState } from "pinia";
import { useOrdersStore } from "../../stores/orders";

export default defineComponent({
  components: {
    OrderForm,
  },

  props: {
    modelValue: {
      type: Boolean,
    },
  },

  emits: ["update:model-value"],

  data() {
    return {
      saving: false,

      item: {} as Partial<Order>,
      emptyItem: {
        person: undefined,
        clothingType: undefined,
        size: undefined,
        count: undefined,
        paid: undefined,
        submittedOn: undefined,
        orderedOn: undefined,
        doneOn: undefined,
      } as Partial<Order>,
    };
  },

  computed: {
    ...mapState(useOrdersStore, {
      order: "selectedOrder",
      loading: "selectedOrderLoading",
    }),
  },

  watch: {
    loading(loading) {
      if (!loading) {
        this.reset();
      }
    },

    modelValue(modelValue) {
      if (modelValue) {
        this.reset();
      }
    },
  },

  methods: {
    async validate() {
      const form = (this.$refs?.form as any)?.$refs?.form as VForm | undefined;
      return form ? (await form.validate()).valid : false;
    },

    reset() {
      if (this.order) {
        this.item = Object.assign({}, this.emptyItem, this.order);
      } else {
        this.item = { ...this.emptyItem };
      }
    },

    closeDialog() {
      this.reset();
      this.$emit("update:model-value", false);
    },

    cancel() {
      this.closeDialog();
    },

    async save() {
      if (await this.validate()) {
        this.saving = true;

        useOrdersStore()
          .set(this.item as Order)
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
