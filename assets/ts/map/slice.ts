import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import debounce from 'debounce';
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
    text: {
        [key: string]: string[];
    };
}

export interface MapState {
    bounds?: [[number, number], [number, number]];
    devices: Device[];
    features: {[key: string]: Feature};
    fromDate: number;
    highlightedLocations: number[];
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
    features: {},
    fromDate: 0,
    highlightedLocations: [],
    notificationCount: 0,
    notifications: {},
    refreshInProgress: false,
    selectedDevice: undefined,
    showSpeedLimitAreas: false,
    toDate: 0,
    tooltip: {
        position: undefined,
        text: {},
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
    async (_, { dispatch, getState }) => {
        let url = '/api/devices';
        if (getState().config.demo) {
            url += '?demo=true';
        }
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
            let url = `/api/locations?device=${selectedDevice}`
                + `&from=${(new Date(fromDate)).toISOString()}&to=${(new Date(toDate)).toISOString()}`;
            if (getState().config.demo) {
                url += '&demo=true';
            }
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
        highlightLocations: (state, action: PayloadAction<number[]>) => {
            state.highlightedLocations = action.payload;
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
        setShowSpeedLimitAreas: (state, action: PayloadAction<boolean>) => {
            state.showSpeedLimitAreas = action.payload;
        },
        setToDate: (state, action: PayloadAction<number>) => {
            state.toDate = action.payload;
        },
        setTooltip: (state, action: PayloadAction<Partial<Tooltip>>) => {
            if (action.payload.position !== undefined) {
                state.tooltip.position = action.payload.position;
            }
            if (action.payload.text !== undefined) {
                Object.keys(action.payload.text).forEach((key) => {
                    state.tooltip.text[key] = (action.payload as any).text[key];
                });
            }
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
            state.features = {};
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
                state.features[`_${feature.id}`] = {
                    coordinates: [feature.location.x, feature.location.y],
                    id: feature.id,
                    insertTimestamp: feature.insert_timestamp,
                    speedLimit,
                    timestamp: feature.timestamp,
                    velocity: feature.speed || 0,
                };
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

const debouncedFetchLocations = debounce((dispatch: AppDispatch) => {
    dispatch(fetchLocations());
}, 200);

export const scheduleFetchLocations = () => debouncedFetchLocations;

let refreshTimeout: NodeJS.Timeout;

export const scheduleRefresh = () => (dispatch: AppDispatch) => {
    clearTimeout(refreshTimeout);
    refreshTimeout = setTimeout(() => {
        dispatch(fetchLocations());
        dispatch(scheduleRefresh());
    }, 300000);
};

export const setFromDate = (fromDate: number) => (dispatch: AppDispatch) => {
    dispatch(mapSlice.actions.setFromDate(fromDate));
    dispatch(scheduleFetchLocations());
};

export const setToDate = (toDate: number) => (dispatch: AppDispatch) => {
    dispatch(mapSlice.actions.setToDate(toDate));
    dispatch(scheduleFetchLocations());
};

const setDates = (date: Date) => (dispatch: AppDispatch) => {
    date.setHours(0, 0, 0, 0);
    dispatch(setFromDate(date.getTime()));
    date.setHours(23, 59, 59, 0);
    dispatch(setToDate(date.getTime()));
}


export const decrementDate = () => (dispatch: AppDispatch, getState: any) => {
    dispatch(setDates(new Date(getState().map.fromDate - 86400000)));
};

export const incrementDate = () => (dispatch: AppDispatch, getState: any) => {
    dispatch(setDates(new Date(getState().map.fromDate + 86400000)));
};

export const selectDevice = (deviceId: number) => (dispatch: AppDispatch) => {
    dispatch(mapSlice.actions.selectDevice(deviceId));
    dispatch(fetchLocations());
};

export const setShowSpeedLimitAreas = (showSpeedLimitAreas: boolean) => (dispatch: AppDispatch) => {
    dispatch(mapSlice.actions.setShowSpeedLimitAreas(showSpeedLimitAreas));
};

export const {
    highlightLocations,
    setTooltip,
    setUser,
} = mapSlice.actions;

export default mapSlice.reducer;
