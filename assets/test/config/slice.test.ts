import '../setup';

import { describe, expect, test } from '@jest/globals';

import { setConfig } from '../../ts/config/slice';
import { setupStore } from '../../ts/store';

describe('config slice', () => {
    test('setConfig should set config', () => {
        const store = setupStore();
        const config = {
            demo: false,
            map: {
                center: {
                    lat: -41,
                    lng: 174,
                },
                zoom: 5,
            },
            maxResults: 1000,
            speedLimitTilesUrl: undefined,
        };
        store.dispatch(setConfig(config));
        expect(store.getState().config).toStrictEqual(config);
    });
});
