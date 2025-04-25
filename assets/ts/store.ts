import { combineReducers, configureStore } from '@reduxjs/toolkit';

import configReducer from './config/slice';
import friendsReducer from './friends/slice';
import mapReducer from './map/slice';
import notificationsReducer from './notifications/slice';

const rootReducer = combineReducers({
    config: configReducer,
    friends: friendsReducer,
    notifications: notificationsReducer,
    map: mapReducer,
});

export const setupStore = (preloadedState?: Partial<RootState>) => configureStore({
    reducer: rootReducer,
    preloadedState,
});

export type AppStore = ReturnType<typeof setupStore>;

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = AppStore['dispatch'];
