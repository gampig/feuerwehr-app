<template>
  <v-card>
    <v-card-text>
      <div class="text--primary">
        {{ person }}
      </div>
      <p class="text-h5 text--primary">
        {{ clothingType }}
      </p>

      <div v-if="size" class="mb-3">
        <v-icon start>mdi-ruler</v-icon>
        {{ size }}
      </div>

      <div v-if="count && count >= 2" class="mb-3">
        <v-icon start>mdi-cart-variant</v-icon>
        {{ count }}
      </div>

      <div v-if="totalPrice" class="mb-3">
        <v-icon start>mdi-cash</v-icon>
        {{ formatCurrency(paid || 0) }} / {{ formatCurrency(totalPrice) }} €
      </div>

      <div v-if="partNumber" class="mb-3">
        <v-icon start>mdi-barcode</v-icon>
        Art.-Nr.: {{ partNumber }}
      </div>

      <v-timeline class="mt-5" density="compact">
        <v-timeline-item
          icon="mdi-plus"
          :dot-color="currentState === 'submitted' ? 'red' : 'grey'"
          :icon-color="currentState === 'submitted' ? 'white' : 'grey'"
          :size="currentState === 'submitted' ? 'default' : 'x-small'"
          :class="currentState === 'submitted' ? '' : 'text-disabled'"
          fill-dot
        >
          Eingereicht: {{ submittedOn }}
        </v-timeline-item>

        <v-timeline-item
          icon="mdi-package-variant-closed"
          :dot-color="currentState === 'ordered' ? 'orange' : 'grey'"
          :icon-color="currentState === 'ordered' ? 'white' : 'grey'"
          :size="currentState === 'ordered' ? 'default' : 'x-small'"
          :class="currentState === 'ordered' ? '' : 'text-disabled'"
          fill-dot
        >
          Bestellt<template v-if="orderedOn">: {{ orderedOn }}</template>
        </v-timeline-item>

        <v-timeline-item
          icon="mdi-check"
          :dot-color="currentState === 'done' ? 'green' : 'grey'"
          :icon-color="currentState === 'done' ? 'white' : 'grey'"
          :size="currentState === 'done' ? 'default' : 'x-small'"
          :class="currentState === 'done' ? '' : 'text-disabled'"
          fill-dot
        >
          Erledigt<template v-if="doneOn">: {{ doneOn }}</template>
        </v-timeline-item>
      </v-timeline>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions>
      <v-btn icon @click="emit('remove')">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn variant="text" @click="emit('edit')">Bearbeiten</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { OrderView } from "../../models/Order";

const formatter = new Intl.NumberFormat("de-DE", {
  minimumFractionDigits: 0,
});

type OrderState = "submitted" | "ordered" | "done";

const {
  person,
  clothingType,
  size,
  count,
  paid,
  totalPrice,
  submittedOn,
  orderedOn,
  doneOn,
  partNumber,
} = defineProps<OrderView>();

const emit = defineEmits(["edit", "remove"]);

const currentState = computed((): OrderState => {
  if (doneOn) {
    return "done";
  } else if (orderedOn) {
    return "ordered";
  } else {
    return "submitted";
  }
});

function formatCurrency(value: number) {
  return formatter.format(value);
}
</script>
