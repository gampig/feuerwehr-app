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

      <v-timeline class="mt-5" density="compact">
        <v-timeline-item
          icon="mdi-plus"
          :dot-color="currentState === 'submitted' ? 'red' : 'grey'"
          :icon-color="currentState === 'submitted' ? 'white' : 'grey'"
          :size="currentState === 'submitted' ? 'default' : 'x-small'"
          :class="currentState === 'submitted' ? '' : 'text-disabled'"
          fill-dot
        >
          <div>{{ submittedOn }}</div>
          <div>Eingereicht</div>
        </v-timeline-item>

        <v-timeline-item
          v-if="orderedOn"
          icon="mdi-package-variant-closed"
          :dot-color="currentState === 'ordered' ? 'orange' : 'grey'"
          :icon-color="currentState === 'ordered' ? 'white' : 'grey'"
          :size="currentState === 'ordered' ? 'default' : 'x-small'"
          :class="currentState === 'ordered' ? '' : 'text-disabled'"
          fill-dot
        >
          <div>{{ orderedOn }}</div>
          <div>Bestellt</div>
        </v-timeline-item>

        <v-timeline-item
          v-if="doneOn"
          dot-color="green"
          icon="mdi-check"
          fill-dot
        >
          <div>{{ doneOn }}</div>
          <div>Erledigt</div>
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
} = defineProps<{
  person: string;
  clothingType: string;
  size?: string;
  count?: number;
  paid?: number;
  totalPrice?: number;
  submittedOn?: string;
  orderedOn?: string;
  doneOn?: string;
}>();

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
