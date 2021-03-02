import React, { useEffect , useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { wardenService, alertService } from '@/_services';

function AddEntry({ history, match }) {
    const { id } = match.params;
    const isAddMode = !id;
    
   
    var initialValues = {
        name: '',
        notes: '',
        totalMeasurement: 0,
        productUrl:'',
        entries : [],
        
        entities: [
            {
                id: 'a',
                text: 'go shopping',
                
            },
            {
                id: 'b',
                text: 'learn recursion',
                
            },
        ],
    };
    

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required('First Name is required'),
        notes: Yup.string(),
            
        totalMeasurement: Yup.number(),
            
        productUrl: Yup.string(),
            
        entries: Yup.array(),
            
    });

  



    function onSubmit(fields, { setStatus, setSubmitting }) {
        setStatus();
        this.setState({entities: this.entities.state.push('member')});
        setSubmitting(false);
    }

    function createUser(fields, setSubmitting) {
        wardenService.createInventory(fields)
            .then(() => {
                alertService.success('User added successfully', { keepAfterRouteChange: true });
                history.push('.');
            })
            .catch(error => {
                setSubmitting(false);
                alertService.error(error);
            });
    }

    function updateUser(id, fields, setSubmitting) {
        wardenService.update(id, fields)
            .then(() => {
                alertService.success('Update successful', { keepAfterRouteChange: true });
                history.push('..');
            })
            .catch(error => {
                setSubmitting(false);
                console.log(error)
                alertService.error(error);
            });
    }


    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ errors, touched, isSubmitting, setFieldValue }) => {
                useEffect(() => {
                    if (!isAddMode) {
                        // get user and set form fields
                        wardenService.getById(id).then(user => {
                            const fields = ['name','notes','totalMeasurement','productUrl','entries'];
                            fields.forEach(field => setFieldValue(field, user[field], false));
                        });
                    }
                }, []);

                return (
                    <Form>
                        <h1>{isAddMode ? 'Add Item' : 'Edit Item'}</h1>
                        <div className="form">
                   
                            <div className="form-group col-5">
                                <label>Item Name</label>
                                <Field name="name" type="text" className={'form-control' + (errors.name && touched.name ? ' is-invalid' : '')} />
                                <ErrorMessage name="name" component="div" className="invalid-feedback" />
                            </div>
                       


                        </div>
                       
                        {JSON.stringify(initialValues.entities)}
                        <button onClick='onSubmit()'>Submit</button>
                        <div className="form-group">
                            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                                {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                Save Item
                            </button>
                            <Link to={isAddMode ? '.' : '..'} className="btn btn-link">Cancel</Link>
                        </div>

                        
                    </Form>
                );
            }}
        </Formik>
    );
}

export { AddEntry };