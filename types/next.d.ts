declare module 'next/navigation' {
    export function useRouter(): {
        push: (url: string) => void;
        back: () => void;
        // Add other methods you're using
    };
}

declare module 'next/link' {
    import { ComponentType } from 'react';
    const Link: ComponentType<{
        href: string;
        children: React.ReactNode;
        className?: string;
        [key: string]: any;
    }>;
    export default Link;
} 