import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface ConfigState {
    map: {
        center: {
            lat: number;
            lng: number;
        };
        zoom: number;
    };
    maxResults: number;
    speedLimitTilesUrl?: string;
}

const initialState: ConfigState = {
    map: {
        center: {
            lat: -41,
            lng: 174,
        },
        zoom: 5,
    },
    maxResults: 1000,
    speedLimitTilesUrl: undefined,
};

export const configSlice = createSlice({
    name: 'config',
    initialState,
    reducers: {
        setConfig: (state, action: PayloadAction<ConfigState>) => {
            state.map = action.payload.map;
            state.maxResults = action.payload.maxResults;
            state.speedLimitTilesUrl = action.payload.speedLimitTilesUrl;
        },
    },
});

export const { setConfig } = configSlice.actions;

export default configSlice.reducer;
