'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface AuthGuardProps {
    children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
            router.replace('/login'); // replace ile geri tuşunu engelliyoruz
        }
    }, [router]);

    // Token kontrolü bitene kadar hiçbir şey render etmiyoruz
    if (isAuthenticated === null) return null;
    if (isAuthenticated === false) return null;

    return <>{children}</>;
}
