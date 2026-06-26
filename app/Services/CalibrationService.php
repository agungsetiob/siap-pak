<?php

namespace App\Services;

use App\Models\Calibration;
use App\Models\Equipment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CalibrationService
{
    public function rules(): array
    {
        return [
            'report_id'             => 'nullable|exists:reports,id',
            'certificate_number'    => 'nullable|string|max:255',
            'testing_institution'   => 'nullable|string|max:255',
            'calibration_date'      => 'required|date',
            'next_calibration_date' => 'required|date|after:calibration_date',
            'result'                => 'required|in:laik,tidak_laik,laik_dengan_catatan',
            'certificate_file'      => 'nullable|mimes:pdf,jpg,png|max:2048',
            'notes'                 => 'nullable|string',
        ];
    }

    public function store(Request $request, Equipment $equipment): Calibration
    {
        $filePath = $this->handleFileUpload($request);

        $calibration = $equipment->calibrations()->create([
            'report_id'             => $request->report_id,
            'certificate_number'    => $request->certificate_number,
            'certificate_file'      => $filePath,
            'testing_institution'   => $request->testing_institution,
            'calibration_date'      => $request->calibration_date,
            'next_calibration_date' => $request->next_calibration_date,
            'result'                => $request->result,
            'notes'                 => $request->notes,
            'created_by'            => auth()->id(),
        ]);

        $equipment->update([
            'next_calibration_date' => $request->next_calibration_date
        ]);

        return $calibration;
    }

    public function update(Request $request, Calibration $calibration): Calibration
    {
        $filePath = $this->handleFileUpload($request, $calibration->certificate_file);

        $calibration->update([
            'report_id'             => $request->report_id,
            'certificate_number'    => $request->certificate_number,
            'certificate_file'      => $filePath,
            'testing_institution'   => $request->testing_institution,
            'calibration_date'      => $request->calibration_date,
            'next_calibration_date' => $request->next_calibration_date,
            'result'                => $request->result,
            'notes'                 => $request->notes,
        ]);

        $equipment = $calibration->equipment;
        $latestCalibration = $equipment->calibrations()->latest('calibration_date')->first();

        if ($latestCalibration && $latestCalibration->id === $calibration->id) {
            $equipment->update([
                'next_calibration_date' => $request->next_calibration_date
            ]);
        }

        return $calibration;
    }

    private function handleFileUpload(Request $request, ?string $oldFile = null): ?string
    {
        if ($request->hasFile('certificate_file')) {
            if ($oldFile) {
                Storage::disk('public')->delete($oldFile);
            }
            return $request->file('certificate_file')->store('calibrations', 'public');
        }
        return $oldFile;
    }
}
