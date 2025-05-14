import { useFormik } from 'formik';
import * as Yup from 'yup';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../../context/storeProvider';
import { Link } from 'react-router-dom';
import {getUserLoginInfo}from '../../../helpers/local-storage-helper'

function LoginComponent() {
    const navigate = useNavigate();
    const { userStore } = useStore();
    const userLoginInfo = getUserLoginInfo();
    if (userLoginInfo) {
        const { loggedIn } = userLoginInfo;
        if (loggedIn) {
            navigate('/');
        }
    }

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Required'),
            password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
        }),
        onSubmit: (values) => {
            const success = userStore.loginUser(values.email, values.password);
            if (success) {
                navigate('/');
            }
        },
    });

    return (
        <div className="height-100 justify-content-center align-items-center width-100">
            <div className="mt-5 row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h3 className="card-title text-center">Login</h3>
                            <form onSubmit={formik.handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Gmail</label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                                        placeholder="Enter your Gmail"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.email}
                                    />
                                    {formik.touched.email && formik.errors.email && (
                                        <div className="invalid-feedback">{formik.errors.email}</div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        className={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
                                        placeholder="Enter your password"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.password}
                                    />
                                    {formik.touched.password && formik.errors.password && (
                                        <div className="invalid-feedback">{formik.errors.password}</div>
                                    )}
                                </div>

                                <button type="submit" className="btn btn-primary w-100">Login</button>

                                <Link to="/signup" className="d-block text-center mt-3">
                                    Don’t have an account? Sign up
                                </Link>

                                {userStore.userState.isError && (
                                    <div className="alert alert-danger mt-3" role="alert">
                                        {userStore.userState.isError}
                                    </div>
                                )}

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default observer(LoginComponent);