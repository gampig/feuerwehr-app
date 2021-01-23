<template>
  <CreatePage
    page-title="Kleidungsstück hinzufügen"
    @submit="onSubmit"
    :creating="creating"
  >
    <TypeForm ref="form" v-bind.sync="item" create />
  </CreatePage>
</template>

<script>
import CreatePage from "@/components/pages/CreatePage";
import TypeForm from "../../components/form/TypeForm";
import makeCreateMixin from "@/mixins/CreateMixin";

export default makeCreateMixin("ClothesType", "clothTypes").extend({
  components: {
    CreatePage,
    TypeForm,
  },

  data() {
    return {
      item: {
        category: null,
        manufacturer: null,
        name: null,
        price: null,
        isAvailable: true,
        sizes: null,
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
