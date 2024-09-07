import { HTMLAttributes, PropsWithChildren } from 'react'

type PaperProps = PropsWithChildren & HTMLAttributes<HTMLDivElement>

export const Paper = ({ className, ...rest }: PaperProps) => {
    return (
        <div
            className={`px-3 py-4 border border-gray-100 ${className}`}
            {...rest}
        />
    )
}
