<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class EquipmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $equipment = $this->route('equipment');

        return [
            'room_id' => 'required|exists:rooms,id',
            'inventory_number' => [
                'required',
                'string',
                Rule::unique('equipments', 'inventory_number')->ignore($equipment),
            ],
            'name' => 'required|string|max:255',
            'brand' => 'nullable|string|max:255',
            'serial_number' => 'nullable|string|max:255',
            'condition' => 'required|in:baik,rusak_ringan,rusak_berat',
            'next_calibration_date' => 'nullable|date',
            'price' => 'nullable|numeric|min:0',
            'vendor_id' => 'nullable|exists:vendors,id',
        ];
    }
}