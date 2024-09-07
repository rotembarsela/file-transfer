import { Link } from '@tanstack/react-router'

const tabs = [
    { name: 'Files', path: '/files' },
    { name: 'Settings', path: '/settings' },
]

export const Sidebar = () => {
    return (
        <aside
            className="fixed top-0 left-0 w-64 h-full"
            aria-label="Main Sidebar"
        >
            <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50">
                <Link
                    id="sidebar-title"
                    className="block text-2xl font-semibold whitespace-nowrap cursor-pointer mb-4 text-center"
                    to="/"
                >
                    <span className="text-amber-500">A</span>utumn
                </Link>
                <ul
                    className="space-y-2 font-medium"
                    role="menu"
                    aria-labelledby="sidebar-title"
                >
                    {tabs.map((tab, index) => (
                        <li key={index} role="none">
                            <Link
                                to={tab.path}
                                className={`cursor-pointer flex items-center p-2 text-gray-900 rounded-lg group hover:bg-gray-100`}
                                activeProps={{
                                    className:
                                        'bg-gray-200 pointer-events-none hover:bg-transparent',
                                }}
                                role="menuitem"
                            >
                                {tab.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    )
}
