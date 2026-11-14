<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class GoldEmbroideryController extends Controller
{
    /**
     * Get available embroidery thread options, fonts, artisan seals, and placement zones.
     */
    public function getCatalog()
    {
        $threadTypes = [
            [
                'id' => 'gold-24k',
                'name' => '24K Aurum Japanese Gilt Thread',
                'purity' => '99.9% Pure Gold Leaf wrapped on silk core',
                'origin' => 'Kyoto Atelier, Japan',
                'description' => 'Unoxidizing, soft luster that captures gentle ambient light without excessive glare.',
                'surcharge' => 3800000,
                'hex' => '#D4AF37',
                'texture' => 'gilt-metallic',
                'durability' => 'Heirloom Grade (100+ Years)'
            ],
            [
                'id' => 'silver-platinum',
                'name' => 'Platinum & Sterling Silver Wire',
                'purity' => '950 Platinum / 925 Silver',
                'origin' => 'Lyon Silversmith Guild, France',
                'description' => 'Cool, lunar radiance with ultra-fine gauge for intricate micro-script and family crests.',
                'surcharge' => 3200000,
                'hex' => '#E5E4E2',
                'texture' => 'cool-metallic',
                'durability' => 'Heirloom Grade'
            ],
            [
                'id' => 'black-obsidian-silk',
                'name' => 'Midnight Obsidian Raw Filament Silk',
                'purity' => '100% Grade 6A Mulberry Silk steeped in Charcoal mineral bath',
                'origin' => 'Como, Italy',
                'description' => 'Subtle tone-on-tone matte absorption, creating depth on dark wool and cashmere.',
                'surcharge' => 1800000,
                'hex' => '#1A1A1A',
                'texture' => 'matte-velvet',
                'durability' => 'High Tenacity'
            ],
            [
                'id' => 'champagne-palladium',
                'name' => 'Champagne Palladium Micro-Twist',
                'purity' => 'Palladium alloyed with 18K rose gold dust',
                'origin' => 'Geneva, Switzerland',
                'description' => 'Warm, modern luxury with an understated warm champagne reflection.',
                'surcharge' => 3500000,
                'hex' => '#F7E7CE',
                'texture' => 'satin-metallic',
                'durability' => 'Heirloom Grade'
            ]
        ];

        $placementZones = [
            [
                'id' => 'inner-breast-pocket',
                'name' => 'Inner Breast Pocket Lining',
                'garmentTypes' => ['Trench Coat', 'Tailored Blazer', 'Overcoat'],
                'visibility' => 'Private (For the wearer alone)',
                'maxCharacters' => 24,
                'artisanHours' => '6 - 8 hours hand embroidery'
            ],
            [
                'id' => 'cuff-monogram',
                'name' => 'Left Shirt Cuff / Sleeve Vent',
                'garmentTypes' => ['Silk Shirt', 'Tailored Blazer'],
                'visibility' => 'Subtle Gestural (Seen when writing or resting arms)',
                'maxCharacters' => 4,
                'artisanHours' => '3 - 4 hours micro-needle'
            ],
            [
                'id' => 'under-collar-signature',
                'name' => 'Under-Collar Melton Band',
                'garmentTypes' => ['Wool Trench Coat', 'Cashmere Overcoat'],
                'visibility' => 'Concealed (Revealed only when collar is popped against cold)',
                'maxCharacters' => 32,
                'artisanHours' => '8 - 12 hours contour stitch'
            ],
            [
                'id' => 'hemline-artisan-seal',
                'name' => 'Interior Hemline Corner Border',
                'garmentTypes' => ['Evening Silk Dress', 'Overcoat', 'Kimono Robe'],
                'visibility' => 'Discreet Archival Seal',
                'maxCharacters' => 12,
                'artisanHours' => '5 - 7 hours border chain stitch'
            ]
        ];

        $artisanSeals = [
            [
                'id' => 'seal-dragon-cipher',
                'title' => 'Imperial Cipher & Geometric Seal',
                'description' => 'Minimally stylized geometric seal hand-stamped in red vermilion cinnabar with gold thread framing.',
                'surcharge' => 1200000
            ],
            [
                'id' => 'seal-monogram-shield',
                'title' => 'Haute Crest Shield',
                'description' => 'Two interlocking serif initials surrounded by an architectural minimalist archway.',
                'surcharge' => 1500000
            ],
            [
                'id' => 'seal-astronomy-coordinate',
                'title' => 'Celestial Date & Coordinates',
                'description' => 'Micro-stitched latitude, longitude and Roman numeral date commemorating life milestones.',
                'surcharge' => 950000
            ]
        ];

        return response()->json([
            'success' => true,
            'threads' => $threadTypes,
            'zones' => $placementZones,
            'seals' => $artisanSeals,
            'standardLeadTime' => '7-10 business days handcrafted in TVC Atelier Hanoi/Saigon'
        ]);
    }

    /**
     * Submit an artisan bespoke embroidery order request.
     */
    public function submitOrder(Request $request)
    {
        $validated = $request->validate([
            'client_name' => 'required|string|max:100',
            'client_email' => 'required|email',
            'client_phone' => 'nullable|string',
            'garment_item' => 'required|string',
            'thread_id' => 'required|string',
            'placement_zone' => 'required|string',
            'monogram_text' => 'required|string|max:35',
            'font_style' => 'required|string',
            'artisan_seal_id' => 'nullable|string',
            'artisan_notes' => 'nullable|string|max:500'
        ]);

        $commissionCode = 'BESPOKE-EMB-' . strtoupper(Str::random(6)) . '-' . date('Y');
        $artisanAssigned = 'Master Le Thu Hang (Senior Gold-work Specialist)';
        $estimatedDispatch = date('Y-m-d', strtotime('+9 days'));

        return response()->json([
            'success' => true,
            'message' => 'Artisan embroidery commission registered successfully.',
            'order' => [
                'commission_code' => $commissionCode,
                'client_name' => $validated['client_name'],
                'garment_item' => $validated['garment_item'],
                'monogram_text' => $validated['monogram_text'],
                'thread_id' => $validated['thread_id'],
                'placement_zone' => $validated['placement_zone'],
                'font_style' => $validated['font_style'],
                'artisan_assigned' => $artisanAssigned,
                'estimated_dispatch' => $estimatedDispatch,
                'status' => 'ARTISAN_REVIEW_SCHEDULED',
                'certificate_number' => 'CERT-AU-' . strtoupper(Str::random(8))
            ]
        ]);
    }
}
