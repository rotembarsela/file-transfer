import { lazy, Suspense } from 'react'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Header } from '../components/header'
import { Footer } from '../components/footer'
import { Sidebar } from '../components/sidebar'
import { Heading } from '../components/heading'

const TanStackRouterDevtools =
    import.meta.env.NODE_ENV === 'production'
        ? () => null // Render nothing in production
        : lazy(() =>
              // Lazy load in development
              import('@tanstack/router-devtools').then((res) => ({
                  default: res.TanStackRouterDevtools,
                  // For Embedded Mode
                  // default: res.TanStackRouterDevtoolsPanel
              }))
          )

export const Route = createRootRoute({
    component: () => (
        <>
            <div className="min-h-[100dvh] grid grid-rows-[auto_1fr_auto] ml-64">
                <Header />
                <main className="max-w-[97%] w-full mx-auto my-6">
                    <Heading />
                    <Outlet />
                </main>
                <Footer />
                <Suspense>
                    <TanStackRouterDevtools />
                </Suspense>
            </div>
            <Sidebar />
        </>
    ),
})
