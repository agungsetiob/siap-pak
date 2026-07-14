import { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    LayoutDashboard,
    Package,
    Building2,
    Calendar,
    Users,
    Ticket,
    Bell,
    LogOut,
    User,
    Menu,
    ChevronDown,
    Activity,
} from "lucide-react";
import Dropdown from "@/Components/Dropdown";
import ComingSoonModal from "@/Components/ComingSoonModal";

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [expandedMenus, setExpandedMenus] = useState({});

    const isAdmin = user?.role === "admin";

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsMobileSidebarOpen(false);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleSubmenu = (menuName) => {
        setExpandedMenus(prev => ({
            ...prev,
            [menuName]: !prev[menuName]
        }));
    };

    const navigation = {
        admin: [
            {
                name: "Dashboard",
                route: "dashboard",
                icon: LayoutDashboard,
                active: route().current("dashboard")
            },
            {
                name: "Manajemen Aset",
                icon: Package,
                submenus: [
                    {
                        name: "Inventaris Alat",
                        route: "equipments.index",
                        active: route().current("equipments.*")
                    },
                    {
                        name: "Master Ruangan",
                        route: "rooms.index",
                        active: route().current("rooms.*")
                    },
                    {
                        name: "Master Vendor",
                        route: "vendors.index",
                        active: route().current("vendors.*")
                    },
                    {
                        name: "Master Teknisi",
                        route: "technicians.index",
                        active: route().current("technicians.*")
                    }
                ]
            },
            {
                name: "Perawatan",
                icon: Calendar,
                submenus: [
                    {
                        name: "Pemeliharaan",
                        route: "maintenance-schedules.index",
                        active: route().current("maintenance-schedules.*")
                    },
                    {
                        name: "Kalibrasi",
                        route: "calibrations.index",
                        active: route().current("calibrations.*")
                    }
                ]
            },
            {
                name: "Laporan & Tiket",
                icon: Ticket,
                route: "reports.index",
                active: route().current("reports.*")
            },
            {
                name: "Manajemen Pengguna",
                icon: Users,
                route: "users.index",
                active: route().current("users.*")
            },
            {
                name: "Aspak",
                icon: Building2,
                route: "#",
                active: false,
                comingSoon: true
            },
            {
                name: "RSOnline",
                icon: Activity,
                route: "#",
                active: false,
                comingSoon: true
            }
        ],
        user: [
            {
                name: "Dashboard",
                route: "dashboard",
                icon: LayoutDashboard,
                active: route().current("dashboard")
            },
            {
                name: "Inventaris Alat",
                route: "equipments.index",
                icon: Package,
                active: route().current("equipments.*")
            },
            {
                name: "Laporan & Tiket",
                route: "reports.index",
                icon: Ticket,
                active: route().current("reports.*")
            },
            {
                name: "Pemeliharaan",
                route: "maintenance.index",
                icon: Calendar,
                active: route().current("maintenance.*")
            }
        ]
    };

    const currentNavigation = isAdmin ? navigation.admin : navigation.user;

    // Get notification data
    const notifications = usePage().props.auth.notifications || [];
    const unreadCount = usePage().props.auth.unread_count || 0;
    const [showComingSoon, setShowComingSoon] = useState(false);
    const [comingSoonName, setComingSoonName] = useState("");

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile Sidebar Overlay */}
            {isMobileSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsMobileSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50 transition-all duration-300 ease-in-out ${isSidebarOpen ? "w-64" : "w-20"
                    } ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
            >
                {/* Logo */}
                <div className={`h-16 flex items-center ${isSidebarOpen ? "px-6" : "px-4"} border-b border-gray-200`}>
                    <Link href={route("dashboard")} className="flex items-center gap-3 group">
                        <div className="relative w-9 h-auto">
                            {isSidebarOpen ? (
                                <img
                                    src="/logo_qr.png"
                                    alt="Logo"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.style.display = 'none';
                                        e.target.parentElement.innerHTML = '<span className="relative">+</span>';
                                    }}
                                />
                            ) : (
                                <img
                                    src="/logo_tanbu.png"
                                    alt="Logo"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.style.display = 'none';
                                        e.target.parentElement.innerHTML = '<span className="relative">+</span>';
                                    }}
                                />
                            )}
                        </div>
                        {isSidebarOpen && (
                            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                SIMEDI
                            </span>
                        )}
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="h-[calc(100vh-4rem)] overflow-y-auto overflow-x-hidden px-3 py-4">
                    {currentNavigation.map((item, index) => {
                        const Icon = item.icon;
                        const hasSubmenus = item.submenus && item.submenus.length > 0;
                        const isExpanded = expandedMenus[item.name] || false;
                        const isActive = item.active || (hasSubmenus && item.submenus.some(sub => sub.active));
                        const isComingSoon = item.comingSoon || false;

                        if (hasSubmenus) {
                            return (
                                <div key={index} className="mb-1">
                                    <button
                                        onClick={() => toggleSubmenu(item.name)}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${isActive
                                                ? "bg-blue-50 text-blue-700"
                                                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                            } ${!isSidebarOpen && "justify-center"}`}
                                        title={!isSidebarOpen ? item.name : ""}
                                    >
                                        <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-blue-600" : ""}`} />
                                        {isSidebarOpen && (
                                            <>
                                                <span className="flex-1 text-left text-sm font-medium">{item.name}</span>
                                                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                                            </>
                                        )}
                                    </button>
                                    {isSidebarOpen && isExpanded && (
                                        <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 pl-3">
                                            {item.submenus.map((sub, subIndex) => (
                                                <Link
                                                    key={subIndex}
                                                    href={route(sub.route)}
                                                    className={`block px-3 py-2 text-sm rounded-lg transition-all duration-200 ${sub.active
                                                            ? "bg-blue-50 text-blue-700 font-medium"
                                                            : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                                        }`}
                                                >
                                                    {sub.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        return (
                            <Link
                                key={index}
                                href={item.route === "#" ? "#" : route(item.route)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 mb-1 ${isComingSoon
                                        ? "text-gray-400 cursor-not-allowed opacity-60"
                                        : isActive
                                            ? "bg-blue-50 text-blue-700"
                                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                    } ${!isSidebarOpen && "justify-center"}`}
                                title={!isSidebarOpen ? item.name : ""}
                                onClick={(e) => {
                                    if (isComingSoon) {
                                        e.preventDefault();
                                        setComingSoonName(item.name);
                                        setShowComingSoon(true);
                                    }
                                }}
                            >
                                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive && !isComingSoon ? "text-blue-600" : ""}`} />
                                {isSidebarOpen && (
                                    <div className="flex items-center flex-1">
                                        <span className={`text-sm font-medium ${isComingSoon ? "text-gray-600" : ""}`}>
                                            {item.name}
                                        </span>
                                        {isComingSoon && (
                                            <span className="ml-2 text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                                                COMING SOON
                                            </span>
                                        )}
                                    </div>
                                )}
                            </Link>
                        );
                    })}

                    {/* Bottom Section */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200 bg-white">
                        {/* User Profile in Sidebar */}
                        <div className={`flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-all duration-200 ${!isSidebarOpen && "justify-center"}`}>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                                {user?.name?.charAt(0).toUpperCase() || "U"}
                            </div>
                            {isSidebarOpen && (
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-gray-800 truncate">{user?.name}</div>
                                    <div className="text-xs text-gray-500 truncate">{user?.email}</div>
                                </div>
                            )}
                        </div>

                        {isSidebarOpen && (
                            <div className="mt-2 space-y-1">
                                <Link
                                    href={route("profile.edit")}
                                    className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                                >
                                    <User className="w-4 h-4" />
                                    Profile
                                </Link>
                                <Link
                                    href={route("logout")}
                                    method="post"
                                    as="button"
                                    className="flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 w-full"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Log Out
                                </Link>
                            </div>
                        )}
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <div className={`transition-all duration-300 ${isSidebarOpen ? "lg:ml-64" : "lg:ml-20"}`}>
                {/* Top Navbar */}
                <header className={`sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200 transition-all duration-300 ${isScrolled ? "shadow-sm" : ""
                    }`}>
                    <div className="flex items-center justify-between h-16 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                            {/* Toggle Sidebar Button */}
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="hidden lg:flex p-2 rounded-xl hover:bg-gray-100 transition-all duration-200"
                            >
                                <Menu className="w-5 h-5 text-gray-600" />
                            </button>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMobileSidebarOpen(true)}
                                className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-all duration-200"
                            >
                                <Menu className="w-5 h-5 text-gray-600" />
                            </button>

                            {/* Page Title */}
                            {header && (
                                <div className="flex items-center gap-3">
                                    <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full hidden sm:block"></div>
                                    <div className="text-xl font-bold text-gray-800 truncate">
                                        {header}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button className="p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 relative">
                                            <Bell className="w-6 h-6 text-emerald-600" />
                                            {unreadCount > 0 && (
                                                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-lg shadow-red-500/30">
                                                    {unreadCount}
                                                </span>
                                            )}
                                        </button>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content
                                        align="right"
                                        width="w-[85vw] sm:w-[300px] lg:w-[400px]"
                                    >
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-sm font-semibold text-gray-800">Notifikasi</h3>
                                                </div>
                                                {unreadCount > 0 && (
                                                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                                                        {unreadCount} belum dibaca
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {notifications.length > 0 ? (
                                            <>
                                                <div className="max-h-[400px] overflow-y-auto">
                                                    {notifications.slice(0, 10).map((notif, index) => (
                                                        <Link
                                                            key={notif.id || index}
                                                            href={route("notifications.read", notif.id)}
                                                            className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors duration-150"
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500 flex-shrink-0"></div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="font-semibold text-sm text-gray-800 break-words">
                                                                        {notif.data?.title || "Notifikasi"}
                                                                    </div>
                                                                    <div className="text-xs text-gray-500 mt-0.5 line-clamp-3 break-words">
                                                                        {notif.data?.message || "Pesan notifikasi"}
                                                                    </div>
                                                                    <div className="text-[10px] text-gray-400 mt-1">
                                                                        {notif.created_at
                                                                            ? new Date(notif.created_at).toLocaleDateString('id-ID', {
                                                                                day: 'numeric',
                                                                                month: 'long',
                                                                                year: 'numeric',
                                                                                hour: '2-digit',
                                                                                minute: '2-digit'
                                                                            })
                                                                            : "Baru saja"
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>

                                                {notifications.length > 10 && (
                                                    <div className="px-4 py-2 text-center text-xs text-gray-500 border-t border-gray-100">
                                                        +{notifications.length - 10} notifikasi lainnya
                                                    </div>
                                                )}

                                                <div className="border-t border-gray-100">
                                                    <Link
                                                        href={route("notifications.markRead")}
                                                        method="post"
                                                        as="button"
                                                        className="block w-full text-center px-4 py-3 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors duration-150 rounded-b-lg"
                                                    >
                                                        Tandai Semua Dibaca
                                                    </Link>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="px-4 py-10 text-center">
                                                <Bell className="w-14 h-14 mx-auto text-emerald-600 mb-3" />
                                                <p className="text-sm font-medium text-gray-600">Tidak ada notifikasi</p>
                                                <p className="text-xs text-gray-400 mt-1">Semua notifikasi akan muncul di sini</p>
                                            </div>
                                        )}
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>

                            {/* User Menu (Mobile) */}
                            <div>
                                <button className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-100 transition-all duration-200">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
                                        {user?.name?.charAt(0).toUpperCase() || "U"}
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 sm:p-6">
                    <div className="animate-fadeIn">
                        {children}
                    </div>
                </main>
                <ComingSoonModal
                    show={showComingSoon}
                    onClose={() => setShowComingSoon(false)}
                    featureName={comingSoonName}
                />
            </div>

            {/* Custom Styles */}
            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
                
                /* Custom scrollbar */
                nav::-webkit-scrollbar {
                    width: 4px;
                }
                nav::-webkit-scrollbar-track {
                    background: transparent;
                }
                nav::-webkit-scrollbar-thumb {
                    background: #d1d5db;
                    border-radius: 2px;
                }
                nav::-webkit-scrollbar-thumb:hover {
                    background: #9ca3af;
                }
                
                /* Notification scrollbar */
                .max-h-\\[400px\\]::-webkit-scrollbar {
                    width: 4px;
                }
                .max-h-\\[400px\\]::-webkit-scrollbar-track {
                    background: transparent;
                }
                .max-h-\\[400px\\]::-webkit-scrollbar-thumb {
                    background: #d1d5db;
                    border-radius: 2px;
                }
                .max-h-\\[400px\\]::-webkit-scrollbar-thumb:hover {
                    background: #9ca3af;
                }
            `}</style>
        </div>
    );
}