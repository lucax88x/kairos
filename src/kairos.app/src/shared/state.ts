export interface SharedState {
  ui: {
    busy: {
      createTimeEntry: boolean;
      deleteTimeEntry: boolean;
      createTimeAbsenceEntry: boolean;
      deleteTimeAbsenceEntry: boolean;
    };
  };
}

export const sharedInitialState: SharedState = {
  ui: {
    busy: {
      createTimeEntry: false,
      deleteTimeEntry: false,
      createTimeAbsenceEntry: false,
      deleteTimeAbsenceEntry: false,
    },
  },
};
