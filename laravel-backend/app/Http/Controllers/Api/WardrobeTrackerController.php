<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class WardrobeTrackerController extends Controller
{
    /**
     * Get live telemetry from client's smart wardrobe sensors across residential estates.
     */
    public function getWardrobeTelemetry()
    {
        $residences = [
            [
                'id' => 'estate-tay-ho-hanoi',
                'name' => 'Tay Ho Lake Villa Master Wardrobe',
                'city' => 'Hanoi, Vietnam',
                'sensorId' => 'SENSOR-TH-084',
                'connected' => true,
                'lastPing' => '2 minutes ago',
                'currentTemperature' => 20.4,
                'targetTemperature' => 20.0,
                'currentHumidityPct' => 48.5,
                'targetHumidityPct' => 48.0,
                'airQualityAqi' => 12,
                'uvIndex' => 0.0,
                'mothRepellentLevelPct' => 88,
                'status' => 'OPTIMAL',
                'garmentsProtectedCount' => 34,
                'statusDescription' => 'Fiber equilibrium stable. Humidity and cedar terpenes in pristine balance.'
            ],
            [
                'id' => 'estate-district-1-hcmc',
                'name' => 'District 1 Penthouse Walk-In Chamber',
                'city' => 'Ho Chi Minh City, Vietnam',
                'sensorId' => 'SENSOR-SG-102',
                'connected' => true,
                'lastPing' => 'Just now',
                'currentTemperature' => 21.8,
                'targetTemperature' => 20.5,
                'currentHumidityPct' => 54.2,
                'targetHumidityPct' => 48.0,
                'airQualityAqi' => 18,
                'uvIndex' => 0.0,
                'mothRepellentLevelPct' => 74,
                'status' => 'ELEVATED_HUMIDITY',
                'garmentsProtectedCount' => 28,
                'statusDescription' => 'Slight tropical humidity spike (+6.2%). Dehumidification cycle initiated.'
            ],
            [
                'id' => 'estate-da-lat-chalet',
                'name' => 'Pine Crest Chalet Winter Vault',
                'city' => 'Da Lat, Vietnam',
                'sensorId' => 'SENSOR-DL-031',
                'connected' => true,
                'lastPing' => '15 minutes ago',
                'currentTemperature' => 17.2,
                'targetTemperature' => 18.5,
                'currentHumidityPct' => 46.0,
                'targetHumidityPct' => 47.0,
                'airQualityAqi' => 5,
                'uvIndex' => 0.0,
                'mothRepellentLevelPct' => 92,
                'status' => 'OPTIMAL',
                'garmentsProtectedCount' => 19,
                'statusDescription' => 'High altitude cool climate. Ideal preservation for heavy cashmere and vicuña.'
            ]
        ];

        $sensorHistory = [
            ['time' => '00:00', 'humidity' => 47.8, 'temp' => 20.1],
            ['time' => '04:00', 'humidity' => 48.2, 'temp' => 19.9],
            ['time' => '08:00', 'humidity' => 49.5, 'temp' => 20.4],
            ['time' => '12:00', 'humidity' => 52.1, 'temp' => 21.2],
            ['time' => '16:00', 'humidity' => 50.4, 'temp' => 21.0],
            ['time' => '20:00', 'humidity' => 48.5, 'temp' => 20.4]
        ];

        $thresholdStandards = [
            'optimalHumidityRange' => '45% - 52% RH',
            'dangerHumidityHigh' => 'Above 60% (Risk of mildew / mildew spores)',
            'dangerHumidityLow' => 'Below 40% (Risk of brittle silk filaments & leather cracking)',
            'optimalTempRange' => '18°C - 21°C',
            'airCirculationCycle' => 'Automated HEPA cycle every 4 hours'
        ];

        return response()->json([
            'success' => true,
            'residences' => $residences,
            'sensorHistory' => $sensorHistory,
            'thresholds' => $thresholdStandards,
            'smartSensorModel' => 'TVC Atelier MicroSensor Gen-4 (Swiss Sensirion SHT45 Chip)'
        ]);
    }

    /**
     * Trigger smart microclimate calibration or request an urgent sensor diagnostic dispatch.
     */
    public function calibrateWardrobe(Request $request)
    {
        $validated = $request->validate([
            'residence_id' => 'required|string',
            'action' => 'required|string|in:ACTIVATE_DEHUMIDIFIER,PULSE_HEPA_PURIFIER,DISPATCH_TECHNICIAN,REFILL_CEDAR_OIL',
            'target_humidity' => 'nullable|numeric|min:40|max:60'
        ]);

        $actionResponses = [
            'ACTIVATE_DEHUMIDIFIER' => 'Silent Peltier dehumidifier engaged. Projected return to 48% RH in 45 minutes.',
            'PULSE_HEPA_PURIFIER' => 'HEPA medical-grade air purge initiated. Micro-particulates being evacuated.',
            'DISPATCH_TECHNICIAN' => 'Atelier IoT Environmental Technician ticket generated. Confirmation sent to VIP Butler Desk.',
            'REFILL_CEDAR_OIL' => 'Automated ultrasonic diffuser released 15ml of organic Texas cedar terpene mist.'
        ];

        return response()->json([
            'success' => true,
            'message' => $actionResponses[$validated['action']] ?? 'Calibration routine executed.',
            'event' => [
                'event_id' => 'CLIM-' . strtoupper(Str::random(6)),
                'residence_id' => $validated['residence_id'],
                'action' => $validated['action'],
                'timestamp' => date('Y-m-d H:i:s'),
                'calibrated_status' => 'IN_PROGRESS'
            ]
        ]);
    }
}
