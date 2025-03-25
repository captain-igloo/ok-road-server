import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { AppDispatch } from '../store';

export interface NotificationsState {
    notificationCount: number;
    notifications: { [key: string]: string };
}

const initialState: NotificationsState = {
    notificationCount: 0,
    notifications: {},
};

export const notificationsSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        addNotification: (state, action: PayloadAction<string>) => {
            state.notificationCount += 1;
            state.notifications[state.notificationCount] = action.payload;
        },
        removeNotification: (state, action: PayloadAction<number | undefined>) => {
            const notificationId = action.payload === undefined
                ? Object.keys(state.notifications)[0]
                : action.payload;
            delete state.notifications[notificationId];
        },
    },
});

export const addNotification = (notification: string) => (dispatch: AppDispatch) => {
    dispatch(notificationsSlice.actions.addNotification(notification));
    setTimeout(() => {
        dispatch(notificationsSlice.actions.removeNotification());
    }, 3000);
};

export const { removeNotification } = notificationsSlice.actions;

export default notificationsSlice.reducer;
