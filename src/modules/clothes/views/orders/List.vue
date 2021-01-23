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
        <v-btn @click="addHandler" color="primary">
          <v-icon left>mdi-plus</v-icon>
          Neu
        </v-btn>
      </v-col>
    </v-row>

    <SearchRow :search.sync="search" />

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
              <OrderCard v-bind="item" @edit="editHandler(item)" />
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
          <ActionCell
            slot="item.action"
            slot-scope="props"
            :handle-edit="() => editHandler(props.item)"
          />
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { mapState } from "vuex";
import makeListMixin from "@/mixins/ListMixin";
import Loading from "@/components/Loading.vue";
import SearchRow from "@/components/SearchRow.vue";
import ActionCell from "@/components/ActionCell.vue";
import OrderCard from "../../components/OrderCard.vue";
import { formatDate } from "@/utils/dates";
import moment from "moment";
/* eslint-disable no-unused-vars */
import { Order } from "../../models/Order";
import { ClothType } from "../../models/ClothType";
/* eslint-enable */

function latestTimestampOfOrder(order: Order) {
  function dateToTimestamp(date: any) {
    return moment(date, "L").unix();
  }
  return Math.max(
    dateToTimestamp(order.doneOn),
    dateToTimestamp(order.orderedOn),
    dateToTimestamp(order.submittedOn)
  );
}

export default makeListMixin("ClothesOrder", "orders").extend({
  components: { Loading, SearchRow, ActionCell, OrderCard },

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
        { text: "Kleidung", value: "clothType" },
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
    };
  },

  computed: {
    ...mapState("orders", { allOrders: "orders" }),
    ...mapState("clothTypes", ["types"]),

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

          const clothType = order.clothType
            ? (this.types as ClothType[]).find(
                (type) => type.id === order.clothType
              )
            : undefined;
          orderFormatted.clothType =
            clothType && `${clothType.manufacturer}: ${clothType.name}`;

          const price = clothType?.price || 0;
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
});
</script>
