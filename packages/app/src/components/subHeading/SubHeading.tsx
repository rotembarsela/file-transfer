import { PropsWithChildren } from 'react'

type SubHeadingProps = {
    title: string
} & PropsWithChildren

export const SubHeading = ({ title, children }: SubHeadingProps) => {
    return (
        <div className="flex flex-col gap-3">
            <h2 className="text-2xl lg:text-3xl">{title}</h2>
            <hr />
            {children}
        </div>
    )
}
