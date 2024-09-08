import { Avatar } from '../ui/avatar'

export const Header = () => {
    return (
        <header className="sticky top-0 left-0 z-10 px-3 py-4 flex items-center justify-end border-b border-gray-100 bg-white">
            <Avatar isLink />
        </header>
    )
}
