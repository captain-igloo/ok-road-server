import { LatLng } from 'leaflet';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { Device } from '../device/types';

export interface State {

}

export type Dispatch = ThunkDispatch<State, undefined, Action>;

export interface Actions {
    activateDevice: (device: Device, active: boolean) => void;
    fetchDevices: () => void;
    fetchLocations: (device: Device) => void;
    setMarkerPosition: (position: LatLng) => void;
}
