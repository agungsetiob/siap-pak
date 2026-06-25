import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import UpdateSignatureForm from './Partials/UpdateSignatureForm';
import FlashMessage from '@/Components/FlashMessage';
import React from 'react';

export default function Edit({ mustVerifyEmail, status, flash }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Profil Saya
                </h2>
            }
        >
            <Head title="Profil" />

            <div className="py-2">
                <div className="mx-auto max-w-8xl sm:px-4 lg:px-4">
                    <FlashMessage flash={flash} />
                    <div className="grid grid-cols-1 gap-6  bg-white p-6 border border-gray-200 rounded-2xl">

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                                className="w-full" 
                            />
                            <UpdatePasswordForm className="w-full" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                            <UpdateSignatureForm className="w-full" />
                            <DeleteUserForm className="w-full" />
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}