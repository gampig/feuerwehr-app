<template>
  <v-container fluid>
    <v-row>
      <v-col cols="6">
        <v-checkbox
          v-model="showDoneOrders"
          label="Erledigte anzeigen"
        ></v-checkbox>
      </v-col>

      <v-col cols="6" class="d-flex justify-end align-center">
        <v-btn color="primary" @click="create">
          <v-icon left>mdi-plus</v-icon>
          Neu
        </v-btn>
      </v-col>
    </v-row>

    <BaseSearchRow :search.sync="search" />

    <v-row>
      <v-col cols="12">
        <template v-if="$vuetify.breakpoint.mobile">
          <Loading :visible="loading" />

          <v-row v-if="filteredOrders && filteredOrders.length > 0">
            <v-col
              v-for="item in filteredOrders"
              :key="item.id"
              cols="12"
              sm="6"
              md="4"
            >
              <OrderCard
                v-bind="item"
                @edit="edit(item.id)"
                @remove="askForConfirmationToRemove(item.id)"
              />
            </v-col>
          </v-row>

          <div v-else class="text--secondary">
            Keine Bestellungen vorhanden.
          </div>
        </template>

        <v-data-table
          v-else
          :headers="headers"
          :items="orders"
          :search="search"
          :loading="loading"
          loading-text="Laden..."
          :options.sync="options"
          class="elevation-1"
          locale="de-DE"
          item-key="id"
        >
          <BaseActionCell
            slot="item.action"
            slot-scope="props"
            :handle-edit="() => edit(props.item.id)"
          />
        </v-data-table>
      </v-col>
    </v-row>

    <CreateDialog v-model="showCreateDialog"></CreateDialog>
    <EditDialog v-model="showEditDialog"></EditDialog>

    <BaseConfirmDelete
      :visible="showRemoveConfirmationDialog"
      :handle-delete="remove"
      @close="showRemoveConfirmationDialog = false"
    >
    </BaseConfirmDelete>
  </v-container>
</template>

<script lang="ts">
import { mapActions, mapState } from "vuex";
import makeListMixin from "@/mixins/ListMixin";
import Loading from "@/components/Loading.vue";
import OrderCard from "../components/OrderCard.vue";
import CreateDialog from "../components/CreateDialog.vue";
import EditDialog from "../components/EditDialog.vue";
import { formatDate } from "@/utils/dates";
import moment from "moment";
/* eslint-disable no-unused-vars */
import { Order } from "../models/Order";
import { ClothingType } from "../models/ClothingType";
/* eslint-enable */

function latestTimestampOfOrder(order: Order) {
  function dateToTimestamp(date: any) {
    if (date === undefined) return 0;
    return moment(date, "L").unix();
  }
  return Math.max(
    dateToTimestamp(order.doneOn),
    dateToTimestamp(order.orderedOn),
    dateToTimestamp(order.submittedOn)
  );
}

export default makeListMixin("ClothesOrder", "orders").extend({
  components: { Loading, OrderCard, CreateDialog, EditDialog },

  data() {
    return {
      headers: [
        {
          text: "Eingereicht",
          value: "submittedOn",
          sort: this.sortDate,
        },
        { text: "Bestellt", value: "orderedOn", sort: this.sortDate },
        { text: "Erledigt", value: "doneOn", sort: this.sortDate },
        { text: "Kleidung", value: "clothingType" },
        { text: "Person", value: "person" },
        {
          text: "Aktionen",
          value: "action",
          sortable: false,
        },
      ],
      options: {
        sortBy: ["submittedOn"],
        sortDesc: [true],
        page: 1,
        itemsPerPage: 15,
      },

      search: "",
      showDoneOrders: false,

      showCreateDialog: false,
      showEditDialog: false,
      showRemoveConfirmationDialog: false,

      orderToRemove: "",
    };
  },

  computed: {
    ...mapState("orders", { allOrders: "orders" }),
    ...mapState("clothingTypes", ["types"]),

    orders(): Order[] {
      return (this.allOrders as Order[])
        .filter((item) => this.showDoneOrders == !!item.doneOn)
        .map((order) => {
          const orderFormatted = { ...order } as any;

          orderFormatted.submittedOn =
            order.submittedOn && formatDate(order.submittedOn);
          orderFormatted.orderedOn =
            order.orderedOn && formatDate(order.orderedOn);
          orderFormatted.doneOn = order.doneOn && formatDate(order.doneOn);

          const clothingType = order.clothingType
            ? (this.types as ClothingType[]).find(
                (type) => type.id === order.clothingType
              )
            : undefined;
          orderFormatted.clothingType = clothingType && clothingType.name;

          const price = clothingType?.price || 0;
          const count = order?.count || 1;
          orderFormatted.totalPrice = price * count;

          return orderFormatted;
        });
    },

    filteredOrders(): Order[] {
      const sortedOrders = [...this.orders].sort(
        (a, b) => latestTimestampOfOrder(b) - latestTimestampOfOrder(a)
      );

      return this.filterList(sortedOrders, this.search);
    },
  },

  methods: {
    ...mapActions("orders", ["bindOrder", "unbindOrder"]),

    create() {
      this.showCreateDialog = true;
    },

    edit(orderId: string) {
      this.bindOrder(orderId);
      this.showEditDialog = true;
    },

    remove() {
      this.showRemoveConfirmationDialog = false;
      this.$store.dispatch("orders/remove", this.orderToRemove);
    },

    askForConfirmationToRemove(orderId: string) {
      this.orderToRemove = orderId;
      this.showRemoveConfirmationDialog = true;
    },
  },
});
</script>
