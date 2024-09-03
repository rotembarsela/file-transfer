import { createLazyFileRoute } from '@tanstack/react-router'
import { FileCard } from '../components/fileCard'

export const Route = createLazyFileRoute('/')({
    component: Index,
})

function Index() {
    return (
        <div>
            <div>
                <h3>New uploaded files</h3>
                <div className="grid grid-cols-3 gap-3">
                    <FileCard fileType="xlsx" />
                    <FileCard fileType="doc" />
                    <FileCard fileType="sh" />
                </div>
            </div>
        </div>
    )
}
