<template>
  <BaseUpdatePage
    page-title="Bestellung bearbeiten"
    :loading="loading"
    :updating="updating"
    @submit="onSubmit"
    @reset="resetItem"
    @delete="del"
  >
    <OrderForm ref="form" v-bind.sync="item" />
  </BaseUpdatePage>
</template>

<script>
import OrderForm from "../../components/form/OrderForm";
import makeUpdateMixin from "@/mixins/UpdateMixin";
import { mapActions, mapState } from "vuex";

export default makeUpdateMixin("ClothesOrder", "orders").extend({
  components: {
    OrderForm,
  },

  data() {
    return {
      loading: false,

      item: {},
      emptyItem: {
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

  computed: {
    ...mapState("orders", ["order"]),
  },

  destroyed() {
    this.unbindOrder();
  },

  methods: {
    ...mapActions("orders", ["bindOrder", "unbindOrder"]),

    validate() {
      return this.$refs.form.$refs.form.validate();
    },

    onSubmit() {
      this.update(this.item);
    },

    retrieveItem() {
      this.loading = true;
      this.bindOrder(this.id)
        .then(() => {
          this.resetItem();
        })
        .finally(() => {
          this.loading = false;
        });
    },
    resetItem() {
      if (this.order) {
        this.item = Object.assign({}, this.emptyItem, this.order);
      } else {
        this.item = { ...this.emptyItem };
      }
    },
  },
});
</script>
