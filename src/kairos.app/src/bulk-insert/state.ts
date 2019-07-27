export interface BulkInsertState {
  ui: {
    busy: {
      bulkTimeEntriesInsert: boolean;
    };
  };
}

export const bulkInsertStateInitialState: BulkInsertState = {
  ui: {
    busy: {
      bulkTimeEntriesInsert: false,
    },
  },
};
