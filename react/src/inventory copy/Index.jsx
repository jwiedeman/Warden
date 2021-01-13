import React from 'react';

import { accountService } from '../processes/node_modules/@/_services';

function Inventory() {
    const user = accountService.userValue;
    
    return (
        <div className="p-4">
            <div className="container">
                <h1>Hi {user.firstName}!</h1>
               
            </div>
        </div>
    );
}

export { Inventory };