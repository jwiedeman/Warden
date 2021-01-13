import React from 'react';

import { accountService } from '@/_services';

function Processes() {
    const user = accountService.userValue;
    
    return (
        <div className="p-4">
            <div className="container">
                <h1>Hi {user.firstName}!</h1>
               
            </div>
        </div>
    );
}

export { Processes };