import { Record } from 'immutable';

import * as api from './api';
import { Dispatch } from '../app/types';
import { DeviceActionType, DeviceProps } from './types';

export const fetchDevices = () => async (dispatch: Dispatch) => {
    const devices = await api.fetchDevices();
    dispatch({
        payload: {
            devices,
        },
        type: DeviceActionType.FETCH_DEVICES,
    });
};

export const fetchLocations = (device: Record<DeviceProps>) => async (dispatch: Dispatch) => {
    const locations = await api.fetchLocations(device.get('id'));
    console.log('locations', locations);
    dispatch({
        payload: {
            device,
            locations,
        },
        type: DeviceActionType.FETCH_LOCATIONS,
    });
};
