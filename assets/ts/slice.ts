import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { LatLng, LatLngBounds } from 'leaflet';

import { AppDispatch, RootState } from './store';

export interface Feature {
    coordinates: number[];
    id: number;
    speedLimit?: {
        description: string;
        speedLimit: number;
    };
    timestamp: number;
    velocity: number;
};

export interface Device {
    description: string;
    id: number;
    name: string;
}

export interface OkRoadState {
    bounds?: [[number, number], [number, number]];
    devices: Device[];
    features: Feature[];
    fromDate: number;
    highlightedLocation?: number;
    selectedDevice?: number;
    showRecent: boolean;
    toDate: number;
    user: {
        fullName: string;
        username: string;
    }
    value: number;
}

const initialState: OkRoadState = {
    bounds: undefined,
    devices: [],
    features: [],
    fromDate: Date.now() - (60 * 60 * 24 * 1000),
    highlightedLocation: undefined,
    selectedDevice: undefined,
    showRecent: true,
    toDate: Date.now(),
    user: {
        fullName: '',
        username: '',
    },
    value: 0,
}

export const fetchDevices = createAsyncThunk<{
    description: string;
    id: number;
    name: string;
}[], void, {state: RootState}>(
    'okroad/fetchDevicesStatus',
    async () => {
        const url = '/api/devices';
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${url}`);
        }
        return await response.json();
    },
);

export const fetchLocations = createAsyncThunk<{
    id: number;
    location: {
        x: number;
        y: number;
    };
    speed?: number;
    speed_limit?: {
        description: string;
        speed_limit: number;
    };
    timestamp: number;
}[], void, {state: RootState}>(
    'okroad/fetchLocationsStatus',
    async (_, { getState }) => {
        let fromDate: number;
        let toDate: number;
        if (getState().okRoad.showRecent) {
            fromDate = Date.now() - (60 * 60 * 24 * 1000);
            toDate = Date.now();
        } else {
            fromDate = getState().okRoad.fromDate;
            toDate = getState().okRoad.toDate;
        }

        const response = await fetch(`/api/locations?device=a14&from=${(new Date(fromDate)).toISOString()}&to=${(new Date(toDate)).toISOString()}`);
        if (!response.ok) {
            throw new Error('Failed to fetch');
        }
        return await response.json();
    },
);

export const okRoadSlice = createSlice({
    name: 'okRoad',
    initialState,
    reducers: {
        highlightLocation: (state, action: PayloadAction<number | undefined>) => {
            state.highlightedLocation = action.payload;
        },
        setFromDate: (state, action: PayloadAction<number>) => {
            state.fromDate = action.payload;  
        },
        setShowRecent: (state, action: PayloadAction<boolean>) => {
            state.showRecent = action.payload;
        },
        setToDate: (state, action: PayloadAction<number>) => {
            state.toDate = action.payload;
        },
        setUser: (state, action: PayloadAction<{fullName: string}>) => {
            state.user.fullName = action.payload.fullName;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchDevices.fulfilled, (state, action) => {
            state.devices = action.payload;
        });
        builder.addCase(fetchLocations.fulfilled, (state, action) => {
            let bounds: LatLngBounds | undefined;
            state.features = [];
            action.payload.forEach((feature) => {
                const point = new LatLng(feature.location.y, feature.location.x);
                if (!bounds) {
                    bounds = new LatLngBounds(point, point);
                } else {
                    bounds.extend(point);
                }
                let speedLimit;
                if (feature.speed_limit) {
                    speedLimit = {
                        description: feature.speed_limit.description,
                        speedLimit: feature.speed_limit.speed_limit,
                    };
                }
                state.features.push({
                    coordinates: [feature.location.x, feature.location.y],
                    id: feature.id,
                    speedLimit,
                    timestamp: feature.timestamp,
                    velocity: feature.speed || 0,
                });
            });
            if (bounds) {
                state.bounds = [
                    [bounds.getSouthWest().lat, bounds.getSouthWest().lng],
                    [bounds.getNorthEast().lat, bounds.getNorthEast().lng],
                ];
            }
        });
    },
});

export const setFromDate = (fromDate: number) => (dispatch: AppDispatch) => {
    dispatch(okRoadSlice.actions.setFromDate(fromDate));
    dispatch(fetchLocations());
};

export const setToDate = (toDate: number) => (dispatch: AppDispatch) => {
    dispatch(okRoadSlice.actions.setToDate(toDate));
    dispatch(fetchLocations());  
};

export const setShowRecent = (showRecent: boolean) => (dispatch: AppDispatch) => {
    dispatch(okRoadSlice.actions.setShowRecent(showRecent));
    dispatch(fetchLocations());  
};

export const { highlightLocation, setUser } = okRoadSlice.actions;

export default okRoadSlice.reducer;
