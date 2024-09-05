import { Link, LinkProps } from '@tanstack/react-router'
import clsx from 'clsx'

type RouterLinkProps = {
    variant?: 'primary' | 'secondary'
    className?: string
} & LinkProps

const RouterLink = ({
    variant = 'primary',
    className,
    ...rest
}: RouterLinkProps) => {
    const baseClasses = 'font-medium underline'
    const variantClasses = {
        primary: 'text-blue-600 hover:text-blue-800',
        secondary: 'text-gray-600 hover:text-gray-800',
    }

    return (
        <Link
            className={clsx(baseClasses, variantClasses[variant], className)}
            {...rest}
        />
    )
}

export default RouterLink
