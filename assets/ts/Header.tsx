import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faGlobe,
    faRightFromBracket,
    faRightToBracket,
    faUser,
    faUserPlus,
} from '@fortawesome/free-solid-svg-icons';
import * as React from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';

interface Props {
    user?: {
        fullName: string;
    };
}

function UserMenu(props: Props) {
    const { user } = props;

    if (user === undefined) {
        return (
            <ButtonGroup>
                <Button href="/register" variant="outline-dark">
                    <FontAwesomeIcon icon={faUserPlus} />
                    &nbsp;
                    Register
                </Button>
                <Button href="/login" variant="outline-dark">
                    <FontAwesomeIcon icon={faRightToBracket} />
                    &nbsp;
                    Sign in
                </Button>
            </ButtonGroup>
        );
    }

    return (
        <>
            <Button href="/map" variant="outline-dark">
                <FontAwesomeIcon icon={faGlobe} />
                &nbsp;
                Map
            </Button>
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
        </>
    );
}

export default function Header(props: Props) {
    const { user } = props;

    return (
        <div className="header">
            <div className="logo">
                <a href="/">
                    <img src="/img/ok.svg" width="40px" height="40px" />
                </a>
                &nbsp;
                OK Road New Zealand
            </div>
            <UserMenu user={user} />
        </div>
    );
}
