import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from './reducer';
import { State, Dispatch } from './types';

export default function configureStore() {
    return createStore(rootReducer, applyMiddleware<Dispatch, State>(thunk));
}
