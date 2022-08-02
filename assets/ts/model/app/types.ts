import { Record } from 'immutable';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { DeviceProps } from '../device/types';

export interface State {

}

export type Dispatch = ThunkDispatch<State, undefined, Action>;

export interface Actions {
    fetchDevices: () => void;
    fetchLocations: (device: Record<DeviceProps>) => void;
}
