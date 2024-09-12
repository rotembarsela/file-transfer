import { createFileRoute } from '@tanstack/react-router'
import { Paper } from '../components/ui/paper'
import { Avatar } from '../components/ui/avatar'
import { ChangeEvent, useState } from 'react'
import { IUser } from '../types'

export const Route = createFileRoute('/profile')({
    component: Profile,
})

const initialUser: IUser = {
    firstName: 'john',
    surname: 'doe',
}

function Profile() {
    const [user, setUser] = useState<IUser>(initialUser)
    const [profileImage, setProfileImage] = useState<string | null>(null)

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setProfileImage(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    console.log(profileImage)

    return (
        <div className="h-full grid grid-cols-2 gap-3">
            <Paper className="flex flex-col gap-3">
                <div className="relative">
                    <Avatar size="lg">
                        <label className="absolute bottom-2 right-2 flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600 z-20">
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0"
                                onChange={handleFileChange}
                            />
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-4 h-4"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                        </label>
                    </Avatar>
                </div>
            </Paper>
            <Paper>test</Paper>
        </div>
    )
}
