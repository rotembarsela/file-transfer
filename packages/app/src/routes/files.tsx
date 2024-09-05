import { createFileRoute } from '@tanstack/react-router'
import { FilesTable } from '../components/filesTable.tsx'
import { IFilesTable } from '../types/index.ts'
import { useMemo, useState } from 'react'
import Button from '../components/ui/button/Button.tsx'

export const Route = createFileRoute('/files')({
    component: Files,
})

const files: IFilesTable = {
    theadRow: ['Title', 'UploadedAt', 'Status'],
    tbodyRows: [
        ['Report Q1', '2024-09-01', 'Uploaded'],
        ['Invoice 2024', '2024-08-29', 'Pending'],
        ['Project Plan', '2024-08-15', 'Uploaded'],
        ['Budget Overview', '2024-09-02', 'Pending'],
        ['Meeting Notes', '2024-09-03', 'Uploaded'],
        ['Annual Summary', '2024-08-22', 'Uploaded'],
        ['Sales Data', '2024-08-25', 'Pending'],
        ['Marketing Plan', '2024-09-01', 'Uploaded'],
        ['Client Feedback', '2024-08-28', 'Uploaded'],
        ['Technical Specs', '2024-08-30', 'Pending'],
        ['Quarterly Review', '2024-09-04', 'Uploaded'],
        ['Employee Handbook', '2024-08-20', 'Pending'],
        ['Product Launch', '2024-08-18', 'Uploaded'],
        ['Customer Survey', '2024-08-21', 'Pending'],
        ['Financial Report', '2024-09-05', 'Uploaded'],
        ['Workshop Notes', '2024-09-06', 'Uploaded'],
        ['Risk Assessment', '2024-08-24', 'Pending'],
        ['Strategy Document', '2024-08-26', 'Uploaded'],
        ['Audit Trail', '2024-08-19', 'Pending'],
        ['Marketing Analysis', '2024-09-07', 'Uploaded'],
    ],
}

function Files() {
    const { theadRow, tbodyRows } = files

    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('All')
    const [dateFilter, setDateFilter] = useState('All')

    const filteredRows = useMemo(() => {
        return tbodyRows.filter((row) => {
            const [title, uploadedAt, status] = row

            const matchesSearch = title
                .toLowerCase()
                .includes(searchTerm.toLowerCase())

            const matchesStatus =
                statusFilter === 'All' || status === statusFilter

            const matchesDate =
                dateFilter === 'All' || uploadedAt === dateFilter

            return matchesSearch && matchesStatus && matchesDate
        })
    }, [tbodyRows, searchTerm, statusFilter, dateFilter])

    const uniqueStatuses = useMemo(
        () => Array.from(new Set(tbodyRows.map((row) => row[2]))),
        [tbodyRows]
    )
    const uniqueDates = useMemo(
        () => Array.from(new Set(tbodyRows.map((row) => row[1]))),
        [tbodyRows]
    )

    const clearFilters = () => {
        if (
            searchTerm === '' &&
            statusFilter === 'All' &&
            dateFilter === 'All'
        ) {
            return
        }

        setSearchTerm('')
        setStatusFilter('All')
        setDateFilter('All')
    }

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
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                >
                    <option value="All">All Dates</option>
                    {uniqueDates.map((date, index) => (
                        <option key={index} value={date}>
                            {date}
                        </option>
                    ))}
                </select>
                <select
                    className="p-2 border border-gray-300 rounded"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="All">All Statuses</option>
                    {uniqueStatuses.map((status, index) => (
                        <option key={index} value={status}>
                            {status}
                        </option>
                    ))}
                </select>
                <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
            <FilesTable files={{ theadRow, tbodyRows: filteredRows }} />
        </div>
    )
}
