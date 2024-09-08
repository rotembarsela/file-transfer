import { createFileRoute } from '@tanstack/react-router'
import { Paper } from '../components/ui/paper'
import { SubHeading } from '../components/subHeading'
import Button from '../components/ui/button/Button'

export const Route = createFileRoute('/settings')({
    component: Settings,
})

function Settings() {
    return (
        <Paper className="h-full flex flex-col gap-7">
            <SubHeading title="Darkmode">
                <p>Toggle dark mode:</p>
                <Button variant="warning" className="self-start">
                    Light
                </Button>
            </SubHeading>
            <SubHeading title="Signout">
                <Button variant="danger" className="self-start">
                    Signout
                </Button>
            </SubHeading>
        </Paper>
    )
}
