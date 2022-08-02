import { OrderedMap } from 'immutable';
import { LatLng } from 'leaflet';

import { Device, DeviceActionType, DeviceState, Location } from './types';

export default function (state = new DeviceState(), action: any) {
    switch (action.type) {
        case DeviceActionType.FETCH_DEVICES: {
            console.log('action.payload.devices', action.payload.devices);
            return state.set('devices', OrderedMap(action.payload.devices.map((device: any) => {
                return [device.id, new Device({
                    id: device.id,
                    macAddress: device.mac_address,
                })];
            })));
            // return state.set('devices', action.payload.devices);
        }
        case DeviceActionType.FETCH_LOCATIONS: {
            const locations = action.payload.locations.map((location: any) => {
                return [location.id, new Location({
                    id: location.id,
                    location: new LatLng(location.location.y, location.location.x),
                    speed: location.speed,
                })];
            });
            return state.setIn(['devices', action.payload.device.get('id'), 'locations'], OrderedMap(locations));
        }
    }
    return state;
}