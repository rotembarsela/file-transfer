import { useNavigate } from '@tanstack/react-router'
import { Avatar } from '../ui/avatar'

export const Header = () => {
    const navigate = useNavigate()

    function handleAvatarClick() {
        navigate({ to: '/settings' })
    }

    return (
        <header className="sticky top-0 left-0 px-3 py-4 flex items-center justify-end border-b border-gray-100">
            <Avatar onClick={handleAvatarClick} />
        </header>
    )
}
