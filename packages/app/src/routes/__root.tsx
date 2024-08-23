import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Header } from '../components/header'
import { Footer } from '../components/footer'
import { lazy, Suspense } from 'react'

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
        <div>
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
            <Suspense>
                <TanStackRouterDevtools />
            </Suspense>
        </div>
    ),
})
