import geojsonvt, { Features } from 'geojson-vt';
import L from 'leaflet';

import {
    GEOJSONVT_EXTENT,
    MARKER_RADIUS,
    TILE_HEIGHT,
    TILE_WIDTH,
} from './constants';

export default class CanvasLayer extends L.GridLayer {
    private canvasCache: { [key: string]: HTMLCanvasElement } = {};

    private tileIndex?: ReturnType<typeof geojsonvt>;

    public constructor() {
        super();

        this.on('tileunload', (e) => {
            delete this.canvasCache[`${e.coords.x}:${e.coords.y}:${e.coords.z}`];
        });
    }

    public setTileIndex(tileIndex: ReturnType<typeof geojsonvt>) {
        this.tileIndex = tileIndex;
        Object.keys(this.canvasCache).forEach((key: string) => {
            const matches = key.match(/^(\d+):(\d+):(\d+)$/);
            if (matches) {
                const features = this.tileIndex?.getTile(matches[3], matches[1], matches[2])?.features || [];
                this.draw(this.canvasCache[key], features);
            }
        });
    }

    public createTile(coords: L.Coords) {
        const tile = L.DomUtil.create('canvas');
        const size = this.getTileSize();
        tile.width = size.x;
        tile.height = size.y;
        const key = `${coords.x}:${coords.y}:${coords.z}`;
        this.canvasCache[key] = tile;
        const features = this.tileIndex?.getTile(coords.z, coords.x, coords.y)?.features;
        if (features) {
            this.draw(tile, features);
        }
        return tile;
    }

    private draw(canvas: HTMLCanvasElement, features: Features) {
        const context = canvas.getContext('2d');
        if (context) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.lineWidth = 2;
            features.forEach((feature) => {
                if (feature.type === 1) {
                    feature.geometry.forEach((point) => {
                        context.beginPath();
                        context?.arc(
                            point[0] / (GEOJSONVT_EXTENT / TILE_WIDTH),
                            point[1] / (GEOJSONVT_EXTENT / TILE_HEIGHT),
                            MARKER_RADIUS,
                            0,
                            Math.PI * 2,
                            true,
                        );
                        if (feature.tags?.speedLimit !== undefined) {
                            if (feature.tags.velocity > feature.tags.speedLimit) {
                                context.strokeStyle = 'rgba(255, 0, 0, 1)';
                                context.fillStyle = 'rgba(255, 0, 0, 0.2)';
                            } else {
                                context.strokeStyle = 'rgba(0, 128, 0, 1)';
                                context.fillStyle = 'rgba(0, 128, 0, 0.2)';
                            }
                        } else {
                            context.strokeStyle = 'rgba(128, 128, 128, 1)';
                            context.fillStyle = 'rgba(128, 128, 128, 0.2)';
                        }
                        context.stroke();
                        context.fill();
                    });
                }
            });
        }
    }
}
