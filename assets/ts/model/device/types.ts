import { LatLng } from 'leaflet';

export enum DeviceActionType {
    ACTIVATE_DEVICE = 'device/ACTIVATE_DEVICE',
    FETCH_DEVICES = 'device/FETCH_DEVICES',
    FETCH_CAMERAS = 'device/FETCH_CAMERAS',
    FETCH_LOCATIONS = 'device/FETCH_LOCATIONS',
    SET_MARKER_POSITION = 'device/SET_MARKER_POSITION',
    SET_POLYGONS = 'device/SET_POLYGONS',
}

export interface Location {
    id: number;
}

export interface Camera {
    id: number;
    description: string;
    location: LatLng;
}

export interface Device {
    active: boolean;
    id: number;
    locations: {[key: string]: Location};
    macAddress: string;
}

export interface DeviceState {
    cameras: {[key: string]: Camera};
    devices: {[key: string]: Device};
    polygons: LatLng[][][];
    speedLimit: {
        description?: string;
        polygons: LatLng[][][];
        position?: LatLng;
        speedLimit?: number;
    };
}
