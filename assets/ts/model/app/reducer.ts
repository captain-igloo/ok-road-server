import { combineReducers } from 'redux';

import device from '../device/reducer';

const rootReducer = combineReducers({
    device,
});

export default rootReducer;
