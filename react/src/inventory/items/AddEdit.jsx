import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { wardenService, alertService } from '@/_services';

function AddEdit({ history, match }) {
    const { id } = match.params;
    const isAddMode = !id;
    
    const initialValues = {
        name: '',
        notes: '',
        totalMeasurement: 0,
        productUrl:'',
        entries : []
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
        if (isAddMode) {
            createUser(fields, setSubmitting);
        } else {
            updateUser(id, fields, setSubmitting);
        }
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
                            <div className="form-group col-5">
                                <label>notes</label>
                                <Field name="notes" type="text" className={'form-control' + (errors.notes && touched.notes ? ' is-invalid' : '')} />
                                <ErrorMessage name="notes" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col-5">
                                <label>submittedDate</label>
                                <Field name="totalMeasurement" type="text" className={'form-control' + (errors.totalMeasurement && touched.totalMeasurement ? ' is-invalid' : '')} />
                                <ErrorMessage name="totalMeasurement" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col-5">
                                <label>submittedDate</label>
                                <Field name="productUrl" type="text" className={'form-control' + (errors.productUrl && touched.productUrl ? ' is-invalid' : '')} />
                                <ErrorMessage name="productUrl" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col-5">
                                <label>submittedDate</label>
                                <Field name="entries" type="text" className={'form-control' + (errors.entries && touched.entries ? ' is-invalid' : '')} />
                                <ErrorMessage name="entries" component="div" className="invalid-feedback" />
                            </div>
                            
                        
                        </div>
                       
                        {!isAddMode &&
                            <div>
                                <h3 className="pt-3">Change Password</h3>
                                <p>Leave blank to keep the same password</p>
                            </div>
                        }
                        
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

export { AddEdit };