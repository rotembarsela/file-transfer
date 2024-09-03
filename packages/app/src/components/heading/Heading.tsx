import { useLocation } from '@tanstack/react-router'

export const Heading = () => {
    const location = useLocation()

    const titles: { [key: string]: string } = {
        '/': 'Home',
        '/files': 'Files',
        '/settings': 'Settings',
        '/about': 'About Us',
    }

    const currentTitle = titles[location.pathname] || 'Title'

    return (
        <div>
            <h1 className="text-3xl font-bold lg:text-4xl">{currentTitle}</h1>
            {/* Filters/Search */}
        </div>
    )
}
