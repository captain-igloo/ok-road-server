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
    showMap?: boolean;
    showRegister?: boolean;
    showSignIn?: boolean;
    user?: {
        fullName: string;
    };
}

function UserMenu(props: Props) {
    const {
        showMap,
        showRegister,
        showSignIn,
        user,
    } = props;

    if (user === undefined) {
        let registerButton;
        if (showRegister !== false) {
            registerButton = (
                <Button href="/register" variant="outline">
                    <FontAwesomeIcon icon={faUserPlus} />
                    &nbsp;
                    Register
                </Button>
            );
        }

        let signInButton;
        if (showSignIn !== false) {
            signInButton = (
                <Button href="/login" variant="outline">
                    <FontAwesomeIcon icon={faRightToBracket} />
                    &nbsp;
                    Sign in
                </Button>
            );
        }

        return (
            <ButtonGroup>
                {registerButton}
                {signInButton}
            </ButtonGroup>
        );
    }

    let mapButton;
    if (showMap !== false) {
        mapButton = (
            <Button href="/map" variant="outline">
                <FontAwesomeIcon icon={faGlobe} />
                &nbsp;
                Map
            </Button>
        );
    }

    return (
        <>
            {mapButton}
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
                    <img src="/img/ok.svg" width="40px" height="40px" />
                </a>
                &nbsp;
                OK Road New Zealand
            </div>
            <UserMenu showMap={showMap} showRegister={showRegister} showSignIn={showSignIn} user={user} />
        </div>
    );
}
