<template>
  <BaseCreateDialog
    :model-value="modelValue"
    max-width="900"
    :loading="loading"
    title="Neue Bestellung"
    @update:model-value="cancel"
    @create="save"
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
  </BaseCreateDialog>
</template>

<script lang="ts">
import OrderForm from "./OrderForm.vue";
import moment from "moment";
import { defineComponent } from "vue";
import { VForm } from "vuetify/components";
import { OrderEntity } from "../../models/Order";
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
      loading: false,

      item: {
        person: undefined,
        clothingType: undefined,
        size: undefined,
        count: 1,
        paid: undefined,
        submittedOn: undefined,
        orderedOn: undefined,
        doneOn: undefined,
      } as Partial<OrderEntity>,
    };
  },

  methods: {
    async validate() {
      const form = (this.$refs?.form as any)?.$refs?.form as VForm | undefined;
      return form ? (await form.validate()).valid : false;
    },

    reset() {
      (this.$refs?.form as any)?.$refs?.form?.reset();
    },

    closeDialog() {
      this.reset();
      this.$emit("update:model-value", false);
    },

    cancel() {
      this.closeDialog();
    },

    async save() {
      const item = { ...(this.item as OrderEntity) };
      item.submittedOn = moment().unix();

      if (await this.validate()) {
        this.loading = true;

        useOrdersStore()
          .create(item)
          .then(() => {
            this.$showMessage("Bestellung wurde erstellt.");
            this.closeDialog();
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
  },
});
</script>
