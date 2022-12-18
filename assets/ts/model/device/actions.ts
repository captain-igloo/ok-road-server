import { LatLng, Polygon } from 'leaflet';

import * as api from './api';
import { Dispatch } from '../app/types';
import { Device, DeviceActionType } from './types';

export const fetchDevices = () => async (dispatch: Dispatch) => {
    const devices = await api.fetchDevices();
    dispatch({
        payload: {
            devices,
        },
        type: DeviceActionType.FETCH_DEVICES,
    });
};

export const fetchLocations = (device: Device) => async (dispatch: Dispatch) => {
    const locations = await api.fetchLocations(device.id);
    dispatch({
        payload: {
            device,
            locations,
        },
        type: DeviceActionType.FETCH_LOCATIONS,
    });
};

export const fetchCameras = () => async (dispatch: Dispatch) => {
    const cameras = await api.fetchCameras();
    dispatch({
        payload: {
            cameras,
        },
        type: DeviceActionType.FETCH_CAMERAS,
    });
};

export const activateDevice = (device: Device, active: boolean) => (dispatch: Dispatch) => {
    dispatch({
        payload: {
            active,
            device,
        },
        type: DeviceActionType.ACTIVATE_DEVICE,
    });
    if (active) {
        dispatch(fetchLocations(device));
    } else {
        dispatch({
            payload: {
                device,
                locations: [],
            },
            type: DeviceActionType.FETCH_LOCATIONS,
        });
    }
};

export const setMarkerPosition = (position: LatLng) => async (dispatch: Dispatch) => {
    dispatch({
        payload: {
            position,
        },
        type: DeviceActionType.SET_MARKER_POSITION,
    });
    let description;
    let polygon = [];
    let speedLimit;
    try {
        const speedLimitInfo = await api.fetchSpeedLimit(position);
        description = speedLimitInfo.description;
        polygon = speedLimitInfo.area.rings.map((ring: any) => {
            return ring.map((point: any) => {
                return new LatLng(point[1], point[0]);
            });
        });
        speedLimit = speedLimitInfo.speed_limit;
    } catch (e) {
    }
    dispatch({
        payload: {
            description,
            polygons: [polygon],
            speedLimit,
        },
        type: DeviceActionType.SET_POLYGONS,
    });
};
