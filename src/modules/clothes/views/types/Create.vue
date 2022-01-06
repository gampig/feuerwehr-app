<template>
  <BaseCreatePage
    page-title="Kleidungsstück hinzufügen"
    :creating="creating"
    @submit="onSubmit"
  >
    <TypeForm ref="form" v-bind.sync="item" create />
  </BaseCreatePage>
</template>

<script>
import TypeForm from "../../components/form/TypeForm";
import makeCreateMixin from "@/mixins/CreateMixin";

export default makeCreateMixin("ClothesType", "clothingTypes").extend({
  components: {
    TypeForm,
  },

  data() {
    return {
      item: {
        category: null,
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
