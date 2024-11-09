import * as React from 'react';

import UserMenu from './UserMenu';

interface Props {
    showMap?: boolean;
    showRegister?: boolean;
    showSignIn?: boolean;
    user?: {
        fullName: string;
    };
}

export default function Header(props: Props) {
    const {
        showMap,
        showRegister,
        showSignIn,
        user,
    } = props;

    return (
        <div className="header">
            <div className="logo">
                <a href="/">
                    <img alt="Home" src="/img/ok.svg" width="40px" height="40px" />
                </a>
                &nbsp;
                OK Road New Zealand
            </div>
            <UserMenu
                showMap={showMap}
                showRegister={showRegister}
                showSignIn={showSignIn}
                user={user}
            />
        </div>
    );
}
