export interface SharedState {
  ui: {
    busy: {
      createTimeEntry: boolean;
    };
  };
}

export const sharedInitialState: SharedState = {
  ui: {
    busy: {
      createTimeEntry: false,
    },
  },
};
