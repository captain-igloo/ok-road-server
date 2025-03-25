import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Control, ControlOptions, DomUtil } from 'leaflet';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import { createPortal } from 'react-dom';

interface ButtonControlOptions extends ControlOptions {
    className?: string;
    icon: IconProp;
    onClick: () => void;
    title?: string;
    variant?: string;
}

export default class ButtonControl extends Control {
    private portal: React.ReactNode;

    private onClick: () => void;

    private icon: IconProp;

    private className?: string;

    private div?: HTMLDivElement;

    private title?: string;

    private variant?: string;

    public constructor(options: ButtonControlOptions) {
        super(options);
        this.onClick = options.onClick;
        this.icon = options.icon;
        this.className = options.className;
        this.title = options.title;
        this.variant = options.variant;
    }

    private getDiv(): HTMLDivElement {
        if (!this.div) {
            this.div = DomUtil.create('div');
        }
        return this.div;
    }

    private createPortal() {
        this.portal = createPortal(
            <Button
                onClick={this.onClick}
                title={this.title}
                variant={this.variant || 'light'}
            >
                <FontAwesomeIcon className={this.className} icon={this.icon} />
            </Button>,
            this.getDiv(),
        );
    }

    public setClassName(className?: string) {
        this.className = className;
        this.createPortal();
    }

    public setVariant(variant?: string) {
        this.variant = variant;
        this.createPortal();
    }

    public setOnClick(onClick: () => void) {
        this.onClick = onClick;
        this.createPortal();
    }

    public setTitle(title?: string) {
        this.title = title;
        this.createPortal();
    }

    public setIcon(icon: IconProp) {
        this.icon = icon;
        this.createPortal();
    }

    public onAdd() {
        this.createPortal();
        return this.getDiv();
    }

    public getPortal() {
        return this.portal;
    }
}
