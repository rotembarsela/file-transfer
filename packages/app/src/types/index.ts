export interface IFile {
    fileName: string
    uploadTime: string
    expiryTime: string
}

export interface IFilesTable {
    theadRow: string[]
    tbodyRows: string[][]
}

export type Variant = 'info' | 'success' | 'danger' | 'warning'

export type Size = 'sm' | 'md' | 'lg' | 'xl'

export interface IUser {
    firstName: string
    surname: string
}
