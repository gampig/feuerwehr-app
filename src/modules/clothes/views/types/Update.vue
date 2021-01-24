<template>
  <BaseUpdatePage
    page-title="Kleidungsstück bearbeiten"
    :loading="loading"
    :updating="updating"
    @submit="onSubmit"
    @reset="resetItem"
    @delete="del"
  >
    <TypeForm ref="form" v-bind.sync="item" />
  </BaseUpdatePage>
</template>

<script>
import TypeForm from "../../components/form/TypeForm";
import makeUpdateMixin from "@/mixins/UpdateMixin";
import { mapActions, mapState } from "vuex";

export default makeUpdateMixin("ClothesType", "clothTypes").extend({
  components: {
    TypeForm,
  },

  data() {
    return {
      loading: false,

      item: {},
      emptyItem: {
        category: null,
        manufacturer: null,
        name: null,
        price: null,
        isAvailable: null,
        sizes: null,
      },
    };
  },

  computed: {
    ...mapState("clothTypes", ["type"]),
  },

  destroyed() {
    this.unbindType();
  },

  methods: {
    ...mapActions("clothTypes", ["bindType", "unbindType"]),

    validate() {
      return this.$refs.form.$refs.form.validate();
    },

    onSubmit() {
      this.update(this.item);
    },

    retrieveItem() {
      this.loading = true;
      this.bindType(this.id)
        .then(() => {
          this.resetItem();
        })
        .finally(() => {
          this.loading = false;
        });
    },
    resetItem() {
      if (this.type) {
        this.item = Object.assign({}, this.emptyItem, this.type);
      } else {
        this.item = { ...this.emptyItem };
      }
    },
  },
});
</script>
