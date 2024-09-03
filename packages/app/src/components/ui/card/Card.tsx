import { PropsWithChildren } from 'react'

type CardProps = {
    title: string
    description?: string | undefined
} & PropsWithChildren

export const Card = ({ title, description, children }: CardProps) => {
    return (
        <div className="relative rounded-sm border border-gray-100 shadow-sm p-3">
            <Kebab onClick={() => alert('test')} />
            <span>{title}</span>
            {description && <p>{description}</p>}
            {children}
        </div>
    )
}

type KebabProps = {
    onClick: () => void
}

const Kebab = ({ onClick }: KebabProps) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 16 16"
            className="absolute top-3 right-3 cursor-pointer"
            onClick={onClick}
            tabIndex={0}
        >
            <g
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
            >
                <circle cx="8" cy="2.5" r=".75" />
                <circle cx="8" cy="8" r=".75" />
                <circle cx="8" cy="13.5" r=".75" />
            </g>
        </svg>
    )
}
