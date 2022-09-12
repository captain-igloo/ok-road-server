import * as deviceActions from '../device/actions';
import { Dispatch } from './types';

const initialize = () => (dispatch: Dispatch) => {
    dispatch(deviceActions.fetchDevices());
    dispatch(deviceActions.fetchCameras());
};

const actions = {
    ...deviceActions,
    initialize,
};

export default actions;
