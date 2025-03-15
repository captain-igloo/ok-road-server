import Ring from './Ring';

export interface Point {
    x: number;
    y: number;
}

export default class {
    private rings: Ring[] = [];

    public constructor(rings: Point[][]) {
        rings.forEach((ring) => {
            this.rings.push(new Ring(ring));
        });
    }

    public intersectsPoint(point: Point): boolean {
        let intersects = false;

        this.rings.every((ring) => {
            if (
                this.pointIntersectsBoundingBox(point, ring.getBoundingBox())
                && this.pointIntersectsRing(point, ring.getRing())
            ) {
                if (ring.isClockwise()) {
                    // point is within exterior ring
                    intersects = true;
                } else {
                    // point is within hole
                    intersects = false;
                    return false;
                }
            }
            return true;
        });

        return intersects;
    }

    private pointIntersectsBoundingBox(point: Point, boundingBox: [Point, Point]) {
        return boundingBox[0].x <= point.x
            && boundingBox[1].x >= point.x
            && boundingBox[0].y <= point.y
            && boundingBox[1].y >= point.y;
    }

    private pointIntersectsRing(point: Point, ring: Point[]) {
        // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html,
        let inside = false;
        const pm = ring.length;
        const jm = ring.length - 1;
        for (let i = 0, j = jm; i < pm; j = i, i += 1) {
            if (
                (ring[i].y > point.y) !== (ring[j].y > point.y)
                && point.x < (((ring[j].x - ring[i].x) * (point.y - ring[i].y)) / (ring[j].y - ring[i].y)) + ring[i].x
            ) {
                inside = !inside;
            }
        }
        return inside;
    }
}
