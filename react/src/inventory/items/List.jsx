import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { wardenService } from '@/_services';

function List({ match }) {
    const { path } = match;
    const [inventory, setUsers] = useState(null);

    useEffect(() => {
        wardenService.getAll().then(x => setUsers(x));
    }, []);

    function deleteUser(id) {
        setUsers(inventory.map(x => {
            if (x.id === id) { x.isDeleting = true; }
            return x;
        }));
        
        wardenService.delete(id).then(() => {
            setUsers(inventory => inventory.filter(x => x.id !== id));
        });
    }

    return (
        <div>
            <h1>Inventory</h1>
            <p>All inventory items</p>
            <Link to={`${path}/add`} className="btn btn-sm btn-success mb-2">Add Item</Link>

            <table className="table table-striped">
                <thead>
                    <tr>
                        <th style={{ width: '30%' }}>Name</th>
                        <th style={{ width: '30%' }}>Submitted</th>
                        <th style={{ width: '30%' }}>Expires</th>
                        <th style={{ width: '30%' }}>expiration date</th>
                        <th style={{ width: '10%' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {inventory && inventory.map(item =>
                        <tr key={item.id}>
                            <td>{item.name} {item.id} </td>
                            <td>{item.created}</td>
                            <td>{JSON.stringify(item.expires)}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                                <Link to={`${path}/edit/${item.id}`} className="btn btn-sm btn-primary mr-1">Edit</Link>
                                <button onClick={() => deleteUser(item.id)} className="btn btn-sm btn-danger" style={{ width: '60px' }} disabled={item.isDeleting}>
                                    {item.isDeleting 
                                        ? <span className="spinner-border spinner-border-sm"></span>
                                        : <span>Delete</span>
                                    }
                                </button>
                            </td>
                        </tr>
                    )}
                    {!inventory &&
                        <tr>
                            <td colSpan="4" className="text-center">
                                <span className="spinner-border spinner-border-lg align-center"></span>
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    );
}

export { List };