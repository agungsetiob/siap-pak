import React, { useState, useEffect } from "react";
import { Modal, InputLabel, TextInput, InputError, PrimaryButton, SecondaryButton } from "@/Components";
import SearchableSelect from "@/Components/SearchableSelect";
import { useForm } from "@inertiajs/react";
import { CheckCircle, Calendar, Building2, FileText } from "lucide-react";

export default function CalibrationModal({ show, onClose, equipment, calibration = null }) {
  const isEdit = !!calibration;

  const { data, setData, post, processing, errors, reset } = useForm({
    id: calibration?.id || "",
    _method: isEdit ? "put" : "post",
    report_id: calibration?.report_id || "",
    certificate_number: calibration?.certificate_number || "",
    testing_institution: calibration?.testing_institution || "",
    calibration_date: calibration?.calibration_date?.substring(0, 10) || "",
    next_calibration_date: calibration?.next_calibration_date?.substring(0, 10) || "",
    result: calibration?.result || "laik",
    notes: calibration?.notes || "",
    certificate_file: null,
  });

  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    setSelectedReport(calibration?.report || null);
  }, [calibration]);

  const handleReportChange = (report) => {
    setSelectedReport(report);
    setData("report_id", report?.id || "");
  };

  const submit = (e) => {
    e.preventDefault();
    const routeName = isEdit ? route("calibrations.update", data.id) : route("calibrations.store", equipment.id);
    post(routeName, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  const reportOptions = equipment.reports || [];

  return (
    <Modal show={show} onClose={onClose} maxWidth="2xl">
      <form onSubmit={submit} className="p-6">
        <div className="flex items-center gap-3 border-b pb-4 mb-6">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl text-white">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {isEdit ? "Update Hasil Kalibrasi" : "Input Hasil Kalibrasi"}
            </h2>
            <p className="text-sm text-gray-500">
              {isEdit ? "Perbarui data kalibrasi alat" : "Tambahkan riwayat kalibrasi baru"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Tanggal Kalibrasi */}
          <div>
            <InputLabel htmlFor="calibration_date" value="Tanggal Pelaksanaan" required />
            <div className="relative mt-1">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <TextInput
                id="calibration_date"
                type="date"
                className="pl-10 block w-full rounded-xl border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                value={data.calibration_date}
                onChange={(e) => setData("calibration_date", e.target.value)}
                required
              />
            </div>
            <InputError message={errors.calibration_date} className="mt-2" />
          </div>

          {/* Tanggal Kalibrasi Berikutnya */}
          <div>
            <InputLabel htmlFor="next_calibration_date" value="Tgl Kalibrasi Berikutnya" required />
            <div className="relative mt-1">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <TextInput
                id="next_calibration_date"
                type="date"
                className="pl-10 block w-full rounded-xl border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                value={data.next_calibration_date}
                onChange={(e) => setData("next_calibration_date", e.target.value)}
                required
              />
            </div>
            <InputError message={errors.next_calibration_date} className="mt-2" />
          </div>

          {/* Lembaga Penguji */}
          <div>
            <InputLabel htmlFor="testing_institution" value="Lembaga Penguji / Vendor" />
            <div className="relative mt-1">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <TextInput
                id="testing_institution"
                type="text"
                className="pl-10 block w-full rounded-xl border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                value={data.testing_institution}
                onChange={(e) => setData("testing_institution", e.target.value)}
                placeholder="Cth: BPFK Surabaya"
              />
            </div>
          </div>

          {/* Nomor Sertifikat */}
          <div>
            <InputLabel htmlFor="certificate_number" value="Nomor Sertifikat" />
            <div className="relative mt-1">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <TextInput
                id="certificate_number"
                type="text"
                className="pl-10 block w-full rounded-xl border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                value={data.certificate_number}
                onChange={(e) => setData("certificate_number", e.target.value)}
              />
            </div>
          </div>

          {/* Hasil Kalibrasi */}
          <div>
            <InputLabel htmlFor="result" value="Hasil Kalibrasi" />
            <div className="relative mt-1">
              <select
                id="result"
                className="block w-full rounded-xl border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 py-2.5 px-4 appearance-none"
                value={data.result}
                onChange={(e) => setData("result", e.target.value)}
              >
                <option value="laik">✅ Laik</option>
                <option value="laik_dengan_catatan">⚠️ Laik Dengan Catatan</option>
                <option value="tidak_laik">❌ Tidak Laik</option>
              </select>
            </div>
          </div>

          {/* Upload Sertifikat */}
          <div>
            <InputLabel htmlFor="certificate_file" value={isEdit ? "Update Sertifikat (Opsional)" : "Upload Sertifikat"} />
            <input
              id="certificate_file"
              type="file"
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-200"
              onChange={(e) => setData("certificate_file", e.target.files[0])}
              accept=".pdf,.jpg,.jpeg,.png"
            />
            {isEdit && (
              <p className="text-xs text-gray-400 mt-1">Biarkan kosong jika tidak ingin mengubah file</p>
            )}
            <InputError message={errors.certificate_file} className="mt-2" />
          </div>

          {/* Referensi Tiket */}
          <div className="md:col-span-2">
            <SearchableSelect
              label="Referensi Tiket Perbaikan (Opsional)"
              options={reportOptions}
              value={selectedReport}
              onChange={handleReportChange}
              placeholder="Cari tiket..."
              displayValue={(report) =>
                `${report.ticket_number} - ${report.description.substring(0, 40)}${report.description.length > 40 ? "..." : ""}`
              }
            />
            <p className="text-xs text-gray-500 mt-1">Pilih tiket jika kalibrasi sebagai tindak lanjut laporan</p>
            <InputError message={errors.report_id} className="mt-2" />
          </div>

          {/* Catatan */}
          <div className="md:col-span-2">
            <InputLabel htmlFor="notes" value="Catatan / Keterangan" />
            <textarea
              id="notes"
              rows="2"
              className="mt-1 block w-full rounded-xl border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 py-2.5 px-4"
              value={data.notes}
              onChange={(e) => setData("notes", e.target.value)}
              placeholder="Catatan tambahan tentang kalibrasi..."
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end bg-gray-50 -mx-6 -mb-6 p-4 rounded-b-2xl border-t border-gray-100">
          <SecondaryButton type="button" onClick={onClose} className="rounded-xl">
            Batal
          </SecondaryButton>
          <PrimaryButton
            type="submit"
            className="ml-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl px-6 py-2.5 shadow-lg shadow-blue-500/20"
            disabled={processing}
          >
            {processing ? "Menyimpan..." : isEdit ? "Update Kalibrasi" : "Simpan Kalibrasi"}
          </PrimaryButton>
        </div>
      </form>
    </Modal>
  );
}