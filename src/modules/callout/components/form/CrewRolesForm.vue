<template>
  <v-row>
    <v-col
      v-for="crewMember in crew"
      :key="crewMember.person"
      cols="12"
      sm="6"
      md="6"
      lg="4"
    >
      <crew-member-card
        :person="crewMember.person"
        :role="crewMember.role"
        :loading="loading[crewMember.person]"
        :outlined="cardsOutlined"
        @update:model-value="submit(crewMember.person, $event)"
        @delete="remove(crewMember.person)"
      >
      </crew-member-card>
    </v-col>

    <BaseConfirmDialog
      :model-value="personToRemove !== null"
      confirm-text="Entfernen"
      width="300"
      @cancel="cancelRemoval"
      @confirm="confirmRemoval"
    >
      Soll {{ personToRemove }} wirklich von der Mannschaft entfernt werden?
    </BaseConfirmDialog>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import crewMemberCard from "../cards/CrewMemberCard.vue";
import { CalloutRole } from "../../models/Callout";

interface CrewMember {
  person: string;
  role?: CalloutRole;
}

interface LoadingMap {
  [personId: string]: boolean;
}

export default defineComponent({
  components: { crewMemberCard },

  props: {
    crew: {
      type: Array as PropType<CrewMember[]>,
      required: true,
    },

    loading: {
      type: Object as PropType<LoadingMap>,
      default: () => {
        return {};
      },
    },

    cardsOutlined: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      personToRemove: null as string | null,
    };
  },

  methods: {
    submit(personId: string, role?: CalloutRole) {
      if (role != this.crew.find((item) => item.person === personId)?.role) {
        this.$emit("update:model-value", { person: personId, role });
      }
    },

    remove(personId: string) {
      this.personToRemove = personId;
    },

    cancelRemoval() {
      this.personToRemove = null;
    },

    confirmRemoval() {
      this.$emit("delete", this.personToRemove);
      this.personToRemove = null;
    },
  },
});
</script>
