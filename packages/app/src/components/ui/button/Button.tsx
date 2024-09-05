import { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'
import { Size, Variant } from '../../../types'

type ButtonProps = {
    variant?: Variant
    size?: Size
} & ButtonHTMLAttributes<HTMLButtonElement>

function Button({
    variant = 'info',
    size = 'md',
    className,
    ...rest
}: ButtonProps) {
    const baseClasses = 'rounded font-medium focus:outline-none focus:ring'
    const variantClasses = {
        info: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-300',
        success:
            'bg-green-500 text-white hover:bg-green-600 focus:ring-green-300',
        danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-300',
        warning:
            'bg-yellow-500 text-black hover:bg-yellow-600 focus:ring-yellow-300',
    }

    const sizeClasses = {
        sm: 'px-2 py-1 text-sm',
        md: 'px-3 py-2 text-base',
        lg: 'px-4 py-3 text-lg',
        xl: 'px-6 py-4 text-xl',
    }

    return (
        <button
            className={clsx(
                baseClasses,
                variantClasses[variant],
                sizeClasses[size],
                className
            )}
            {...rest}
        />
    )
}

export default Button
