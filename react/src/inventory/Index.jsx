import React, { useState, useEffect} from 'react';
import { Route, Switch, Link } from 'react-router-dom';

import { Overview } from './Overview';
import { Items } from './items';
import { wardenService } from '@/_services';

function Inventory({ match }) {
    const { path } = match;
    const [users, setItems] = useState(null);

    useEffect(() => {
        wardenService.getAll().then(x => setItems(x));
    }, []);
    
    return (
        <div className="p-4">
            <div className="container">
                <Switch>
                    <Route exact path={path} component={Overview} />
                    <Route path={`${path}/items`} component={Items} />
                </Switch>
            </div>
            
        </div>
        
    );
}

export { Inventory };