import { Link } from '@tanstack/react-router'
import { PropsWithChildren } from 'react'

type AvatarProps = {
    size?: 'sm' | 'md' | 'lg'
    isLink?: boolean
} & PropsWithChildren

export const Avatar = ({ children, size = 'sm', isLink }: AvatarProps) => {
    const sizeClasses = {
        sm: 'w-10 h-10',
        md: 'w-20 h-20',
        lg: 'w-52 h-52',
    }

    const selectedSize = sizeClasses[size]

    const AvatarContent = (
        <>
            {AvatarSvg}
            {children}
        </>
    )

    return !isLink ? (
        <div
            className={`relative overflow-hidden bg-gray-100 rounded-md ${selectedSize}`}
        >
            {AvatarContent}
        </div>
    ) : (
        <Link
            className={`relative overflow-hidden bg-gray-100 rounded-full ${selectedSize}`}
            to="/profile"
        >
            {AvatarContent}
        </Link>
    )
}

const AvatarSvg = (
    <svg
        className="absolute w-full h-full text-gray-400 z-10"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            fillRule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clipRule="evenodd"
        ></path>
    </svg>
)
