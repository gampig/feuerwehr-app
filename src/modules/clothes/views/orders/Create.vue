<template>
  <BaseCreatePage
    page-title="Bestellung hinzufügen"
    :creating="creating"
    @submit="onSubmit"
  >
    <OrderForm ref="form" v-bind.sync="item" create />
  </BaseCreatePage>
</template>

<script>
import OrderForm from "../../components/form/OrderForm";
import makeCreateMixin from "@/mixins/CreateMixin";
import moment from "moment";

export default makeCreateMixin("ClothesOrder", "orders").extend({
  components: {
    OrderForm,
  },

  data() {
    return {
      item: {
        person: null,
        clothingType: null,
        size: null,
        count: 1,
        paid: null,
        submittedOn: null,
        orderedOn: null,
        doneOn: null,
      },
    };
  },

  methods: {
    validate() {
      return this.$refs.form.$refs.form.validate();
    },

    onSubmit() {
      const item = { ...this.item };
      item.submittedOn = moment().unix();
      this.create(item);
    },
  },
});
</script>
