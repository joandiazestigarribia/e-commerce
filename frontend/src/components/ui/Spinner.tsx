interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const spinnerSizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-4',
    lg: 'h-12 w-12 border-4',
};

export const Spinner = ({ size = 'md', className = '' }: SpinnerProps) => {
    return (
        <div
            className={`animate-spin rounded-full border-gray-200 border-t-black ${spinnerSizes[size]} ${className}`}
        />
    )
};

export const FullPageSpinner = () => (
    <div className="flex items-center justify-center h-screen bg-white">
        <Spinner size="lg" />
    </div>
);