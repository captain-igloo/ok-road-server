import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons/faGlobe';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons/faRightFromBracket';
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons/faRightToBracket';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
import { faUserGroup } from '@fortawesome/free-solid-svg-icons/faUserGroup';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons/faUserPlus';
import * as React from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import { useDispatch } from 'react-redux';

import Friends from './friends/Friends';
import { showFriends } from './friends/slice';
import { AppDispatch } from './store';

interface Props {
    showMap?: boolean;
    showRegister?: boolean;
    showSignIn?: boolean;
    user?: {
        fullName: string;
    };
}

export const useAppDispatch: () => AppDispatch = useDispatch;

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

    const dispatch = useAppDispatch();

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
                    <Dropdown.Item onClick={() => { dispatch(showFriends(true)); }}>
                        <FontAwesomeIcon icon={faUserGroup} />
                        &nbsp;
                        Friends
                    </Dropdown.Item>
                    <Dropdown.Item href="/logout">
                        <FontAwesomeIcon icon={faRightFromBracket} />
                        &nbsp;
                        Logout
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            <Friends />
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
        <>
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
        </>
    );
}
