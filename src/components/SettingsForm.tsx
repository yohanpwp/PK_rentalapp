'use client'
import { SettingsFormData, settingsSchema } from '@/lib/schemas'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from './ui/form'
import { CustomFormField } from './FormField'
import { Button } from './ui/button'

const SettingsForm = ({
    inititalData,
    onSubmit,
    userType
} : SettingsFormProps) => {
    const [editMode, setEditMode] = useState(false)
    const form = useForm<SettingsFormData>({
        resolver: zodResolver(settingsSchema),
        defaultValues: inititalData
    })

    const toggleEditMode = () => {
        setEditMode(!editMode);
        if (editMode) {
            form.reset(inititalData)
        }
    }

    const handleSubmit = async (data: SettingsFormData) => {
        try {
            await onSubmit(data)
            setEditMode(false)
        } catch (error) {
            console.error(error)
        }
    }

  return (
    <div className='pt-8 pb-5 px-8'>
        <div className='mb-5'>
            <h1 className='text-xl font-semibold'>
                { userType.charAt(0).toUpperCase() + userType.slice(1)}
            </h1>
            <p className='text-sm text-gray-500 mt-1'>
                Manage your account preferences and personal informaton. 
            </p>
        </div>
        <div className='bg-white rounded-xl p-6'>
            <Form {...form} >
                <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className='space-y-6'>
                    <CustomFormField name='name' label='Name' disabled={!editMode} />
                    <CustomFormField name='email' label='E-mail' type='email' disabled={!editMode} />
                    <CustomFormField name='phoneNumber' label='Phone Number' disabled={!editMode} />
                    <div className='pt-4 flex justify-between'>
                        <Button
                        type='submit'
                        onClick={toggleEditMode}
                        className='bg-secondary-700 text-white hover:bg-secondary-600'>
                            { editMode ? 'Cancel' : 'Edit'}
                        </Button>
                        { editMode && (
                            <Button
                            type='submit'
                            onClick={toggleEditMode}
                            className='bg-primary-700 text-white hover:bg-primary-800'>
                                Save Changes
                            </Button>
                        )}
                    </div>
                </form>
            </Form>
        </div>
    </div>
  )
}

export default SettingsForm