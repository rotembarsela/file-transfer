import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ChangeEvent, useState } from 'react'
import { APIFetcher } from '../utils'
import Button from '../components/ui/button/Button'
import { Paper } from '../components/ui/paper'

export const Route = createFileRoute('/upload')({
    component: Upload,
})

function Upload() {
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)

    const navigate = useNavigate()

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setSelectedFiles(event.target.files)
        }
    }

    async function uploadFiles() {
        if (!selectedFiles) return

        const formData = new FormData()

        Array.from(selectedFiles).forEach((file) => {
            formData.append('file', file)
        })

        try {
            await APIFetcher('/upload', 'POST', formData)

            navigate({ to: '/files' })
        } catch (error) {
            console.error('Error uploading files:', error)
        }
    }

    return (
        <Paper>
            <div className="flex flex-col items-start">
                <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="mb-4 p-2 border border-gray-300 rounded"
                />
                <Button onClick={uploadFiles}>Upload Files</Button>
            </div>
        </Paper>
    )
}
