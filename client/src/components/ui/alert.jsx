export const Alert = ({ className = '', variant = 'default', ...props }) => {
    const variants = {
        default: 'bg-gray-100 text-gray-900',
        destructive: 'bg-red-100 text-red-900',
        success: 'bg-green-100 text-green-900',
        warning: 'bg-yellow-100 text-yellow-900'
    };

    return (
        <div
            role="alert"
            className={`relative w-full rounded-lg border p-4 ${variants[variant]} ${className}`}
            {...props}
        />
    );
};

export const AlertDescription = ({ className = '', ...props }) => {
    return (
        <div
            className={`text-sm [&_p]:leading-relaxed ${className}`}
            {...props}
        />
    );
};