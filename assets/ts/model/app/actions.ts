import * as deviceActions from '../device/actions';
import { Dispatch } from './types';

const initialize = () => (dispatch: Dispatch) => {
    dispatch(deviceActions.fetchDevices());
};

const actions = {
    ...deviceActions,
    initialize,
};

export default actions;
