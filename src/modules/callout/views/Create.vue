<template>
  <CreatePage
    page-title="Einsatz erstellen"
    @submit="onSubmit"
    :creating="creating"
  >
    <CalloutForm ref="form" v-bind.sync="item" require-keyword />
  </CreatePage>
</template>

<script>
import CreatePage from "@/components/pages/CreatePage";
import CalloutForm from "../components/form/Form";
import makeCreateMixin from "@/mixins/CreateMixin";

export default makeCreateMixin("Callout", "callouts").extend({
  components: {
    CreatePage,
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
