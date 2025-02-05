'use client';
import Login from '@/components/login/Login';
import { Toaster } from 'sonner';

export default function LoginPage() {
    return (
        <>
            <Toaster 
                position="top-right" 
                richColors 
                closeButton
            />
            <Login />
        </>
    );
} 