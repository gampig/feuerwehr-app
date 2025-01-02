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
          <v-icon start>mdi-plus</v-icon>
          Neu
        </v-btn>
      </v-col>
    </v-row>

    <BaseSearchRow v-model:search="search" />

    <v-row>
      <v-col cols="12">
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

        <div v-else class="text--secondary">Keine Bestellungen vorhanden.</div>
      </v-col>
    </v-row>

    <CreateDialog v-model="showCreateDialog"></CreateDialog>
    <EditDialog v-model="showEditDialog"></EditDialog>

    <BaseConfirmDialog
      v-model="showRemoveConfirmationDialog"
      @confirm="remove"
    />
  </v-container>
</template>

<script lang="ts">
import Loading from "@/components/Loading.vue";
import OrderCard from "../components/orders/OrderCard.vue";
import CreateDialog from "../components/orders/CreateDialog.vue";
import EditDialog from "../components/orders/EditDialog.vue";
import { formatDate, sortDate } from "@/utils/dates";
import moment from "moment";
import { defineComponent } from "vue";
import { Order } from "../models/Order";
import { mapActions, mapState } from "pinia";
import { useClothingTypesStore } from "../stores/clothingTypes";
import { useOrdersStore } from "../stores/orders";
import { VueDatabaseQueryData } from "vuefire";
import { SortItem } from "@/models/SortItem";

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

export default defineComponent({
  components: { Loading, OrderCard, CreateDialog, EditDialog },

  data() {
    return {
      headers: [
        {
          text: "Eingereicht",
          value: "submittedOn",
          sort: sortDate,
        },
        { text: "Bestellt", value: "orderedOn", sort: sortDate },
        { text: "Erledigt", value: "doneOn", sort: sortDate },
        { text: "Kleidung", value: "clothingType" },
        { text: "Person", value: "person" },
        {
          text: "Aktionen",
          value: "action",
          sortable: false,
        },
      ],

      options: {
        sortBy: [{ key: "submittedOn" }] as SortItem[],
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
    ...mapState(useOrdersStore, { allOrders: "orders", loading: "loading" }),
    ...mapState(useClothingTypesStore, ["types"]),

    orders(): VueDatabaseQueryData<Order> {
      return this.allOrders
        .filter((item) => this.showDoneOrders == !!item.doneOn)
        .map((order) => {
          const orderFormatted = { ...order, id: order.id } as any;

          orderFormatted.submittedOn =
            order.submittedOn && formatDate(order.submittedOn);
          orderFormatted.orderedOn =
            order.orderedOn && formatDate(order.orderedOn);
          orderFormatted.doneOn = order.doneOn && formatDate(order.doneOn);

          const clothingType = order.clothingType
            ? this.types.find((type) => type.id === order.clothingType)
            : undefined;
          orderFormatted.clothingType = clothingType && clothingType.name;

          const price = clothingType?.price || 0;
          const count = order?.count || 1;
          orderFormatted.totalPrice = price * count;

          return orderFormatted;
        });
    },

    filteredOrders() {
      const sortedOrders = [...this.orders].sort(
        (a, b) => latestTimestampOfOrder(b) - latestTimestampOfOrder(a)
      );

      return this.filterList(sortedOrders, this.search);
    },
  },

  methods: {
    ...mapActions(useOrdersStore, ["selectOrder"]),

    create() {
      this.showCreateDialog = true;
    },

    edit(orderId: string) {
      this.selectOrder(orderId);
      this.showEditDialog = true;
    },

    remove(orderId?: string) {
      const orderToRemove =
        orderId === undefined ? this.orderToRemove : orderId;
      this.showRemoveConfirmationDialog = false;
      useOrdersStore().remove(orderToRemove);
    },

    askForConfirmationToRemove(orderId: string) {
      this.orderToRemove = orderId;
      this.showRemoveConfirmationDialog = true;
    },

    filterList(list: Array<any>, search: string) {
      if (search) {
        const searchLowerCase = search.toLowerCase();
        return list.filter((item) =>
          Object.values(item).some((value) =>
            String(value).toLowerCase().includes(searchLowerCase)
          )
        );
      } else {
        return list;
      }
    },
  },
});
</script>
