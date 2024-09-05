import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/upload')({
    component: Upload,
})

function Upload() {
    return <div>Hello /upload!</div>
}
