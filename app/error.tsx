'use client';

import Button from '@/components/ui/button';
import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Optionally log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <main className="flex h-full flex-col items-center justify-center">
            <h1 className="text-3xl font-bold">Oops!</h1>
            <h2 className="text-lg font-normal text-center mb-4">Ocurrió un error inesperado!</h2>
            <Button
                onClick={
                    // Attempt to recover by trying to re-render the route
                    () => reset()
                }
            >
                Reintentar
            </Button>
        </main>
    );
}