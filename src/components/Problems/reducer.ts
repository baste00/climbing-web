import { useEffect, useReducer } from "react";
import { neverGuard } from "../../utils/neverGuard";
import * as Sentry from "@sentry/react";
import { useGrades } from "../common/meta/meta";
import { itemLocalStorage } from "../../utils/use-local-storage";

export type State = {
  visible: boolean;
  gradeDifficultyLookup: Record<string, number>;
  totalAreas: number;
  totalSectors: number;
  totalProblems: number;
  unfilteredData: ProblemArea[];
} & {
  filterAreaIds: Record<number, true>;
  filterGradeLow: string | undefined;
  filterGradeHigh: string | undefined;
  filterTypes: Record<number, boolean> | undefined;
  filterPitches:
    | { "Single-pitch": boolean; "Multi-pitch": boolean }
    | undefined;
  filterHideTicked: boolean | undefined;
  filterOnlyAdmin: boolean | undefined;
  filterOnlySuperAdmin: boolean | undefined;
  filteredData: ProblemArea[];

  filteredAreas: number;
  filteredSectors: number;
  filteredProblems: number;
};

export type ResetField =
  | "all"
  | "areas"
  | "options"
  | "pitches"
  | "types"
  | "grades";

export type Update =
  | { action: "set-data"; data: ProblemArea[] }
  | {
      action: "toggle-pitches";
      option: keyof State["filterPitches"];
      checked: boolean;
    }
  | {
      action: "toggle-types";
      option: keyof State["filterTypes"];
      checked: boolean;
    }
  | { action: "toggle-area"; areaId: number; enabled: boolean }
  | {
      action: "set-grade-mapping";
      gradeDifficultyLookup: State["gradeDifficultyLookup"];
    }
  | { action: "set-grades"; low: string; high: string }
  | { action: "set-hide-ticked"; checked: boolean }
  | { action: "set-only-admin"; checked: boolean }
  | { action: "set-only-super-admin"; checked: boolean }
  | ({ action: "set-grade" } & ({ low: string } | { high: string }))
  | { action: "close-filter" }
  | { action: "open-filter" }
  | { action: "toggle-filter" }
  | { action: "reset"; section: ResetField };

const count = (data: ProblemArea[]): [number, number, number] => {
  return data.reduce(
    ([areas, sectors, problems], area) => [
      areas,
      sectors + area.sectors.length,
      problems +
        area.sectors.reduce((acc, sector) => sector.problems.length + acc, 0),
    ],
    [data.length, 0, 0],
  );
};

const filter = (state: State): State => {
  const {
    filterAreaIds,
    filterGradeHigh,
    filterGradeLow,
    filterHideTicked,
    filterOnlyAdmin,
    filterOnlySuperAdmin,
    filterPitches,
    filterTypes,
    gradeDifficultyLookup,
    totalAreas,
    totalProblems,
    totalSectors,
    unfilteredData,
  } = state;
  const filteredOut = {
    areas: 0,
    sectors: 0,
    problems: 0,
  };

  const filterAreaIdsCount = Object.keys(filterAreaIds).length;

  const transaction = Sentry.startTransaction({
    name: "filter-problems",
    data: { totalAreas, totalProblems, totalSectors },
  });
  const span = transaction.startChild();
  const filteredData = (unfilteredData ?? [])
    .map((problemArea) => {
      return {
        ...problemArea,
        sectors: problemArea.sectors
          .map((sector) => {
            return {
              ...sector,
              problems: sector.problems.filter((problem) => {
                if (filterAreaIdsCount > 0) {
                  if (!filterAreaIds[problemArea.id]) {
                    filteredOut.problems += 1;
                    return false;
                  }
                }

                if (filterHideTicked) {
                  if (problem.ticked) {
                    filteredOut.problems += 1;
                    return false;
                  }
                }

                if (
                  filterTypes &&
                  Object.values(filterTypes).some((v) => !!v)
                ) {
                  if (!filterTypes[problem.t.id]) {
                    filteredOut.problems += 1;
                    return false;
                  }
                }

                if (
                  filterPitches &&
                  (filterPitches["Multi-pitch"] ||
                    filterPitches["Single-pitch"])
                ) {
                  if (
                    !filterPitches["Multi-pitch"] &&
                    problem.numPitches >= 2
                  ) {
                    filteredOut.problems += 1;
                    return false;
                  }
                  if (
                    !filterPitches["Single-pitch"] &&
                    problem.numPitches <= 1
                  ) {
                    filteredOut.problems += 1;
                    return false;
                  }
                }

                if (filterGradeLow || filterGradeHigh) {
                  const low =
                    gradeDifficultyLookup[filterGradeLow] ??
                    Number.MIN_SAFE_INTEGER;
                  const high =
                    gradeDifficultyLookup[filterGradeHigh] ??
                    Number.MAX_SAFE_INTEGER;
                  const test = gradeDifficultyLookup[problem.grade];

                  if (test === undefined || test < low || test > high) {
                    filteredOut.problems += 1;
                    return false;
                  }
                }

                if (filterOnlySuperAdmin) {
                  const locked = problem.lockedSuperadmin;
                  if (!locked) {
                    filteredOut.problems += 1;
                    return false;
                  }
                }

                if (filterOnlyAdmin) {
                  const locked = problem.lockedAdmin;
                  if (!locked) {
                    filteredOut.problems += 1;
                    return false;
                  }
                }

                return true;
              }),
            };
          })
          .filter(({ lockedAdmin, lockedSuperadmin, problems }) => {
            if (
              problems.length === 0 ||
              (filterOnlyAdmin && !lockedAdmin) ||
              (filterOnlySuperAdmin && !lockedSuperadmin)
            ) {
              filteredOut.sectors += 1;
              return false;
            }
            return true;
          }),
      };
    })
    .filter(({ lockedAdmin, lockedSuperadmin, sectors, id }) => {
      if (
        sectors.length === 0 ||
        (filterOnlyAdmin && !lockedAdmin) ||
        (filterOnlySuperAdmin && !lockedSuperadmin) ||
        (filterAreaIdsCount && !filterAreaIds[id])
      ) {
        filteredOut.areas += 1;
        return false;
      }
      return true;
    });
  span.finish();
  transaction.finish();

  return {
    ...state,
    filteredData,
    filteredAreas: filteredOut.areas,
    filteredSectors: filteredOut.sectors,
    filteredProblems: filteredOut.problems,
  };
};

const reducer = (state: State, update: Update): State => {
  const { action } = update;
  switch (action) {
    case "set-data": {
      const { data } = update;
      const [totalAreas, totalSectors, totalProblems] = count(data);

      return {
        ...state,
        totalAreas,
        totalSectors,
        totalProblems,
        unfilteredData: data,
      };
    }

    case "toggle-pitches": {
      const { checked, option } = update;

      return {
        ...state,
        filterPitches: {
          ...state.filterPitches,
          [option]: checked,
        },
      };
    }

    case "toggle-types": {
      const { checked, option } = update;
      return {
        ...state,
        filterTypes: {
          ...state.filterTypes,
          [option]: checked,
        },
      };
    }

    case "toggle-area": {
      const { areaId, enabled } = update;
      if (enabled) {
        return {
          ...state,
          filterAreaIds: {
            ...state.filterAreaIds,
            [areaId]: true,
          },
        };
      }

      const filterAreaIds = {
        ...state.filterAreaIds,
      };
      delete filterAreaIds[areaId];

      return {
        ...state,
        filterAreaIds,
      };
    }

    case "set-grade-mapping": {
      const { gradeDifficultyLookup } = update;
      return {
        ...state,
        gradeDifficultyLookup,
      };
    }

    case "set-grades": {
      const { low, high } = update;
      return {
        ...state,
        filterGradeLow: low,
        filterGradeHigh: high,
      };
    }

    case "set-grade": {
      const low = "low" in update ? update.low : undefined;
      const high = "high" in update ? update.high : undefined;
      return {
        ...state,
        filterGradeLow: low ?? state.filterGradeLow ?? undefined,
        filterGradeHigh: high ?? state.filterGradeHigh ?? undefined,
      };
    }

    case "set-hide-ticked": {
      const { checked } = update;
      return {
        ...state,
        filterHideTicked: checked,
      };
    }

    case "set-only-admin": {
      const { checked } = update;
      return {
        ...state,
        filterOnlyAdmin: checked,
        filterOnlySuperAdmin: undefined,
      };
    }

    case "set-only-super-admin": {
      const { checked } = update;
      return {
        ...state,
        filterOnlyAdmin: undefined,
        filterOnlySuperAdmin: checked,
      };
    }

    case "reset": {
      const { section } = update;

      switch (section) {
        case "all": {
          return {
            ...state,
            filterGradeLow: undefined,
            filterGradeHigh: undefined,
            filterHideTicked: undefined,
            filterPitches: undefined,
            filterTypes: undefined,
            filterOnlyAdmin: undefined,
            filterOnlySuperAdmin: undefined,
          };
        }
        case "areas": {
          return {
            ...state,
            filterAreaIds: {},
          };
        }
        case "grades": {
          return {
            ...state,
            filterGradeLow: undefined,
            filterGradeHigh: undefined,
          };
        }
        case "options": {
          return {
            ...state,
            filterHideTicked: undefined,
            filterOnlyAdmin: undefined,
            filterOnlySuperAdmin: undefined,
          };
        }
        case "pitches": {
          return {
            ...state,
            filterPitches: undefined,
          };
        }
        case "types": {
          return {
            ...state,
            filterTypes: undefined,
          };
        }
        default: {
          return neverGuard(section, state);
        }
      }
    }

    case "close-filter": {
      return {
        ...state,
        visible: false,
      };
    }

    case "open-filter": {
      return {
        ...state,
        visible: true,
      };
    }

    case "toggle-filter": {
      return {
        ...state,
        visible: !state.visible,
      };
    }

    default: {
      return neverGuard(action, state);
    }
  }
};

const storageItems = {
  areaIds: itemLocalStorage("filter/area-ids", {}),
  gradeHigh: itemLocalStorage("filter/grades/high", undefined),
  gradeLow: itemLocalStorage("filter/grades/low", undefined),
  hideTicked: itemLocalStorage("filter/hide-ticked", false),
  onlyAdmin: itemLocalStorage("filter/only-admin", false),
  onlySuperAdmin: itemLocalStorage("filter/only-super-admin", false),
  pitches: itemLocalStorage("filter/pitches", undefined),
  types: itemLocalStorage("filter/types", undefined),
};

const wrappedReducer: typeof reducer = (state, update) => {
  const reduced = reducer(state, update);

  storageItems.areaIds.set(reduced.filterAreaIds);
  storageItems.gradeHigh.set(reduced.filterGradeHigh);
  storageItems.gradeLow.set(reduced.filterGradeLow);
  storageItems.hideTicked.set(reduced.filterHideTicked);
  storageItems.onlyAdmin.set(reduced.filterOnlyAdmin);
  storageItems.onlySuperAdmin.set(reduced.filterOnlySuperAdmin);
  storageItems.pitches.set(reduced.filterPitches);
  storageItems.types.set(reduced.filterTypes);

  return filter(reduced);
};

export const useFilterState = (init?: Partial<State>) => {
  const { mapping } = useGrades();

  const [state, dispatch] = useReducer(wrappedReducer, {
    visible: false,
    gradeDifficultyLookup: {},
    totalAreas: 0,
    totalSectors: 0,
    totalProblems: 0,
    unfilteredData: [],

    // Information about the filters
    filterAreaIds: storageItems.areaIds.get(),
    filterGradeHigh: storageItems.gradeHigh.get(),
    filterGradeLow: storageItems.gradeLow.get(),
    filterHideTicked: storageItems.hideTicked.get(),
    filterOnlyAdmin: storageItems.onlyAdmin.get(),
    filterOnlySuperAdmin: storageItems.onlySuperAdmin.get(),
    filterPitches: storageItems.pitches.get(),
    filterTypes: storageItems.types.get(),

    // Filtered data
    filteredData: [],
    filteredAreas: 0,
    filteredSectors: 0,
    filteredProblems: 0,

    // Customizations
    ...init,
  });

  useEffect(() => {
    dispatch({ action: "set-grade-mapping", gradeDifficultyLookup: mapping });
  }, [mapping]);

  return [state, dispatch] as const;
};
