import { Card } from '../ui/card'

type FileCardProps = {
    fileType: '' | 'xlsx' | 'doc' | 'sh' | 'bat'
}

export const FileCard = ({ fileType }: FileCardProps) => {
    return (
        <Card title={String(fileType)}>
            <p>hello</p>
        </Card>
    )
}
