import { configureStore } from '@reduxjs/toolkit';

import friendsReducer from './friends/slice';
import okRoadReducer from './slice';

export const store = configureStore({
    reducer: {
        friends: friendsReducer,
        okRoad: okRoadReducer,
    },
});

export type AppStore = typeof store;

export type RootState = ReturnType<AppStore['getState']>;

export type AppDispatch = AppStore['dispatch'];
