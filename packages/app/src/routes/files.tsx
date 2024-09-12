import { createFileRoute } from '@tanstack/react-router'
import { FilesTable } from '../components/filesTable.tsx'
import { IFile } from '../types/index.ts'
import { useEffect, useMemo, useState } from 'react'
import Button from '../components/ui/button/Button.tsx'
import { APIFetcher, utils } from '../utils'

export const Route = createFileRoute('/files')({
    component: Files,
})

function Files() {
    const [files, setFiles] = useState<IFile[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [uploadTimeDateFilter, setUploadedAtDateFilter] = useState('All')
    const [expiryTimeDateFilter, setExpiredAtDateFilter] = useState('All')

    const filteredRows = useMemo(() => {
        return files.filter((row) => {
            const { fileName, uploadTime, expiryTime } = row

            const matchesSearch = fileName
                .toLowerCase()
                .includes(searchTerm.toLowerCase())

            const matchesUploadedAtDate =
                uploadTimeDateFilter === 'All' ||
                utils.dates.formatDate(uploadTime) === uploadTimeDateFilter

            const matchesExpiredAtDate =
                expiryTimeDateFilter === 'All' ||
                utils.dates.formatDate(expiryTime) === expiryTimeDateFilter

            return (
                matchesSearch && matchesUploadedAtDate && matchesExpiredAtDate
            )
        })
    }, [files, searchTerm, uploadTimeDateFilter, expiryTimeDateFilter])

    const uniqueUploadedDates = useMemo(
        () =>
            Array.from(
                new Set(
                    files.map((file) => utils.dates.formatDate(file.uploadTime))
                )
            ),
        [files]
    )

    const uniqueExpiredDates = useMemo(
        () =>
            Array.from(
                new Set(
                    files.map((file) => utils.dates.formatDate(file.expiryTime))
                )
            ),
        [files]
    )

    const clearFilters = () => {
        if (
            searchTerm === '' &&
            uploadTimeDateFilter === 'All' &&
            expiryTimeDateFilter === 'All'
        ) {
            return
        }

        setSearchTerm('')
        setUploadedAtDateFilter('All')
        setExpiredAtDateFilter('All')
    }

    const handleFileDownload = async (row: IFile) => {
        try {
            const fileBlob = await APIFetcher<Blob, undefined>(
                `/download?id=${row.id}`,
                'GET'
            )

            const url = URL.createObjectURL(fileBlob)
            const link = document.createElement('a')
            link.href = url
            link.download = row.fileName
            document.body.appendChild(link)
            link.click()

            document.body.removeChild(link)
            URL.revokeObjectURL(url)
        } catch (error) {
            console.error('Error downloading file:', error)
        }
    }

    useEffect(() => {
        async function fetchFiles() {
            try {
                const filesResponse = await APIFetcher<IFile[], undefined>(
                    '/files',
                    'GET'
                )
                setFiles(filesResponse)
            } catch (error) {
                console.error(error)
            }
        }

        fetchFiles()
    }, [])

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <div className="flex items-center justify-end gap-3 p-4 bg-gray-100">
                <input
                    type="text"
                    placeholder="Search by Title"
                    className="p-2 border border-gray-300 rounded"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    className="p-2 border border-gray-300 rounded"
                    value={uploadTimeDateFilter}
                    onChange={(e) => setUploadedAtDateFilter(e.target.value)}
                >
                    <option value="All">All UploadedAt Dates</option>
                    {uniqueUploadedDates.map((date, index) => (
                        <option key={index} value={date}>
                            {date}
                        </option>
                    ))}
                </select>
                <select
                    className="p-2 border border-gray-300 rounded"
                    value={expiryTimeDateFilter}
                    onChange={(e) => setExpiredAtDateFilter(e.target.value)}
                >
                    <option value="All">All ExpiredAt Dates</option>
                    {uniqueExpiredDates.map((date, index) => (
                        <option key={index} value={date}>
                            {date}
                        </option>
                    ))}
                </select>
                <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
            <FilesTable
                files={{
                    theadRow: [
                        {
                            title: 'Title',
                            sortable: true,
                            accessor: 'fileName',
                        },
                        {
                            title: 'UploadedAt',
                            sortable: true,
                            accessor: 'uploadTime',
                        },
                        {
                            title: 'ExpiredAt',
                            sortable: true,
                            accessor: 'expiryTime',
                        },
                        { title: '', sortable: false, accessor: '' },
                    ],
                    tbodyRows: filteredRows,
                }}
                onFileDownload={(row) => {
                    handleFileDownload(row)
                }}
            />
        </div>
    )
}

export default Files
