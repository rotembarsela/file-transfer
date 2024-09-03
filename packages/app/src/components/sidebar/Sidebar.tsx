import { Link } from '@tanstack/react-router'

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
                    <li role="none">
                        <Link
                            to="/files"
                            className="cursor-pointer flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
                            role="menuitem"
                        >
                            Files
                        </Link>
                    </li>
                </ul>
            </div>
        </aside>
    )
}
