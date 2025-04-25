import '../setup';

import { describe, expect, test } from '@jest/globals';

import Polygon from '../../ts/util/Polygon';

describe('Polygon', () => {
    test('intersectsPoint() should return true if point is within exterior ring', () => {
        const polygon = new Polygon([[{x: 0, y: 0}, {x: 10, y: 0}, {x: 10, y: 10}, {x: 0, y: 10}, {x: 0, y: 0}]]);
        expect(polygon.intersectsPoint({x: 5, y: 5})).toBe(true);
    });

    test('intersectsPoint() should return false if point is within hole', () => {
        const polygon = new Polygon([[{x: 0, y: 0}, {x: 0, y: 10}, {x: 10, y: 10}, {x: 10, y: 0}, {x: 0, y: 0}]]);
        expect(polygon.intersectsPoint({x: 5, y: 5})).toBe(false);
    });
});
