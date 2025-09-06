import { useRouteError } from 'react-router-dom';

// TODO: Crear mensajes de error

export const RootErrorBoundary = () => {
    const error = useRouteError() as any;
    return (
        <div className='flex items-center justify-center min-h-screen'>
            <div className='text-lg text-red-500'>
                Ocurrió un error: {error?.message || 'Error desconocido'}
            </div>
        </div>
    )
}