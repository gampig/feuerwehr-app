import moment from "moment";
import { LocalData } from "../models/LocalData";

export class LocalDataService<DataType> {
  ref: string;
  private localData?: LocalData<DataType>;

  constructor(ref: string) {
    this.ref = ref;
  }

  get(): DataType | null {
    const rawData = localStorage.getItem(this.ref);

    if (rawData === null) {
      return null;
    }

    const localData = JSON.parse(rawData);

    if (localData.lastDownload) {
      this.localData = localData;
    }

    return localData.data || null;
  }

  set(data: DataType): void {
    const localData: LocalData<DataType> = {
      lastDownload: moment().unix(),
      data,
    };
    localStorage.setItem(this.ref, JSON.stringify(localData));
    this.localData = localData;
  }

  delete() {
    localStorage.removeItem(this.ref);
  }

  updateRequired(maxAge: number): boolean {
    if (this.localData) {
      if (this.localData.lastDownload + maxAge > moment().unix()) {
        return true;
      }
    } else {
      throw Error(
        "Konnte nicht auf Updates für Daten prüfen (" + this.ref + ")"
      );
    }

    return false;
  }
}
