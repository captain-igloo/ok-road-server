import * as React from 'react';

export default function SpeedLimitImage(props: { speedLimit?: number }) {
    const { speedLimit } = props;
    let alt = '';
    let filename = 'blank.svg';
    if (speedLimit !== undefined) {
        alt = `${speedLimit} km/h`;
        filename = `${speedLimit}.svg`;
    }
    return (<img alt={alt} height={20} src={`/img/${filename}`} width={20} />);
}
