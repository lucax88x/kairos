export interface BulkInsertState {
  ui: {
    busy: {
      bulkTimeEntriesInsert: boolean;
      bulkTimeAbsenceEntriesInsert: boolean;
      bulkTimeHolidayEntriesInsert: boolean;
    };
  };
}

export const bulkInsertStateInitialState: BulkInsertState = {
  ui: {
    busy: {
      bulkTimeEntriesInsert: false,
      bulkTimeAbsenceEntriesInsert: false,
      bulkTimeHolidayEntriesInsert: false,
    },
  },
};
