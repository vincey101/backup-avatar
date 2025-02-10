'use client';

import { Box, Grid, InputAdornment, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { LoadingButton } from "@mui/lab";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { toast } from "sonner";

interface FormValues {
    firstname: string;
    lastname: string;
    username: string;
}

interface PasswordFormValues {
    oldPassword: string;
    password: string;
    cPass: string;
    userid: string;
}

// Update the LoadingButton styles to match the app's design
const ButtonStyles = {
    textTransform: 'none',
    backgroundColor: 'transparent',
    backgroundImage: 'linear-gradient(to right, #6366f1, #111827)',
    borderRadius: '8px',
    padding: '0.5rem 1.5rem',
    fontSize: '0.9rem',
    fontWeight: 500,
    color: 'white',
    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
    transition: 'all 200ms',
    '&:hover': {
        transform: 'scale(1.02)',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        backgroundImage: 'linear-gradient(to right, #4f46e5, #1f2937)',
    }
};

export default function Settings() {
    const [user, setUser] = useState({
        first_name: '',
        last_name: '',
        username: '',
        email: ''
    });

    const validationSchema = Yup.object({
        firstname: Yup.string().required("Firstname is Required"),
        lastname: Yup.string().required("Lastname is Required"),
        username: Yup.string().required("Username is Required"),
    });
    const formik = useFormik<FormValues>({
        initialValues: {
            firstname: user.first_name || '',
            lastname: user.last_name || '',
            username: user.username || '',
        },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const userDataStr = localStorage.getItem('userData');
                if (!userDataStr) {
                    throw new Error('User data not found');
                }

                const userData = JSON.parse(userDataStr);
                const token = userData.token;

                // Combine firstname and lastname for the API
                const requestBody = {
                    name: `${values.firstname} ${values.lastname}`.trim(),
                    email: user.email // Use the email from current user state
                };

                const response = await fetch('https://api.humanaiapp.com/api/profile', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody)
                });

                const data = await response.json();

                if (data.status === "success") {
                    // Update local storage with new user data
                    const updatedUserData = {
                        ...userData,
                        user: {
                            ...userData.user,
                            first_name: values.firstname,
                            last_name: values.lastname,
                            name: requestBody.name
                        }
                    };
                    localStorage.setItem('userData', JSON.stringify(updatedUserData));

                    // Update local state
                    setUser(prev => ({
                        ...prev,
                        first_name: values.firstname,
                        last_name: values.lastname
                    }));

                    toast.success('Profile updated successfully');
                } else {
                    toast.error(data.message || 'Failed to update profile');
                }
            } catch (error) {
                toast.error('An error occurred while updating the profile');
            } finally {
                setLoading(false);
            }
        }
    });

    const passwordFormik = useFormik<PasswordFormValues>({
        initialValues: {
            oldPassword: '',
            password: '',
            cPass: '',
            userid: ''
        },
        validationSchema: Yup.object({
            oldPassword: Yup.string().required('Old password is required'),
            password: Yup.string().required('Password is required').min(6, "Password must be at least 6 characters"),
            cPass: Yup.string()
                .required("Confirm Password is Required")
                .oneOf([Yup.ref("password")], "Password Must Match")
        }),
        onSubmit: async (values, { resetForm }) => submitPassword(values, resetForm)
    });

    const [showOld, setOld] = useState(false)
    const [showNew, setNew] = useState(false)
    const [showConfirm, setConfirm] = useState(false)
    const [loading, setLoading] = useState(false)
    const [passLoading, setPassLoading] = useState(false)

    // Move localStorage access to useEffect
    useEffect(() => {
        const savedData = localStorage.getItem('userData');
        if (savedData) {
            try {
                const userData = JSON.parse(savedData);
                setUser(userData.user || {
                    first_name: '',
                    last_name: '',
                    username: '',
                    email: ''
                });
            } catch (error) {
                console.error('Error parsing userData:', error);
            }
        }
    }, []);

    const submitPassword = async (values: PasswordFormValues, resetForm: Function) => {
        setPassLoading(true);
        try {
            const userDataStr = localStorage.getItem('userData');
            if (!userDataStr) {
                throw new Error('User data not found');
            }

            const userData = JSON.parse(userDataStr);
            const token = userData.token;

            // Format the request body according to API expectations
            const requestBody = {
                current_password: values.oldPassword,
                password: values.password
            };

            const response = await fetch('https://api.humanaiapp.com/api/change-password', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();

            if (data.status === "success") {
                toast.success('Password changed successfully');
                resetForm();
            } else {
                toast.error(data.message || 'Failed to update password');
            }
        } catch (error) {
            toast.error('An error occurred while updating the password');
        } finally {
            setPassLoading(false);
        }
    };

    return (
        <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', padding: '2rem' }}>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={1} lg={1} md={1} />
                <Grid item xs={12} sm={10} lg={10} md={10}>
                    <h4 style={{
                        fontSize: '1.8rem',
                        fontWeight: 600,
                        color: '#1a1a1a',
                        marginBottom: '2rem',
                        marginTop: '1rem',
                        padding: '0.5rem 0'
                    }}>
                        Settings
                    </h4>

                    <div className={'dashboard-card'} style={{
                        backgroundColor: '#fff',
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                        marginBottom: '2rem'
                    }}>
                        <Box className={'dashboard-card-content'} sx={{
                            padding: '2rem',
                            flexDirection: { xs: 'column', sm: 'row' },
                            gap: '2rem'
                        }}>
                            <div style={{ flex: '0 0 250px' }}>
                                <h5 style={{
                                    fontSize: '1.4rem',
                                    fontWeight: 600,
                                    color: '#1a1a1a',
                                    marginBottom: '0.5rem'
                                }}>
                                    Basic details
                                </h5>
                                <p style={{
                                    color: '#666',
                                    fontSize: '0.9rem',
                                    marginBottom: '1.5rem'
                                }}>
                                    Your profile details, this can be changed anytime
                                </p>
                            </div>

                            <Box sx={{
                                flex: '1',
                                maxWidth: '500px'
                            }}>
                                <form
                                    noValidate
                                    aria-autocomplete={"none"}
                                    autoComplete={"off"}
                                    onSubmit={formik.handleSubmit}
                                >
                                    <TextField
                                        label={'Firstname'}
                                        placeholder={'Enter your firstname'}
                                        id={'firstname'}
                                        name={'firstname'}
                                        margin={'dense'}
                                        size={'medium'}
                                        fullWidth
                                        color={'primary'}
                                        value={formik.values.firstname}
                                        onChange={formik.handleChange}
                                        error={formik.touched.firstname && Boolean(formik.errors.firstname)}
                                        helperText={formik.touched.firstname && formik.errors.firstname ? formik.errors.firstname : ''}
                                        variant={'outlined'} />

                                    <TextField
                                        label={'Lastname'}
                                        placeholder={'Enter your lastname'}
                                        id={'lastname'}
                                        margin={'dense'}
                                        name={'lastname'}
                                        size={'medium'}
                                        fullWidth
                                        color={'primary'}
                                        value={formik.values.lastname}
                                        onChange={formik.handleChange}
                                        error={formik.touched.lastname && Boolean(formik.errors.lastname)}
                                        helperText={formik.touched.lastname && formik.errors.lastname ? formik.errors.lastname : ''}
                                        variant={'outlined'} />

                                    <TextField
                                        label={'Username'}
                                        placeholder={'Enter your username'}
                                        id={'username'}
                                        margin={'dense'}
                                        name={'username'}
                                        size={'medium'}
                                        fullWidth
                                        color={'primary'}
                                        value={formik.values.username}
                                        onChange={formik.handleChange}
                                        error={formik.touched.username && Boolean(formik.errors.username)}
                                        helperText={formik.touched.username && formik.errors.username ? formik.errors.username : ''}
                                        variant={'outlined'} />

                                    <TextField
                                        label={'Email'}
                                        placeholder={'Enter your email'}
                                        id={'email'}
                                        margin={'dense'}
                                        name={'email'}
                                        size={'medium'}
                                        fullWidth
                                        color={'primary'}
                                        value={user.email}
                                        disabled
                                        variant={'outlined'} />

                                    <br />
                                    <br />

                                    <LoadingButton
                                        loading={loading}
                                        type={'submit'}
                                        disableElevation
                                        variant={'contained'}
                                        sx={ButtonStyles}
                                        size={'large'}
                                    >
                                        Save Changes
                                    </LoadingButton>
                                </form>
                            </Box>
                        </Box>
                    </div>

                    <div className={'dashboard-card'} style={{
                        backgroundColor: '#fff',
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                        marginBottom: '2rem'
                    }}>
                        <Box className={'dashboard-card-content'} sx={{
                            padding: '2rem',
                            flexDirection: { xs: 'column', sm: 'row' },
                            gap: '2rem'
                        }}>
                            <div style={{ flex: '0 0 250px' }}>
                                <h5 style={{
                                    fontSize: '1.4rem',
                                    fontWeight: 600,
                                    color: '#1a1a1a',
                                    marginBottom: '0.5rem'
                                }}>
                                    Security
                                </h5>
                                <p style={{
                                    color: '#666',
                                    fontSize: '0.9rem',
                                    marginBottom: '1.5rem'
                                }}>
                                    Change your account password here
                                </p>
                            </div>

                            <Box sx={{
                                flex: '1',
                                maxWidth: '500px'
                            }}>
                                <form
                                    noValidate
                                    aria-autocomplete={"none"}
                                    autoComplete={"off"}
                                    onSubmit={passwordFormik.handleSubmit}
                                >
                                    <TextField
                                        label={'Old Password'}
                                        placeholder={'Enter old password '}
                                        id={'oldPassword'}
                                        name={'oldPassword'}
                                        margin={'dense'}
                                        size={'medium'}
                                        type={!showOld ? 'password' : 'text'}
                                        fullWidth
                                        color={'primary'}
                                        value={passwordFormik.values.oldPassword}
                                        onChange={passwordFormik.handleChange}
                                        error={passwordFormik.touched.oldPassword && Boolean(passwordFormik.errors.oldPassword)}
                                        helperText={passwordFormik.touched.oldPassword && passwordFormik.errors.oldPassword}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment
                                                    onClick={() => setOld(!showOld)}
                                                    position="end"
                                                    sx={{ cursor: "pointer" }}
                                                >
                                                    {showOld ? <VisibilityOff /> : <Visibility />}
                                                </InputAdornment>
                                            )
                                        }}
                                        variant={'outlined'} />

                                    <TextField
                                        label={'New Password'}
                                        placeholder={'Enter new password '}
                                        id={'password'}
                                        name={'password'}
                                        margin={'dense'}
                                        size={'medium'}
                                        type={!showNew ? 'password' : 'text'}
                                        fullWidth
                                        color={'primary'}
                                        value={passwordFormik.values.password}
                                        onChange={passwordFormik.handleChange}
                                        error={passwordFormik.touched.password && Boolean(passwordFormik.errors.password)}
                                        helperText={passwordFormik.touched.password && passwordFormik.errors.password}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment
                                                    onClick={() => setNew(!showNew)}
                                                    position="end"
                                                    sx={{ cursor: "pointer" }}
                                                >
                                                    {showNew ? <VisibilityOff /> : <Visibility />}
                                                </InputAdornment>
                                            )
                                        }}
                                        variant={'outlined'} />

                                    <TextField
                                        label={'Confirm Password'}
                                        placeholder={'Confirm your password'}
                                        id={'cPass'}
                                        name={'cPass'}
                                        margin={'dense'}
                                        size={'medium'}
                                        type={!showConfirm ? 'password' : 'text'}
                                        fullWidth
                                        color={'primary'}
                                        value={passwordFormik.values.cPass}
                                        onChange={passwordFormik.handleChange}
                                        error={passwordFormik.touched.cPass && Boolean(passwordFormik.errors.cPass)}
                                        helperText={passwordFormik.touched.cPass && passwordFormik.errors.cPass}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment
                                                    onClick={() => setConfirm(!showConfirm)}
                                                    position="end"
                                                    sx={{ cursor: "pointer" }}
                                                >
                                                    {showConfirm ? <VisibilityOff /> : <Visibility />}
                                                </InputAdornment>
                                            )
                                        }}
                                        variant={'outlined'} />

                                    <br />
                                    <br />

                                    <LoadingButton
                                        loading={passLoading}
                                        type={'submit'}
                                        disableElevation
                                        variant={'contained'}
                                        sx={ButtonStyles}
                                        size={'large'}
                                    >
                                        Save Changes
                                    </LoadingButton>
                                </form>
                            </Box>
                        </Box>
                    </div>
                </Grid>
            </Grid>
        </Box>
    )
}