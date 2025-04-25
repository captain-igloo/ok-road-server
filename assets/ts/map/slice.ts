import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { LatLng, LatLngBounds } from 'leaflet';

import { addNotification } from '../notifications/slice';
import type { AppDispatch, RootState } from '../store';

export interface Feature {
    coordinates: number[];
    id: number;
    insertTimestamp: number;
    speedLimit?: {
        description: string;
        speedLimit: number;
    };
    timestamp: number;
    velocity: number;
}

export interface Device {
    description: string;
    id: number;
    name: string;
    username: string;
}

export interface User {
    fullName: string;
    username: string;
}

export interface Tooltip {
    position?: {
        lat: number;
        lng: number;
    };
    text: string[];
}

export interface MapState {
    bounds?: [[number, number], [number, number]];
    devices: Device[];
    features: Feature[];
    fromDate: number;
    highlightedLocation?: number;
    last24Hours: boolean;
    notificationCount: number;
    notifications: { [key: string]: string };
    refreshInProgress: boolean;
    selectedDevice?: number;
    showSpeedLimitAreas: boolean;
    toDate: number;
    tooltip: Tooltip;
    user: User;
}

const initialState: MapState = {
    bounds: undefined,
    devices: [],
    features: [],
    fromDate: Date.now() - (60 * 60 * 24 * 1000),
    highlightedLocation: undefined,
    last24Hours: true,
    notificationCount: 0,
    notifications: {},
    refreshInProgress: false,
    selectedDevice: undefined,
    showSpeedLimitAreas: false,
    toDate: Date.now(),
    tooltip: {
        position: undefined,
        text: [],
    },
    user: {
        fullName: '',
        username: '',
    },
};

export const fetchDevices = createAsyncThunk<
Device[],
void,
{
    dispatch: AppDispatch;
    state: RootState;
}>(
    'map/fetchDevicesStatus',
    async (_, { dispatch }) => {
        const url = '/api/devices';
        const response = await fetch(url);
        if (!response.ok) {
            dispatch(addNotification('Failed to fetch devices'));
            throw new Error(`Failed to fetch: ${url}`);
        }
        return response.json();
    },
);

export const fetchLocations = createAsyncThunk<{
    id: number;
    insert_timestamp: number;
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
}[], void, { dispatch: AppDispatch; state: RootState }>(
    'map/fetchLocationsStatus',
    async (_, { dispatch, getState }) => {
        const { fromDate } = getState().map;
        const { toDate } = getState().map;
        const { selectedDevice } = getState().map;
        if (selectedDevice) {
            dispatch(mapSlice.actions.setRefreshInProgress(true));
            const url = `/api/locations?device=${selectedDevice}`
                + `&from=${(new Date(fromDate)).toISOString()}&to=${(new Date(toDate)).toISOString()}`;
            const response = await fetch(url, {
                redirect: 'manual',
            });
            dispatch(mapSlice.actions.setRefreshInProgress(false));
            if (!response.ok) {
                dispatch(addNotification('Failed to fetch locations'));
                throw new Error(`Failed to fetch ${url}`);
            }
            const features = await response.json();
            if (features.length >= getState().config.maxResults) {
                dispatch(addNotification(`Results have been limited to ${getState().config.maxResults}`));
            }
            return features;
        }
        return [];
    },
);

export const mapSlice = createSlice({
    name: 'map',
    initialState,
    reducers: {
        highlightLocation: (state, action: PayloadAction<number | undefined>) => {
            state.highlightedLocation = action.payload;
        },
        setRefreshInProgress: (state, action: PayloadAction<boolean>) => {
            state.refreshInProgress = action.payload;
        },
        selectDevice: (state, action: PayloadAction<number>) => {
            state.selectedDevice = action.payload;
        },
        setFromDate: (state, action: PayloadAction<number>) => {
            state.fromDate = action.payload;
        },
        setLast24Hours: (state, action: PayloadAction<boolean>) => {
            state.last24Hours = action.payload;
        },
        setShowSpeedLimitAreas: (state, action: PayloadAction<boolean>) => {
            state.showSpeedLimitAreas = action.payload;
        },
        setToDate: (state, action: PayloadAction<number>) => {
            state.toDate = action.payload;
        },
        setTooltip: (state, action: PayloadAction<{ position?: { lat: number; lng: number }; text: string[] }>) => {
            state.tooltip = action.payload;
        },
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchDevices.fulfilled, (state, action) => {
            state.devices = action.payload;
            if (action.payload.length > 0) {
                state.selectedDevice = action.payload[0].id;
            }
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
                    insertTimestamp: feature.insert_timestamp,
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

let refreshTimeout: NodeJS.Timeout;

export const scheduleRefresh = () => (dispatch: AppDispatch) => {
    clearTimeout(refreshTimeout);
    refreshTimeout = setTimeout(() => {
        dispatch(mapSlice.actions.setFromDate(Date.now() - (60 * 60 * 24 * 1000)));
        dispatch(mapSlice.actions.setToDate(Date.now()));
        dispatch(fetchLocations());
        dispatch(scheduleRefresh());
    }, 300000);
};

export const setFromDate = (fromDate: number) => (dispatch: AppDispatch) => {
    dispatch(mapSlice.actions.setFromDate(fromDate));
    dispatch(fetchLocations());
};

export const setToDate = (toDate: number) => (dispatch: AppDispatch) => {
    dispatch(mapSlice.actions.setToDate(toDate));
    dispatch(fetchLocations());
};

export const selectDevice = (deviceId: number) => (dispatch: AppDispatch) => {
    dispatch(mapSlice.actions.selectDevice(deviceId));
    dispatch(fetchLocations());
};

export const setLast24Hours = (last24Hours: boolean) => (dispatch: AppDispatch) => {
    dispatch(mapSlice.actions.setLast24Hours(last24Hours));
    if (last24Hours) {
        dispatch(scheduleRefresh());
    } else {
        clearTimeout(refreshTimeout);
    }
};

export const setShowSpeedLimitAreas = (showSpeedLimitAreas: boolean) => (dispatch: AppDispatch) => {
    if (!showSpeedLimitAreas) {
        dispatch(mapSlice.actions.setTooltip({ position: undefined, text: [] }));
    }
    dispatch(mapSlice.actions.setShowSpeedLimitAreas(showSpeedLimitAreas));
};

export const {
    highlightLocation,
    setTooltip,
    setUser,
} = mapSlice.actions;

export default mapSlice.reducer;
