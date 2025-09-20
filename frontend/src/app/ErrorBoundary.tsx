import { useRouteError } from 'react-router-dom';

// TODO: Crear mensajes de error

export const RootErrorBoundary = () => {
    const error = useRouteError();
    const message =
        error instanceof Error
            ? error.message
            : typeof error === 'string'
                ? error
                : 'Error desconocido';
    return (
        <div className='flex items-center justify-center min-h-screen'>
            <div className='text-lg text-red-500'>
                Ocurrió un error: {message}
            </div>
        </div>
    )
}