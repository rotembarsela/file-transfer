import { useState, useMemo, useEffect } from 'react'

type SortConfig = {
    key: number
    direction: 'asc' | 'desc'
}

type UseSortableTableProps = {
    rows: (string | number)[][]
}

type UseSortableTableReturn = {
    sortedRows: (string | number)[][]
    handleSort: (index: number) => void
    sortConfig: SortConfig | null
    getAriaSort: (index: number) => 'none' | 'ascending' | 'descending'
    getAriaLabel: (header: string, index: number) => string
}

export function useSortableTable({
    rows,
}: UseSortableTableProps): UseSortableTableReturn {
    const [sortConfig, setSortConfig] = useState<SortConfig | null>(null)

    useEffect(() => {
        setSortConfig(null)
    }, [rows])

    const getAriaSort = (
        index: number
    ): 'none' | 'ascending' | 'descending' => {
        if (!sortConfig) return 'none'
        if (sortConfig.key === index) {
            return sortConfig.direction === 'asc' ? 'ascending' : 'descending'
        }
        return 'none'
    }

    const getAriaLabel = (header: string, index: number): string => {
        if (!sortConfig || sortConfig.key !== index) {
            return `Sort by ${header}`
        }
        return `Sorted by ${header} in ${sortConfig.direction} order`
    }

    const sortedRows = useMemo(() => {
        if (!sortConfig) return rows

        return [...rows].sort((a, b) => {
            const aValue = a[sortConfig.key]
            const bValue = b[sortConfig.key]

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortConfig.direction === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue)
            } else if (
                typeof aValue === 'number' &&
                typeof bValue === 'number'
            ) {
                return sortConfig.direction === 'asc'
                    ? aValue - bValue
                    : bValue - aValue
            }
            return 0
        })
    }, [rows, sortConfig])

    const handleSort = (index: number) => {
        if (sortConfig?.key === index) {
            setSortConfig({
                key: index,
                direction: sortConfig.direction === 'asc' ? 'desc' : 'asc',
            })
        } else {
            setSortConfig({ key: index, direction: 'asc' })
        }
    }

    return { sortedRows, handleSort, sortConfig, getAriaSort, getAriaLabel }
}
