export interface ExportState {
  ui: {
    busy: {
      exportTimeEntries: boolean;
      exportTimeAbsenceEntries: boolean;
    };
  };
}

export const exportStateInitialState: ExportState = {
  ui: {
    busy: {
      exportTimeEntries: false,
      exportTimeAbsenceEntries: false,
    },
  },
};
