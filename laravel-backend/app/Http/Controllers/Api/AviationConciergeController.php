<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AviationConciergeController extends Controller
{
    /**
     * Get private aviation terminal hubs, fleet categories, and bespoke transit amenities.
     */
    public function getAviationHubs()
    {
        $aviationHubs = [
            [
                'id' => 'hub-vvnb-hanoi',
                'name' => 'Noi Bai International FBO Terminal',
                'icao' => 'VVNB',
                'city' => 'Hanoi, Vietnam',
                'terminal' => 'VIP VIP Lounge & Private Jet Apron Gate 01',
                'clearanceTimeMin' => 15,
                'limousineFleet' => 'Maybach S680 Haute Voilure & Rolls-Royce Phantom VIII',
                'atelierService' => 'Direct wardrobe transfer from Tay Ho Salon into aircraft cabin hanging locker',
                'image' => 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1000&q=80'
            ],
            [
                'id' => 'hub-vvs-hcmc',
                'name' => 'Tan Son Nhat Private Aviation Center',
                'icao' => 'VVTS',
                'city' => 'Ho Chi Minh City, Vietnam',
                'terminal' => 'General Aviation Terminal & Helipad Suite',
                'clearanceTimeMin' => 12,
                'limousineFleet' => 'Rolls-Royce Spectre & Bentley Flying Spur Mulliner',
                'atelierService' => 'Pre-flight garment steaming and on-tarmac luggage transfer',
                'image' => 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1000&q=80'
            ],
            [
                'id' => 'hub-lsgg-geneva',
                'name' => 'Geneva Cointrin VIP FBO (TAG Aviation)',
                'icao' => 'LSGG',
                'city' => 'Geneva, Switzerland',
                'terminal' => 'Swiss Private Bank Curated Terminal 3',
                'clearanceTimeMin' => 10,
                'limousineFleet' => 'Range Rover SV Bespoke & Maybach S-Class',
                'atelierService' => 'Direct courier pickup to Saint-Moritz Chalet or Lake Como Villa',
                'image' => 'https://images.unsplash.com/photo-1520437358207-323b43b50729?auto=format&fit=crop&w=1000&q=80'
            ],
            [
                'id' => 'hub-lfmn-nice',
                'name' => 'Nice Côte d’Azur Aviation d’Affaires',
                'icao' => 'LFMN',
                'city' => 'Nice / Monaco, France',
                'terminal' => 'Terminal 2 Heliport Monaco Direct Connection',
                'clearanceTimeMin' => 8,
                'limousineFleet' => 'Mercedes-Maybach EQS 680 SUV',
                'atelierService' => 'Runway gala dressing assistant awaiting at Monaco Yacht Club suite',
                'image' => 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&w=1000&q=80'
            ]
        ];

        $transitFleet = [
            [
                'id' => 'gulfstream-g700',
                'name' => 'Gulfstream G700 Ultra-Long-Range Flagship',
                'rangeKm' => '13,890 km (Non-Stop Hanoi to Paris / London)',
                'capacity' => '14 Bespoke Leather Club Seats + Master Stateroom',
                'cabinAltitude' => '2,914 ft at FL410 (Zero Jetlag Oxygenation)',
                'wardrobeAmenity' => 'Full-height cedar-paneled hanging closet with integrated micro-steamer',
                'hourlyRateEstimateVnd' => 380000000
            ],
            [
                'id' => 'bombardier-global-7500',
                'name' => 'Bombardier Global 7500 Executive Suite',
                'rangeKm' => '14,260 km (Longest Range in Business Aviation)',
                'capacity' => '4 Distinct Living Spaces with Nuage Ergonomic Seating',
                'cabinAltitude' => 'Puristic HEPA filtration and circadian lighting',
                'wardrobeAmenity' => 'Bespoke velvet-lined garment drawers & humidity-balanced travel trunk lock',
                'hourlyRateEstimateVnd' => 410000000
            ]
        ];

        $vipProtocolRules = [
            'tarmacEscort' => 'Full ramp apron security clearance with private tarmac vehicle escort directly to the airstairs.',
            'customsFastTrack' => 'Diplomatic and VIP immigration fast-track processed within the private lounge while sipping Grand Cru vintage champagne.',
            'luggageHandling' => 'Zero-handling baggage transfer: TVC wardrobe trunks loaded directly into cargo hold with white-glove care.'
        ];

        return response()->json([
            'success' => true,
            'hubs' => $aviationHubs,
            'fleet' => $transitFleet,
            'protocol' => $vipProtocolRules,
            'conciergeDesk' => '+84 24 3988 8899 (VIP Aviation Dispatch 24/7)'
        ]);
    }

    /**
     * Book private aviation tarmac escort, wardrobe transfer, and FBO reception.
     */
    public function requestAviationTransit(Request $request)
    {
        $validated = $request->validate([
            'client_name' => 'required|string|max:100',
            'client_email' => 'required|email',
            'client_phone' => 'required|string',
            'hub_id' => 'required|string',
            'tail_number' => 'nullable|string|max:20',
            'flight_date' => 'required|string',
            'flight_time' => 'required|string',
            'passenger_count' => 'required|numeric|min:1|max:16',
            'wardrobe_pieces_count' => 'required|numeric|min:1|max:30',
            'special_catering_notes' => 'nullable|string|max:500'
        ]);

        $dossierCode = 'AV-TRANSIT-' . strtoupper(Str::random(6)) . '-' . date('Y');
        $gateOfficer = 'Commander Eric Marchand (VIP Ramp Operations)';

        return response()->json([
            'success' => true,
            'message' => 'Private aviation transit protocol engaged.',
            'dossier' => [
                'dossier_code' => $dossierCode,
                'client_name' => $validated['client_name'],
                'hub_id' => $validated['hub_id'],
                'flight_date' => $validated['flight_date'],
                'flight_time' => $validated['flight_time'],
                'passenger_count' => (int) $validated['passenger_count'],
                'wardrobe_pieces_count' => (int) $validated['wardrobe_pieces_count'],
                'assigned_officer' => $gateOfficer,
                'status' => 'FBO_RAMP_CLEARANCE_SCHEDULED',
                'timestamp' => date('Y-m-d H:i:s')
            ]
        ]);
    }
}
