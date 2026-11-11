import { describe, expect, it, vi } from "vitest";
import { utils } from "xlsx";
import { exportUebungsliste } from "@/modules/exporter/services/exportService";
import storage from "@/modules/exporter/utils/storage";

vi.mock("@/modules/exporter/utils/storage", () => ({
  default: {
    getUebungen: vi.fn(),
  },
}));

describe("modules/exporter/services/exportService", () => {
  it("creates a workbook with an overview sheet and a group sheet", async () => {
    vi.mocked(storage.getUebungen).mockResolvedValue([
      {
        id: "training-1",
        creationTime: 1735689600,
        startTime: 1735689600,
        endTime: 1735693200,
        title: "Übung Brandbekämpfung",
        participants: {
          p1: { name: "Anna Muster", group: "Gruppe A" },
          p2: { name: "Ben Beispiel", group: "Gruppe A" },
        },
      },
    ]);

    const workbook = await exportUebungsliste();

    expect(workbook.SheetNames).toEqual(["Übersicht", "Alle", "Gruppe A"]);

    const overviewRows = utils.sheet_to_json<any[]>(
      workbook.Sheets["Übersicht"],
      {
        header: 1,
        raw: false,
      }
    );

    expect(overviewRows[0]).toEqual([
      "Datum",
      "Thema",
      "Dauer (Minuten)",
      "Gruppe A",
    ]);
    expect(overviewRows[1][1]).toBe("Übung Brandbekämpfung");
    expect(Number(overviewRows[1][3])).toBe(2);

    const groupRows = utils.sheet_to_json<any[]>(workbook.Sheets["Gruppe A"], {
      header: 1,
      raw: false,
    });

    expect(groupRows[0][0]).toBe("");
    expect(groupRows[1][0]).toBe("Anna Muster");
  });

  it("keeps a responsible person in the lone group instead of the missing-group bucket", async () => {
    vi.mocked(storage.getUebungen).mockResolvedValue([
      {
        id: "training-2",
        creationTime: 1735689600,
        startTime: 1735689600,
        endTime: 1735693200,
        title: "Übung Einsatzvorbereitung",
        groups: ["Gruppe A"],
        responsiblePeople: ["Anna Muster"],
        participants: {},
      },
    ]);

    const workbook = await exportUebungsliste();

    expect(workbook.SheetNames).toEqual(["Übersicht", "Alle", "Gruppe A"]);

    const groupRows = utils.sheet_to_json<any[]>(workbook.Sheets["Gruppe A"], {
      header: 1,
      raw: false,
    });

    expect(groupRows[0]).toEqual(["", "01.01."]);
    expect(groupRows[1][0]).toBe("Anna Muster");
    expect(Number(groupRows[1][1])).toBe(1);

    const missingGroupSheet = workbook.Sheets["Fehlende Gruppe"];
    expect(missingGroupSheet).toBeUndefined();
  });

  it("places a responsible person under the missing-group bucket when there are multiple groups", async () => {
    vi.mocked(storage.getUebungen).mockResolvedValue([
      {
        id: "training-3",
        creationTime: 1735689600,
        startTime: 1735689600,
        endTime: 1735693200,
        title: "Übung Gruppenwechsel",
        groups: ["Gruppe A", "Gruppe B"],
        responsiblePeople: ["Anna Muster"],
        participants: {},
      },
    ]);

    const workbook = await exportUebungsliste();

    expect(workbook.SheetNames).toEqual([
      "Übersicht",
      "Alle",
      "Fehlende Gruppe",
    ]);

    const missingGroupRows = utils.sheet_to_json<any[]>(
      workbook.Sheets["Fehlende Gruppe"],
      {
        header: 1,
        raw: false,
      }
    );

    expect(missingGroupRows[0]).toEqual(["", "01.01."]);
    expect(missingGroupRows[1][0]).toBe("Anna Muster");
    expect(Number(missingGroupRows[1][1])).toBe(1);
  });

  it("deduplicates a responsible person who is also a participant in the same group", async () => {
    vi.mocked(storage.getUebungen).mockResolvedValue([
      {
        id: "training-4",
        creationTime: 1735689600,
        startTime: 1735689600,
        endTime: 1735693200,
        title: "Übung Deduplizierung",
        groups: ["Gruppe A"],
        responsiblePeople: ["Anna Muster"],
        participants: {
          p1: { name: "Anna Muster", group: "Gruppe A" },
        },
      },
    ]);

    const workbook = await exportUebungsliste();

    const groupRows = utils.sheet_to_json<any[]>(workbook.Sheets["Gruppe A"], {
      header: 1,
      raw: false,
    });

    expect(groupRows[0]).toEqual(["", "01.01."]);
    expect(groupRows[1][0]).toBe("Anna Muster");
    expect(Number(groupRows[1][1])).toBe(1);
  });
});
