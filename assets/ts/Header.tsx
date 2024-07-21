import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons';
import * as React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { useSelector } from 'react-redux';

import { RootState } from './store';

function UserMenu() {
    const user = useSelector((state: RootState) => state.okRoad.user);
    if (user.fullName) {
        return (
            <Dropdown>
                <Dropdown.Toggle variant="outline">
                    <FontAwesomeIcon icon={faUser} />
                    &nbsp;
                    {user.fullName}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item href="/logout">
                        <FontAwesomeIcon icon={faRightFromBracket} />
                        &nbsp;
                        Logout
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        );
    }
    return null;
}

export default function Header() {
    return (
        <div className="header">
            <div className="logo">
                <a href="/">
                    <img src="/img/ok.svg" width="40px" height="40px" />
                </a>
                &nbsp;
                OK Road New Zealand
            </div>
            <UserMenu />
        </div>
    );
}
