import React from 'react';
import { Link } from 'react-router-dom';

function Overview({ match }) {
    const { path } = match;

    return (
        <div>
            <h1>Inventory</h1>
            <small>This section can only be accessed by administrators.</small>
            <p><Link to={`${path}/items`}>Manage Inventory</Link></p>
        </div>
    );
}

export { Overview };