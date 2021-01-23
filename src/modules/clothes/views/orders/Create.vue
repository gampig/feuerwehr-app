<template>
  <CreatePage
    page-title="Bestellung hinzufügen"
    @submit="onSubmit"
    :creating="creating"
  >
    <OrderForm ref="form" v-bind.sync="item" create />
  </CreatePage>
</template>

<script>
import CreatePage from "@/components/pages/CreatePage";
import OrderForm from "../../components/form/OrderForm";
import makeCreateMixin from "@/mixins/CreateMixin";
import moment from "moment";

export default makeCreateMixin("ClothesOrder", "orders").extend({
  components: {
    CreatePage,
    OrderForm,
  },

  data() {
    return {
      item: {
        person: null,
        clothType: null,
        size: null,
        count: null,
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
