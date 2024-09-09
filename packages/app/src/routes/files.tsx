import { createFileRoute } from '@tanstack/react-router'
import { FilesTable } from '../components/filesTable.tsx'
import { IFile } from '../types/index.ts'
import { useEffect, useMemo, useState } from 'react'
import Button from '../components/ui/button/Button.tsx'
import { APIFetcher } from '../utils'

export const Route = createFileRoute('/files')({
    component: Files,
})

// const filesMock: IFilesTable = {
//     theadRow: ['Title', 'UploadedAt', 'ExpiredAt'],
//     tbodyRows: [
//         ['Report Q1', '2024-09-01', '2024-09-30'],
//         ['Invoice 2024', '2024-08-29', '2024-09-30'],
//         ['Project Plan', '2024-08-15', '2024-09-30'],
//         ['Budget Overview', '2024-09-02', '2024-09-30'],
//         ['Meeting Notes', '2024-09-03', '2024-09-30'],
//         ['Annual Summary', '2024-08-22', '2024-09-30'],
//         ['Sales Data', '2024-08-25', '2024-09-30'],
//         ['Marketing Plan', '2024-09-01', '2024-09-30'],
//         ['Client Feedback', '2024-08-28', '2024-09-30'],
//         ['Technical Specs', '2024-08-30', '2024-09-30'],
//         ['Quarterly Review', '2024-09-04', '2024-09-30'],
//         ['Employee Handbook', '2024-08-20', '2024-09-30'],
//         ['Product Launch', '2024-08-18', '2024-09-30'],
//         ['Customer Survey', '2024-08-21', '2024-09-30'],
//         ['Financial Report', '2024-09-05', '2024-09-30'],
//         ['Workshop Notes', '2024-09-06', '2024-09-30'],
//         ['Risk Assessment', '2024-08-24', '2024-09-30'],
//         ['Strategy Document', '2024-08-26', '2024-09-30'],
//         ['Audit Trail', '2024-08-19', '2024-09-30'],
//         ['Marketing Analysis', '2024-09-07', '2024-09-30'],
//     ],
// }

function Files() {
    const [files, setFiles] = useState<IFile[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [uploadedAtDateFilter, setUploadedAtDateFilter] = useState('All')
    const [expiredAtDateFilter, setExpiredAtDateFilter] = useState('All')

    const filteredRows = useMemo(() => {
        return files
            .filter((row) => {
                const { fileName, uploadTime, expiryTime } = row

                const matchesSearch = fileName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())

                const matchesUploadedAtDate =
                    uploadedAtDateFilter === 'All' ||
                    uploadTime === uploadedAtDateFilter

                const matchesExpiredAtDate =
                    expiredAtDateFilter === 'All' ||
                    expiryTime === expiredAtDateFilter

                return (
                    matchesSearch &&
                    matchesUploadedAtDate &&
                    matchesExpiredAtDate
                )
            })
            .map((row) => [row.fileName, row.uploadTime, row.expiryTime])
    }, [files, searchTerm, uploadedAtDateFilter, expiredAtDateFilter])

    const uniqueUploadedDates = useMemo(
        () => Array.from(new Set(files.map((file) => file.uploadTime))),
        [files]
    )
    const uniqueExpiredDates = useMemo(
        () => Array.from(new Set(files.map((file) => file.expiryTime))),
        [files]
    )

    const clearFilters = () => {
        if (
            searchTerm === '' &&
            uploadedAtDateFilter === 'All' &&
            expiredAtDateFilter === 'All'
        ) {
            return
        }

        setSearchTerm('')
        setUploadedAtDateFilter('All')
        setExpiredAtDateFilter('All')
    }

    useEffect(() => {
        async function fetchFiles() {
            try {
                const filesResponse = await APIFetcher<IFile[], undefined>(
                    'files',
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
                    value={uploadedAtDateFilter}
                    onChange={(e) => setUploadedAtDateFilter(e.target.value)}
                >
                    <option value="All">All Dates</option>
                    {uniqueUploadedDates.map((date, index) => (
                        <option key={index} value={date}>
                            {date}
                        </option>
                    ))}
                </select>
                <select
                    className="p-2 border border-gray-300 rounded"
                    value={expiredAtDateFilter}
                    onChange={(e) => setExpiredAtDateFilter(e.target.value)}
                >
                    <option value="All">All Statuses</option>
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
                    theadRow: ['Title', 'UploadedAt', 'ExpiredAt'],
                    tbodyRows: filteredRows,
                }}
            />
        </div>
    )
}
