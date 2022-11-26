import { Callout } from "@/modules/callout/models/Callout";
import { Vehicle } from "@/modules/vehicles/models/Vehicle";
import { formatDateTime, formatDateWithoutYear } from "@/utils/dates";

export class CalloutFormatter {
  private einsatz: Callout;

  constructor(einsatz: Callout) {
    this.einsatz = einsatz;
  }

  getDatum(): string {
    return formatDateWithoutYear(this.einsatz.alarmTime);
  }

  getBeginn(): string {
    return formatDateTime(this.einsatz.alarmTime);
  }

  getEnde(): string {
    return this.einsatz.vehicles
      ? formatDateTime(
          Math.max(
            ...Object.values(this.einsatz.vehicles).map((fahrzeugImEinsatz) =>
              Number(fahrzeugImEinsatz.endTime)
            )
          )
        )
      : "";
  }

  getEndeOfFahrzeug(fahrzeug: Vehicle): string {
    return this.einsatz.vehicles && this.einsatz.vehicles[fahrzeug.id]
      ? formatDateTime(Number(this.einsatz.vehicles[fahrzeug.id].endTime))
      : "";
  }
}
