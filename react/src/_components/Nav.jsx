import React, { useState, useEffect } from 'react';
import { NavLink, Route } from 'react-router-dom';

import { Role } from '@/_helpers';
import { accountService } from '@/_services';

function Nav() {
    const [user, setUser] = useState({});

    useEffect(() => {
        const subscription = accountService.user.subscribe(x => setUser(x));
        return subscription.unsubscribe;
    }, []);

    // only show nav when logged in
    if (!user) return null;

    return (
        <div>
            <nav className="navbar navbar-expand navbar-light text-dark">
                <div className="navbar-nav">
                    <NavLink exact to="/" className="nav-item nav-link">Home</NavLink>
                    <NavLink to="/profile" className="nav-item nav-link">Profile</NavLink>
                    <NavLink to="/tasks" className="nav-item nav-link">Tasks</NavLink>
                    <NavLink to="/inventory" className="nav-item nav-link">Inventory</NavLink>
                    <NavLink to="/processes" className="nav-item nav-link">Processes</NavLink>
                    <NavLink to="/locations" className="nav-item nav-link">Locations</NavLink>
                    <NavLink to="/warden" className="nav-item nav-link">Warden</NavLink>
                    {user.role === Role.Admin &&
                        <NavLink to="/admin" className="nav-item nav-link">Admin</NavLink>
                    }
                    <a onClick={accountService.logout} className="nav-item nav-link text-danger">Logout</a>
                </div>
            </nav>
            <Route path="/admin" component={AdminNav} />
        </div>
    );
}

function AdminNav({ match }) {
    const { path } = match;

    return (
        <nav className="admin-nav navbar navbar-expand navbar-light">
            <div className="navbar-nav">
                <NavLink to={`${path}/users`} className="nav-item nav-link">Users</NavLink>
            </div>
        </nav>
    );
}

export { Nav }; 