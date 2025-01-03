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

    <v-data-iterator :search="search" :items="orders" :loading="loading">
      <template #header>
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              clearable
              variant="solo"
              density="compact"
              placeholder="Suche"
            ></v-text-field>
          </v-col>
        </v-row>
      </template>

      <template #default="{ items }">
        <v-row>
          <v-col v-for="(item, i) in items" :key="i" cols="12" sm="6" md="4">
            <OrderCard
              v-bind="item.raw"
              @edit="edit(item.raw.id)"
              @remove="askForConfirmationToRemove(item.raw.id)"
            />
          </v-col>
        </v-row>
      </template>

      <template #loader>
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <v-skeleton-loader type="card" elevation="1"></v-skeleton-loader>
          </v-col>
        </v-row>
      </template>

      <template #no-data>
        <v-row>
          <v-col class="text-disabled"> Keine Bestellungen vorhanden. </v-col>
        </v-row>
      </template>
    </v-data-iterator>

    <CreateDialog v-model="showCreateDialog"></CreateDialog>
    <EditDialog v-model="showEditDialog"></EditDialog>

    <BaseConfirmDialog
      v-model="showRemoveConfirmationDialog"
      @confirm="remove"
    />
  </v-container>
</template>

<script lang="ts">
import OrderCard from "../components/orders/OrderCard.vue";
import CreateDialog from "../components/orders/CreateDialog.vue";
import EditDialog from "../components/orders/EditDialog.vue";
import { formatDate } from "@/utils/dates";
import { defineComponent } from "vue";
import handleError from "@/utils/store/handleError";
import { OrderView } from "../models/Order";
import { mapActions, mapState } from "pinia";
import { useClothingTypesStore } from "../stores/clothingTypes";
import { useOrdersStore } from "../stores/orders";

export default defineComponent({
  components: { OrderCard, CreateDialog, EditDialog },

  data() {
    return {
      search: "",
      showDoneOrders: false,

      showCreateDialog: false,
      showEditDialog: false,
      showRemoveConfirmationDialog: false,

      orderToRemove: undefined as string | undefined,
    };
  },

  computed: {
    ...mapState(useOrdersStore, { allOrders: "orders", loading: "loading" }),
    ...mapState(useClothingTypesStore, ["types"]),

    orders(): OrderView[] {
      return this.allOrders
        .filter((item) => this.showDoneOrders == !!item.doneOn)
        .reverse()
        .map((order) => {
          const orderFormatted: OrderView = {
            ...order,
            submittedOn: formatDate(order.submittedOn),
            orderedOn:
              order.orderedOn === undefined
                ? undefined
                : formatDate(order.orderedOn),
            doneOn:
              order.doneOn === undefined ? undefined : formatDate(order.doneOn),
            id: order.id,
          };

          const clothingType = order.clothingType
            ? this.types.find((type) => type.id === order.clothingType)
            : undefined;
          orderFormatted.clothingType =
            clothingType?.name ?? order.clothingType;

          const price = clothingType?.price || 0;
          const count = order?.count || 1;
          orderFormatted.totalPrice = price * count;

          return orderFormatted;
        });
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
      if (orderToRemove) {
        useOrdersStore().remove(orderToRemove);
      } else {
        handleError("Interner Fehler: Keine Bestellung ausgewählt");
      }
    },

    askForConfirmationToRemove(orderId: string) {
      this.orderToRemove = orderId;
      this.showRemoveConfirmationDialog = true;
    },
  },
});
</script>
