<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FonnteService
{
    public function send(string $phone, string $message): array
    {
        $phone = preg_replace('/[^0-9]/', '', $phone);

        if (str_starts_with($phone, '0')) {
            $phone = '62' . substr($phone, 1);
        }

        $response = Http::withHeaders([
            'Authorization' => config('services.fonnte.token'),
        ])->post('https://api.fonnte.com/send', [
            'target' => $phone,
            'message' => $message,
        ]);

        if (!$response->successful()) {
            Log::error('Fonnte Send Failed', [
                'status' => $response->status(),
                'body'   => $response->body(),
            ]);
        }

        return [
            'success' => $response->successful(),
            'body' => $response->json(),
        ];
    }
}
