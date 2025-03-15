import {
    DomUtil,
    LatLng,
    Layer,
    Map,
    Point,
} from 'leaflet';

export default class extends Layer {
    private container?: HTMLDivElement;

    private map?: Map;

    public onAdd(map: Map) {
        this.map = map;

        if (this.options.pane) {
            const pane = map.getPane(this.options.pane);

            this.container = DomUtil.create('div');
            this.container.style.background = 'white';
            this.container.style.border = '1px solid gray';
            this.container.style.fontSize = '10px';
            this.container.style.padding = '3px';
            this.container.style.width = 'max-content';

            pane?.appendChild(this.container);

            map.on('zoomend viewreset', this.update, this);
        }
        return this;
    }

    public setHtml(html: string[]) {
        if (this.container) {
            if (html.length > 0) {
                this.container.innerHTML = html.join('<br />');
                this.container.style.display = 'block';
            } else {
                this.container.style.display = 'none';
            }
        }
    }

    public setPosition(position?: {lat: number, lng: number}) {
        if (position && this.container && this.map) {
            const point = this.map.latLngToLayerPoint(position);
            DomUtil.setPosition(this.container, new Point(point.x + 10, point.y + 10));
        }
    }

    public onRemove(map: Map) {
        this.container?.remove();
        map.off('zoomend viewreset', this.update, this);
        return this;
    }

    private update() {
        if (this.map && this.container) {
            DomUtil.setPosition(this.container, this.map.latLngToLayerPoint(new LatLng(-40, 174)));
        }
    }
}
