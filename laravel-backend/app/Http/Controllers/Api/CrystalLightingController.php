<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CrystalLightingController extends Controller
{
    /**
     * Get haute couture crystal catalog, lighting ambient profiles, and silhouette presets.
     */
    public function getCrystalStudioConfig()
    {
        $crystalGrades = [
            [
                'id' => 'swarovski-aurora-borealis',
                'name' => 'Swarovski Haute Couture Aurora Borealis (AB)',
                'cut' => 'XIRIUS Rose 2088 16-Facet Diamond Cut',
                'coating' => 'Vacuum Vapor-Deposited Vapor Blue/Gold Flashes',
                'refractionIndex' => '1.585 High Dispersion',
                'origin' => 'Wattens, Austria',
                'sparkleIntensity' => 98,
                'surcharge' => 4500000,
                'description' => 'Unrivaled spectral brilliance producing multi-hue fire under ambient light.'
            ],
            [
                'id' => 'jet-hematite-noir',
                'name' => 'Midnight Jet Hematite Crystal Pavé',
                'cut' => 'Baguette & Micro-Chaton Cut',
                'coating' => 'Gunmetal Semi-Metallic Deep Obsidian',
                'refractionIndex' => '2.100 Opaque Mirror Lustre',
                'origin' => 'Bohemian Heritage Lapidary, Czech Republic',
                'sparkleIntensity' => 84,
                'surcharge' => 3800000,
                'description' => 'Cold, velvety metallic glint that catches flashbulbs with dark architectural drama.'
            ],
            [
                'id' => 'vintage-champagne-crystal',
                'name' => 'Atelier Vintage Champagne & Cognac Quartz',
                'cut' => 'Emerald Navette & Pear Faceting',
                'coating' => 'Uncoated Pure Honey Topaz Quartz Tone',
                'refractionIndex' => '1.544 Warm Candlelight Resonance',
                'origin' => 'Idar-Oberstein Guild, Germany',
                'sparkleIntensity' => 92,
                'surcharge' => 5200000,
                'description' => 'Warm, romantic fire calibrated specifically for private gala chandeliers and candlelight.'
            ],
            [
                'id' => 'silver-shade-palladium',
                'name' => 'Silver Shade Lunar Crystal Dust',
                'cut' => 'Micro-Pavé 0.8mm Round Brilliant',
                'coating' => 'Platinum Mirror Backing',
                'refractionIndex' => '1.620 Cool Stellar Glow',
                'origin' => 'Wattens Atelier Special Commission',
                'sparkleIntensity' => 95,
                'surcharge' => 4200000,
                'description' => 'Creates a liquid-diamond waterfall effect when draped on black silk velvet.'
            ]
        ];

        $lightingEnvironments = [
            [
                'id' => 'grand-opera-chandelier',
                'name' => 'Palais Garnier Opera Chandelier',
                'kelvin' => '2700K Warm Tungsten Incandescence',
                'intensityLux' => '350 Lux Ambient',
                'shadowSoftness' => 'Soft Radial Dispersion',
                'bgHex' => '#120d09',
                'vibe' => 'Dramatic golden warm reflections with intense fire scintillation'
            ],
            [
                'id' => 'cannes-red-carpet-flash',
                'name' => 'Cannes Red Carpet Strobe & Paparazzi Flash',
                'kelvin' => '5600K Xenon Strobe Burst',
                'intensityLux' => '2,500 Lux Peak Strobe',
                'shadowSoftness' => 'Hard High-Contrast Pinpoint',
                'bgHex' => '#0c0f14',
                'vibe' => 'Instantaneous multi-facet bursts of prismatic rainbow starbursts'
            ],
            [
                'id' => 'venetian-candlelight-soiree',
                'name' => 'Venetian Palazzo Intimate Candlelight',
                'kelvin' => '1900K Flickering Organic Flame',
                'intensityLux' => '60 Lux Low Light',
                'shadowSoftness' => 'Dancing Kinetic Amber Glow',
                'bgHex' => '#140c06',
                'vibe' => 'Subtle, sultry glimmer that breathes with every movement of the silk drape'
            ],
            [
                'id' => 'modern-art-gallery-spotlight',
                'name' => 'Modern Art Foundation Directional Halogen',
                'kelvin' => '4000K Pure Museum Grade CRI 99',
                'intensityLux' => '800 Lux Focused Narrow Beam',
                'shadowSoftness' => 'Crisp Edge Architectural Beam',
                'bgHex' => '#0e0e10',
                'vibe' => 'Razor-sharp crystal geometry highlighting structural hand-embroidery'
            ]
        ];

        $silhouettes = [
            [
                'id' => 'gown-bias-cut-noir',
                'title' => 'The Imperial Column Gala Gown',
                'fabric' => 'Heavy Como Silk Velvet & Translucent Tulle',
                'crystalDensity' => '2,400 Hand-Applied Crystals along Spinal Meridian',
                'artisanHours' => '140 Hours Hand-Beading'
            ],
            [
                'id' => 'cape-cascade-mantle',
                'title' => 'Runway Stardust Evening Cape Mantle',
                'fabric' => 'Silk Chiffon & French Chantilly Lace',
                'crystalDensity' => '4,800 Micro-Crystals in Degradé Ombré Spray',
                'artisanHours' => '210 Hours Micro-Pavé'
            ],
            [
                'id' => 'blazer-lapel-corsage',
                'title' => 'Sculptural Smoking Tuxedo with Crystal Lapel',
                'fabric' => 'Loro Piana Tasmanian Virgin Wool',
                'crystalDensity' => '1,200 Baguette Crystals on Peak Lapels',
                'artisanHours' => '85 Hours Geometric Setting'
            ]
        ];

        return response()->json([
            'success' => true,
            'crystals' => $crystalGrades,
            'environments' => $lightingEnvironments,
            'silhouettes' => $silhouettes,
            'beadingGuild' => 'Atelier Lesage Guild Collaboration Hanoi/Paris'
        ]);
    }

    /**
     * Request an interactive fitting reservation or bespoke crystal beading commission.
     */
    public function bookLightingFitting(Request $request)
    {
        $validated = $request->validate([
            'client_name' => 'required|string|max:100',
            'client_email' => 'required|email',
            'client_phone' => 'nullable|string',
            'crystal_id' => 'required|string',
            'environment_id' => 'required|string',
            'silhouette_id' => 'required|string',
            'fitting_date' => 'required|string',
            'special_requests' => 'nullable|string|max:500'
        ]);

        $bookingRef = 'CRYSTAL-VIP-' . strtoupper(Str::random(6)) . '-' . date('Y');
        $salonChamber = 'Private Dark Chamber VIP Salon 01 (Hanoi Atelier Flagship)';

        return response()->json([
            'success' => true,
            'message' => 'Haute Couture Crystal Lighting Fitting scheduled.',
            'dossier' => [
                'booking_ref' => $bookingRef,
                'client_name' => $validated['client_name'],
                'silhouette_id' => $validated['silhouette_id'],
                'crystal_id' => $validated['crystal_id'],
                'environment_id' => $validated['environment_id'],
                'fitting_date' => $validated['fitting_date'],
                'salon_chamber' => $salonChamber,
                'status' => 'PRIVATE_CHAMBER_RESERVED'
            ]
        ]);
    }
}
