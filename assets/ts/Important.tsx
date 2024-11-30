import * as React from 'react';

interface Props {
    children: React.ReactNode;
}

export default function Important(props: Props) {
    const { children } = props;

    return (
        <div className="alert__important">
            <p className="alert__important--title">
                <img alt="" src="/img/important.svg" width={16} />
                {' '}
                Important
            </p>
            <p className="alert__important--body">
                {children}
            </p>
        </div>
    );
}
