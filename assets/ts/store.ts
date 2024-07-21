import { configureStore } from '@reduxjs/toolkit';

import okRoadReducer from './slice';

export const store = configureStore({
    reducer: {
        okRoad: okRoadReducer,
    },
});

export type AppStore = typeof store;

// export type RootState = ReturnType<typeof store.getState>;
export type RootState = ReturnType<AppStore['getState']>;

export type AppDispatch = AppStore['dispatch'];