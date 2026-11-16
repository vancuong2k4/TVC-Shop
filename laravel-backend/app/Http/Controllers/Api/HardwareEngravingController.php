<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class HardwareEngravingController extends Controller
{
    /**
     * Get haute horlogerie hardware catalogue, precious metals, engraving fonts, and hallmark stamps.
     */
    public function getHardwareCatalog()
    {
        $metals = [
            [
                'id' => 'grade5-titanium-dlc',
                'name' => 'Grade 5 Aerospace Titanium with Diamond-Like Carbon (DLC)',
                'origin' => 'Le Locle, Switzerland',
                'hardness' => 'Vickers 3,200 HV (Scratch-Proof)',
                'surcharge' => 3800000,
                'hex' => '#2A2A2A',
                'texture' => 'Satin-Brushed Anthracite',
                'description' => 'Lightweight high-tensile titanium with micro-bead blast and vapor-deposited carbon coating.'
            ],
            [
                'id' => 'solid-18k-rose-gold',
                'name' => 'Solid 18K 4N Rose Gold Alloy',
                'origin' => 'Geneva Precious Metal Foundry',
                'hardness' => 'Vickers 170 HV (Lustrous Heirloom)',
                'surcharge' => 7500000,
                'hex' => '#B76E79',
                'texture' => 'Mirror-Polished Warm Aurum',
                'description' => 'Alloyed with 75% pure gold and 20% copper for warm, non-fading archival patina.'
            ],
            [
                'id' => 'palladium-ruthenium',
                'name' => 'Platinum 950 & Ruthenium Micro-Plating',
                'origin' => 'Pforzheim Guild, Germany',
                'hardness' => 'Vickers 850 HV',
                'surcharge' => 5200000,
                'hex' => '#D8D8D8',
                'texture' => 'Sunburst Guilloché White Luster',
                'description' => 'Ultra-white refractive sheen that will never tarnish under extreme sea air or humidity.'
            ],
            [
                'id' => 'patinated-naval-bronze',
                'name' => 'CuSn8 Marine Phosphor Bronze',
                'origin' => 'Venetian Maritime Foundry',
                'hardness' => 'Vickers 220 HV (Living Metal)',
                'surcharge' => 2900000,
                'hex' => '#CD7F32',
                'texture' => 'Hand-Stippled Raw Bronze',
                'description' => 'Develops an individual emerald verdigris patina uniquely tuned to the wearer’s natural skin oils.'
            ]
        ];

        $components = [
            [
                'id' => 'raccagni-zipper-pull',
                'name' => 'Artisanal Double-Sided Zipper Pull',
                'garmentTypes' => ['Cashmere Parka', 'Leather Flight Jacket', 'Overcoat'],
                'maxChars' => 12,
                'depth' => '0.35mm Deep Fiber Laser Carve',
                'previewScale' => 'Large Puller (45mm)'
            ],
            [
                'id' => 'horn-button-core',
                'name' => 'Water Buffalo Horn Center Inlay Button (Set of 6)',
                'garmentTypes' => ['Double-Breasted Trench', 'Bespoke Blazer'],
                'maxChars' => 4,
                'depth' => '0.20mm Micro-Script Perimeter',
                'previewScale' => 'Button Face (22mm)'
            ],
            [
                'id' => 'collar-throat-latch',
                'name' => 'Under-Collar Hinged Throat Latch Buckle',
                'garmentTypes' => ['Storm Trench Coat', 'Vicuña Greatcoat'],
                'maxChars' => 18,
                'depth' => '0.40mm Architectural Bevel Cut',
                'previewScale' => 'Buckle Bridge (55mm)'
            ],
            [
                'id' => 'lining-suspension-chain',
                'name' => 'Heavy Curb-Link Coat Suspension Chain',
                'garmentTypes' => ['Archival Overcoats', 'Formal Evening Mantle'],
                'maxChars' => 16,
                'depth' => '0.50mm Diamond-Point Rotary Engrave',
                'previewScale' => 'Archival Plaque (35mm)'
            ]
        ];

        $hallmarkPunches = [
            [
                'id' => 'geneva-seal-crest',
                'title' => 'Poinçon d’Atelier TVC',
                'description' => 'Official guild hallmark stamped under 50-ton hydraulic press to authenticate metal purity.',
                'surcharge' => 1200000
            ],
            [
                'id' => 'coordinate-celestial',
                'title' => 'Navigational Longitude Cipher',
                'description' => 'Precise GPS degrees and seconds marking the commissioning flagship salon.',
                'surcharge' => 850000
            ],
            [
                'id' => 'sovereign-serial',
                'title' => 'One-of-One Serial Cryptograph',
                'description' => 'Unique alphanumeric sequence cryptographically recorded on the Ethereum L2 ledger.',
                'surcharge' => 1500000
            ]
        ];

        return response()->json([
            'success' => true,
            'metals' => $metals,
            'components' => $components,
            'hallmarks' => $hallmarkPunches,
            'engravingTooling' => 'MOPA High-Precision Fiber Laser (Spot Size 0.015mm)'
        ]);
    }

    /**
     * Submit an artisanal hardware engraving and serial stamping commission.
     */
    public function submitEngraving(Request $request)
    {
        $validated = $request->validate([
            'client_name' => 'required|string|max:100',
            'client_email' => 'required|email',
            'client_phone' => 'nullable|string',
            'metal_id' => 'required|string',
            'component_id' => 'required|string',
            'inscription_text' => 'required|string|max:24',
            'typography_style' => 'required|string',
            'hallmark_id' => 'nullable|string',
            'special_tooling_notes' => 'nullable|string|max:500'
        ]);

        $stampingCode = 'STAMP-HW-' . strtoupper(Str::random(6)) . '-' . date('Y');
        $serialNumber = 'TVC-' . strtoupper(Str::random(4)) . '-750AU';

        return response()->json([
            'success' => true,
            'message' => 'Horlogerie hardware engraving commission recorded.',
            'dossier' => [
                'commission_code' => $stampingCode,
                'serial_number' => $serialNumber,
                'client_name' => $validated['client_name'],
                'inscription_text' => $validated['inscription_text'],
                'metal_id' => $validated['metal_id'],
                'component_id' => $validated['component_id'],
                'typography_style' => $validated['typography_style'],
                'assigned_guildsman' => 'Horloger Jean-Paul Vu (Hardware Master)',
                'inspection_tolerance' => '±0.005mm Swiss Micro-Metrology',
                'status' => 'ENGRAVING_QUEUE_APPROVED'
            ]
        ]);
    }
}
