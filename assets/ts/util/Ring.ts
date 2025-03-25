import { Point } from './Polygon';

export default class {
    private boundingBox?: [Point, Point];

    private clockwise?: boolean;

    private ring: Point[];

    public constructor(ring: Point[]) {
        this.ring = ring;
    }

    public getBoundingBox() {
        if (this.boundingBox === undefined) {
            const boundingBox: [Point, Point] = [{
                x: Number.MAX_VALUE,
                y: Number.MAX_VALUE,
            }, {
                x: -Number.MAX_VALUE,
                y: -Number.MAX_VALUE,
            }];

            this.ring.forEach((point) => {
                boundingBox[0].x = Math.min(boundingBox[0].x, point.x);
                boundingBox[0].y = Math.min(boundingBox[0].y, point.y);
                boundingBox[1].x = Math.max(boundingBox[1].x, point.x);
                boundingBox[1].y = Math.max(boundingBox[1].y, point.y);
            });

            this.boundingBox = boundingBox;
        }
        return this.boundingBox;
    }

    public isClockwise(): boolean {
        if (this.clockwise === undefined) {
            let sum = 0;
            for (let i = 0; i < this.ring.length; i += 1) {
                const current = this.ring[i];
                const next = this.ring[(i + 1) % this.ring.length];
                sum += (next.x - current.x) * (next.y + current.y);
            }
            this.clockwise = sum < 0;
        }
        return this.clockwise;
    }

    public getRing(): Point[] {
        return this.ring;
    }
}
