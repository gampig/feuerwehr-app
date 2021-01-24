<template>
  <BaseCreatePage
    page-title="Einsatz erstellen"
    :creating="creating"
    @submit="onSubmit"
  >
    <CalloutForm ref="form" v-bind.sync="item" require-keyword />
  </BaseCreatePage>
</template>

<script>
import CalloutForm from "../components/form/Form";
import makeCreateMixin from "@/mixins/CreateMixin";

export default makeCreateMixin("Callout", "callouts").extend({
  components: {
    CalloutForm,
  },

  data() {
    return {
      item: {
        type: null,
        keyword: null,
        catchphrase: null,
        alarmTime: null,
        endTime: null,
        address: null,
      },
    };
  },

  methods: {
    validate() {
      return this.$refs.form.$refs.form.validate();
    },

    onSubmit() {
      this.create(this.item);
    },
  },
});
</script>
