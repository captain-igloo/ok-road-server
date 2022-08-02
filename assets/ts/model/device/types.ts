import { OrderedMap, Record } from 'immutable';

export enum DeviceActionType {
    FETCH_DEVICES = 'device/FETCH_DEVICES',
    FETCH_LOCATIONS = 'device/FETCH_LOCATIONS',
}

export interface LocationProps {
    // accuracy: number;
    id: number;
    location: any;
    speed: number;
}

export const Location = Record<LocationProps>({
    // accuracty: 0,
    id: 0,
    location: undefined,
    speed: 0,
});

export interface DeviceProps {
    id: number;
    locations: OrderedMap<number, Record<LocationProps>>;
    macAddress: string;
}

export const Device = Record<DeviceProps>({
    id: 0,
    locations: OrderedMap(),
    macAddress: '',
});

export interface DeviceStateProps {
    devices: OrderedMap<number, Record<DeviceProps>>;
}

export const DeviceState = Record<DeviceStateProps>({
    devices: OrderedMap(),
});
