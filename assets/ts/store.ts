import { configureStore } from '@reduxjs/toolkit';

import configReducer from './config/slice';
import friendsReducer from './friends/slice';
import okRoadReducer from './map/slice';

export const store = configureStore({
    reducer: {
        config: configReducer,
        friends: friendsReducer,
        okRoad: okRoadReducer,
    },
});

export type AppStore = typeof store;

export type RootState = ReturnType<AppStore['getState']>;

export type AppDispatch = AppStore['dispatch'];
