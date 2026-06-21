import { useState } from "react";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link, usePage } from "@inertiajs/react"; // Pastikan usePage di-import

export default function AuthenticatedLayout({ header, children }) {
    // 1. Ambil data user secara global dari Inertia props
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    // 2. Gunakan optional chaining (?.) agar lebih aman jika user belum termuat
    const isAdmin = user?.role === "admin";

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            {/* Logo & Branding SIMAK */}
                            <div className="shrink-0 flex items-center">
                                <Link
                                    href={route("dashboard")}
                                    className="flex items-center gap-2"
                                >
                                    <div className="w-8 h-8 bg-blue-600 text-white flex items-center justify-center rounded font-bold text-xl">
                                        +
                                    </div>
                                    <span className="font-bold text-xl tracking-tight text-gray-800">
                                        SIMAK
                                    </span>
                                </Link>
                            </div>

                            {/* Menu Navigasi Desktop */}
                            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                <NavLink
                                    href={route("dashboard")}
                                    active={route().current("dashboard")}
                                >
                                    Dashboard
                                </NavLink>

                                {/* Menu untuk Ruangan (Admin juga punya ini) */}
                                <NavLink
                                    href={route("equipments.index")}
                                    active={route().current("equipments.*")}
                                >
                                    Inventaris Alat
                                </NavLink>

                                {/* Menu khusus Admin */}
                                {isAdmin && (
                                    <>
                                        <NavLink
                                            href={route("rooms.index")}
                                            active={route().current("rooms.*")}
                                        >
                                            Master Ruangan
                                        </NavLink>
                                        <NavLink href={route('vendors.index')} active={route().current('vendors.*')}>
                                            Master Vendor
                                        </NavLink>
                                        <NavLink
                                            href={route("calibrations.index")}
                                            active={route().current(
                                                "calibrations.*",
                                            )}
                                        >
                                            Kalibrasi
                                        </NavLink>
                                        <NavLink
                                            href={route("users.index")}
                                            active={route().current("users.*")}
                                        >
                                            Pengguna
                                        </NavLink>
                                    </>
                                )}

                                {/* Menu untuk semua */}
                                <NavLink
                                    href={route("reports.index")}
                                    active={route().current("reports.*")}
                                >
                                    Tiket Laporan
                                </NavLink>
                            </div>
                        </div>

                        {/* Dropdown Profil (Kanan Atas) */}
                        <div className="hidden sm:flex sm:items-center sm:ml-6">
                            {/* --- AREA TOMBOL LONCENG NOTIFIKASI --- */}
                            <div className="ml-3 relative flex items-center">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button className="relative p-2 text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out focus:outline-none">
                                            <svg
                                                className="w-6 h-6"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                                />
                                            </svg>
                                            {/* Badge Angka Merah */}
                                            {usePage().props.auth.unread_count >
                                                0 && (
                                                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                                                        {
                                                            usePage().props.auth
                                                                .unread_count
                                                        }
                                                    </span>
                                                )}
                                        </button>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content align="right" width="80">
                                        <div className="block px-4 py-2 text-xs text-gray-400 font-bold uppercase border-b">
                                            Notifikasi Terbaru
                                        </div>

                                        {usePage().props.auth.notifications
                                            .length > 0 ? (
                                            <>
                                                {usePage().props.auth.notifications.map(
                                                    (notif) => (
                                                        <Dropdown.Link
                                                            key={notif.id}
                                                            href={route(
                                                                "notifications.read",
                                                                notif.id,
                                                            )}
                                                            className="border-b last:border-0 hover:bg-gray-50"
                                                        >
                                                            <div className="font-bold text-gray-800 text-sm">
                                                                {
                                                                    notif.data
                                                                        .title
                                                                }
                                                            </div>
                                                            <div className="text-xs text-gray-500 truncate max-w-[200px]">
                                                                {
                                                                    notif.data
                                                                        .message
                                                                }
                                                            </div>
                                                        </Dropdown.Link>
                                                    ),
                                                )}
                                                <div className="border-t border-gray-100">
                                                    <Link
                                                        href={route(
                                                            "notifications.markRead",
                                                        )}
                                                        method="post"
                                                        as="button"
                                                        className="block w-full text-center px-4 py-2 text-sm text-blue-600 hover:bg-gray-50 font-semibold"
                                                    >
                                                        Tandai Semua Dibaca
                                                    </Link>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="px-4 py-6 text-sm text-center text-gray-500">
                                                Tidak ada notifikasi baru.
                                            </div>
                                        )}
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                            {/* --- AKHIR AREA LONCENG --- */}
                            <div className="ml-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                {user?.name} ({user?.role})
                                                <svg
                                                    className="ml-2 -mr-0.5 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route("profile.edit")}
                                        >
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route("logout")}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* Tombol Hamburger untuk Mobile */}
                        <div className="-mr-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Menu Navigasi Mobile */}
                <div
                    className={
                        (showingNavigationDropdown ? "block" : "hidden") +
                        " sm:hidden"
                    }
                >
                    <div className="pt-2 pb-3 space-y-1">
                        <ResponsiveNavLink
                            href={route("dashboard")}
                            active={route().current("dashboard")}
                        >
                            Dashboard
                        </ResponsiveNavLink>
                        {isAdmin && (
                            <>
                                <ResponsiveNavLink
                                    href={route("equipments.index")}
                                    active={route().current("equipments.*")}
                                >
                                    Master Alat
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route("rooms.index")}
                                    active={route().current("rooms.*")}
                                >
                                    Master Ruangan
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route("calibrations.index")}
                                    active={route().current("calibrations.*")}
                                >
                                    Kalibrasi
                                </ResponsiveNavLink>
                            </>
                        )}
                        <ResponsiveNavLink
                            href={route("reports.index")}
                            active={route().current("reports.*")}
                        >
                            Tiket Laporan
                        </ResponsiveNavLink>
                    </div>

                    {/* Profil Mobile */}
                    <div className="pt-4 pb-1 border-t border-gray-200">
                        <div className="px-4">
                            <div className="font-medium text-base text-gray-800">
                                {user?.name}
                            </div>
                            <div className="font-medium text-sm text-gray-500">
                                {user?.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route("profile.edit")}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route("logout")}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Bagian Header Halaman */}
            {header && (
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            {/* Konten Utama */}
            <main>{children}</main>
        </div>
    );
}
