import {
    DomUtil,
    Layer,
    Map,
    Point,
} from 'leaflet';

interface Options {
    className?: string;
}

export default class extends Layer {
    private className?: string;

    private container?: HTMLDivElement;

    private map?: Map;

    public constructor(options?: Options) {
        super();

        this.className = options?.className;
    }

    public onAdd(map: Map) {
        this.map = map;

        if (this.options.pane) {
            const pane = map.getPane(this.options.pane);

            this.container = DomUtil.create('div');
            if (this.className !== undefined) {
                this.container.className = this.className;
            }
            pane?.appendChild(this.container);
        }
        return this;
    }

    public setHtml(html: { [key: string]: string[] }) {
        if (this.container) {
            let found = false;
            if (Object.keys(html).length > 0) {
                let innerHtml = '';
                Object.keys(html).forEach((key) => {
                    if (html[key].length > 0) {
                        if (found) {
                            innerHtml += '<br />';
                        }
                        innerHtml += `<strong>${key}</strong><br />`;
                        innerHtml += html[key].join('<br />');
                        found = true;
                    }
                });
                this.container.innerHTML = innerHtml;
            }
            this.container.style.display = found ? 'block' : 'none';
        }
    }

    public setPosition(position?: { lat: number, lng: number }) {
        if (position && this.container && this.map) {
            const point = this.map.latLngToLayerPoint(position);
            DomUtil.setPosition(this.container, new Point(point.x + 10, point.y + 10));
        }
    }

    public onRemove() {
        this.container?.remove();
        return this;
    }
}
