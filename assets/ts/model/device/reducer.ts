import { produce } from 'immer';
import { LatLng } from 'leaflet';

import { DeviceActionType, DeviceState } from './types';

const initialState = {
    cameras: {},
    devices: {},
    // markerPosition: undefined,
    polygons: [],
    speedLimit: {
        description: undefined,
        polygons: [],
        position: new LatLng(-40, 174),
        speedLimit: undefined,
    }
};

export default function (state: DeviceState = initialState, action: any) {
    switch (action.type) {
        case DeviceActionType.FETCH_CAMERAS: {
            const cameras: any = {};
            action.payload.cameras.forEach((camera: any) => {
                cameras[camera.id] = {
                    description: camera.description,
                    id: camera.id,
                    location: new LatLng(camera.location.y, camera.location.x),
                };
            });
            return produce(state, (draft) => {
                draft.cameras = cameras;
            });
        }
        case DeviceActionType.FETCH_DEVICES: {
            const devices: any = {};
            action.payload.devices.forEach((device: any) => {
                devices[device.id] = device;
            });
            return produce(state, (draft) => {
                action.payload.devices.forEach((device: any) => {
                    draft.devices[device.id] = draft.devices[device.id] || {
                        active: false,
                        locations: {},
                    };
                    draft.devices[device.id].id = device.id;
                    draft.devices[device.id].macAddress = device.mac_address;
                });
            });
        }
        case DeviceActionType.FETCH_LOCATIONS: {
            return produce(state, (draft) => {
                if (draft.devices.hasOwnProperty(action.payload.device.id)) {
                    const locations: any = {};
                    action.payload.locations.forEach((location: any) => {
                        locations[location.id] = {
                            id: location.id,
                            location: new LatLng(location.location.y, location.location.x),
                            speed: location.speed,
                        };
                    });
                    draft.devices[action.payload.device.id].locations = locations;
                }
            });
        }
        case DeviceActionType.ACTIVATE_DEVICE: {
            return produce(state, (draft) => {
                if (draft.devices.hasOwnProperty(action.payload.device.id)) {
                    draft.devices[action.payload.device.id].active = action.payload.active;
                }              
            });
        }
        case DeviceActionType.SET_POLYGONS: {
            return produce(state, (draft) => {
                draft.speedLimit.description = action.payload.description;
                draft.speedLimit.polygons = action.payload.polygons;
                draft.speedLimit.speedLimit = action.payload.speedLimit;
            });
        }
        case DeviceActionType.SET_MARKER_POSITION: {
            return produce(state, (draft) => {
                draft.speedLimit.position = action.payload.position;
            });
        }
    }
    return state;
}