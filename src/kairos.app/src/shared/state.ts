export interface SharedState {
  ui: {
    busy: {
      createTimeEntry: boolean;
      deleteTimeEntry: boolean;
    };
  };
}

export const sharedInitialState: SharedState = {
  ui: {
    busy: {
      createTimeEntry: false,
      deleteTimeEntry: false,
    },
  },
};
