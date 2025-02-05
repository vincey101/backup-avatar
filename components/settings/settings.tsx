'use client';

import { Box, Grid, InputAdornment, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { LoadingButton } from "@mui/lab";
import { Visibility, VisibilityOff } from "@mui/icons-material";

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

interface TokenFormValues {
    key: string;
}

const SuccessToast = (message: string) => alert(message);
const ErrorToast = (message: string) => alert(message);

export default function Settings() {
    const [user, setUser] = useState({
        first_name: '',
        last_name: '',
        username: '',
        email: ''
    });
    const [credentials, setCredentials] = useState('');

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
                SuccessToast('Profile updated successfully');
                setUser({
                    ...user,
                    first_name: values.firstname,
                    last_name: values.lastname,
                    username: values.username
                });
            } catch (e: any) {
                ErrorToast(e.message || 'Failed to update profile');
            }
            setLoading(false);
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

    const tokenFormik = useFormik<TokenFormValues>({
        initialValues: {
            key: credentials || '',
        },
        validationSchema: Yup.object({
            key: Yup.string().required('Credential key is required'),
        }),
        onSubmit: async (values) => submitToken(values)
    });

    const [showOld, setOld] = useState(false)
    const [showNew, setNew] = useState(false)
    const [showConfirm, setConfirm] = useState(false)
    const [loading, setLoading] = useState(false)
    const [passLoading, setPassLoading] = useState(false)
    const [tokenLoading, setTokenLoading] = useState(false)

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

    const submitPassword = async (values: any, resetForm: Function) => {
        setPassLoading(true);
        try {
            SuccessToast('Password changed successfully');
            resetForm();
        } catch (e: any) {
            ErrorToast(e.message || 'Failed to update password');
        }
        setPassLoading(false);
    };

    const submitToken = async (values: { key: string }) => {
        setTokenLoading(true);
        try {
            setCredentials(values.key);
            SuccessToast('Token updated successfully');
        } catch (e: any) {
            ErrorToast(e.message || 'Failed to update token');
        }
        setTokenLoading(false);
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
                                    API Key
                                </h5>
                                <p style={{
                                    color: '#666',
                                    fontSize: '0.9rem',
                                    marginBottom: '1.5rem'
                                }}>
                                    Configure your OpenAI API key
                                </p>

                                <div style={{
                                    backgroundColor: '#f8f9fa',
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    marginBottom: '1rem'
                                }}>
                                    <p style={{
                                        color: '#333',
                                        fontSize: '0.9rem',
                                        fontWeight: '600',
                                        marginBottom: '0.5rem'
                                    }}>
                                        How to get your API Key
                                    </p>
                                    <ol style={{
                                        margin: '0',
                                        paddingLeft: '1.2rem',
                                        fontSize: '0.85rem',
                                        color: '#666'
                                    }}>
                                        <li style={{ marginBottom: '0.5rem' }}>
                                            <a href={'https://platform.openai.com/account/api-keys'}
                                                target={'_blank'}
                                                style={{ color: '#2563eb', textDecoration: 'none' }}>
                                                Visit OpenAI Platform
                                            </a>
                                        </li>
                                        <li style={{ marginBottom: '0.5rem' }}>Sign up for an account</li>
                                        <li style={{ marginBottom: '0.5rem' }}>Click "Create New Secret Key"</li>
                                        <li>Copy and paste the key below</li>
                                    </ol>
                                </div>
                            </div>

                            <Box sx={{
                                flex: '1',
                                maxWidth: '500px'
                            }}>
                                <form onSubmit={tokenFormik.handleSubmit}>
                                    <TextField
                                        label={'Credential Token'}
                                        placeholder={'Enter your token '}
                                        id={'key'}
                                        name={'key'}
                                        margin={'dense'}
                                        size={'medium'}
                                        type={'text'}
                                        fullWidth
                                        color={'primary'}
                                        value={tokenFormik.values.key}
                                        onChange={tokenFormik.handleChange}
                                        error={tokenFormik.touched.key && Boolean(tokenFormik.errors.key)}
                                        helperText={tokenFormik.touched.key && tokenFormik.errors.key}
                                        variant={'outlined'}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '8px',
                                            },
                                            marginBottom: '1rem'
                                        }}
                                    />
                                    <LoadingButton
                                        loading={tokenLoading}
                                        type={'submit'}
                                        disableElevation
                                        variant={'contained'}
                                        sx={{
                                            textTransform: 'none',
                                            backgroundColor: '#1D2136',
                                            borderRadius: '8px',
                                            padding: '0.5rem 1.5rem',
                                            fontSize: '0.9rem',
                                            fontWeight: 500,
                                            '&:hover': {
                                                backgroundColor: '#282d4a'
                                            }
                                        }}
                                        size={'large'}
                                    >
                                        Update API Key
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
                                        sx={{
                                            textTransform: 'none',
                                            backgroundColor: '#1D2136',
                                            '&:hover': {
                                                backgroundColor: '#282d4a'
                                            },
                                            borderRadius: '8px',
                                            padding: '0.5rem 1.5rem',
                                            fontSize: '0.9rem',
                                            fontWeight: 500
                                        }}
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
                                        sx={{
                                            textTransform: 'none',
                                            backgroundColor: '#1D2136',
                                            '&:hover': {
                                                backgroundColor: '#282d4a'
                                            },
                                            borderRadius: '8px',
                                            padding: '0.5rem 1.5rem',
                                            fontSize: '0.9rem',
                                            fontWeight: 500
                                        }}
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