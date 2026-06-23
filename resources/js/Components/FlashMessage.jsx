import { useEffect, useState } from "react";
import { CheckCircle, AlertCircle, Info } from "lucide-react";

export default function FlashMessage({ flash }) {
    const [visible, setVisible] = useState(flash);

    useEffect(() => {
        if (flash) {
            setVisible(flash);
            const timer = setTimeout(() => {
                setVisible(null);
            }, 5000); // 5 detik
            return () => clearTimeout(timer);
        }
    }, [flash]);

    if (!visible) return null;

    return (
        <div className="space-y-3 mb-4">
            {visible.success && (
                <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-xl shadow-sm flex items-start gap-3">
                    <CheckCircle className="w-10 h-10 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-bold">Berhasil</p>
                        <p className="text-sm">{visible.success}</p>
                    </div>
                </div>
            )}

            {visible.error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl shadow-sm flex items-start gap-3">
                    <AlertCircle className="w-10 h-10 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-bold">Gagal</p>
                        <p className="text-sm">{visible.error}</p>
                    </div>
                </div>
            )}

            {visible.info && (
                <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 rounded-xl shadow-sm flex items-start gap-3">
                    <Info className="w-10 h-10 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-bold">Info</p>
                        <p className="text-sm">{visible.info}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
