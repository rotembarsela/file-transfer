import { useLocation } from '@tanstack/react-router'
import RouterLink from '../ui/routerLink/RouterLink'

export const Heading = () => {
    const location = useLocation()

    const titles: { [key: string]: string } = {
        '/': 'Home',
        '/files': 'Files',
        '/settings': 'Settings',
        '/about': 'About Us',
        '/upload': 'Upload',
    }

    const currentTitle = titles[location.pathname] || 'Title'

    const isUploadPage = currentTitle === 'Upload'

    return (
        <div className="flex items-center justify-between gap-3">
            <h1 className="text-3xl font-bold lg:text-4xl">{currentTitle}</h1>
            {/* Filters/Search */}
            {!isUploadPage && <RouterLink to="/upload">Upload</RouterLink>}
        </div>
    )
}
