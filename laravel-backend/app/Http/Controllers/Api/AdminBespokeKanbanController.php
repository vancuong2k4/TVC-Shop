<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminBespokeKanbanController extends Controller
{
    /**
     * Get the bespoke atelier production pipeline overview with stages, artisan roster, and commissions.
     */
    public function getKanbanBoard()
    {
        $artisans = [
            [
                'id' => 'artisan-hang-le',
                'name' => 'Master Le Thu Hang',
                'role' => 'Senior Gold-work & Embroidery Lead',
                'experience' => '24 years',
                'activeCommissions' => 3,
                'avatar' => 'LH'
            ],
            [
                'id' => 'artisan-tran-minh',
                'name' => 'Artisan Tran Minh Tri',
                'role' => 'Master Tailor & Pattern Drafter',
                'experience' => '19 years',
                'activeCommissions' => 2,
                'avatar' => 'TM'
            ],
            [
                'id' => 'artisan-nguyen-duc',
                'name' => 'Artisan Nguyen Duc Vu',
                'role' => 'Haute Leather & Hardware Guildsman',
                'experience' => '16 years',
                'activeCommissions' => 2,
                'avatar' => 'NV'
            ],
            [
                'id' => 'artisan-clara-dupont',
                'name' => 'Mme. Clara Dupont',
                'role' => 'Finishing & Hand-Rolled Hemming Specialist',
                'experience' => '14 years',
                'activeCommissions' => 1,
                'avatar' => 'CD'
            ]
        ];

        $columns = [
            [
                'id' => 'CONSULTATION_MEASUREMENT',
                'title' => '1. Consultation & Measurement',
                'color' => '#A1A1AA',
                'description' => 'Body scanning, silhouette drafting, cloth selection'
            ],
            [
                'id' => 'PATTERN_TOILE_FITTING',
                'title' => '2. Muslin Toile Fitting',
                'color' => '#38BDF8',
                'description' => 'Calico canvas baste fitting and anatomical posture balancing'
            ],
            [
                'id' => 'HAND_CUTTING_CONSTRUCTION',
                'title' => '3. Structural Cutting & Canvas Stitch',
                'color' => '#FBBF24',
                'description' => 'Horsehair chest piece padding, pick-stitching, lapel pad stitching'
            ],
            [
                'id' => 'ARTISAN_EMBROIDERY_FINISHING',
                'title' => '4. 24K Gold Embroidery & Hardware',
                'color' => '#F59E0B',
                'description' => 'Gold bullion embroidery, horn buttons, Cupro silk lining attachment'
            ],
            [
                'id' => 'FINAL_PRESS_ARCHIVAL_SEAL',
                'title' => '5. Master Press & Cryptographic Seal',
                'color' => '#34D399',
                'description' => 'Multi-step steam sculpting, white glove packaging, heirloom ledger entry'
            ]
        ];

        $commissions = [
            [
                'id' => 'COMM-2026-081',
                'clientName' => 'Madame Hoang Mai Anh',
                'clientTier' => 'Diamond Elite',
                'garmentTitle' => 'Archival Double-Breasted Cashmere Greatcoat',
                'fabric' => 'Loro Piana Zenith Cashmere 540gsm (Navy Noir)',
                'customDetail' => '24K Japanese Gilt Thread Monogram on Inner Pocket',
                'assignedArtisan' => 'Master Le Thu Hang',
                'stage' => 'ARTISAN_EMBROIDERY_FINISHING',
                'priority' => 'URGENT_RUNWAY',
                'deadline' => '2026-11-20',
                'progressPct' => 80,
                'totalValue' => 42000000
            ],
            [
                'id' => 'COMM-2026-084',
                'clientName' => 'Monsieur Dang Quoc Bao',
                'clientTier' => 'Diamond Elite',
                'garmentTitle' => 'Savile-Cut Bespoke Smoking Jacket with Silk Lapel',
                'fabric' => 'Scabal Velvet Baritone & Mulberry Silk Satin',
                'customDetail' => 'Australian Mother-of-Pearl Button Suite & Hand-Rolled Vents',
                'assignedArtisan' => 'Artisan Tran Minh Tri',
                'stage' => 'PATTERN_TOILE_FITTING',
                'priority' => 'STANDARD',
                'deadline' => '2026-12-05',
                'progressPct' => 35,
                'totalValue' => 31500000
            ],
            [
                'id' => 'COMM-2026-088',
                'clientName' => 'Lady Tran Thuc Quyen',
                'clientTier' => 'Gold Patron',
                'garmentTitle' => 'Bias-Cut Silk Crepe Evening Gown with Cape',
                'fabric' => 'Como Mulberry Silk Crepe de Chine (Champagne)',
                'customDetail' => 'Platinum Thread Astronomical Coordinate Seal at Hemline',
                'assignedArtisan' => 'Mme. Clara Dupont',
                'stage' => 'HAND_CUTTING_CONSTRUCTION',
                'priority' => 'HIGH',
                'deadline' => '2026-11-28',
                'progressPct' => 55,
                'totalValue' => 26800000
            ],
            [
                'id' => 'COMM-2026-092',
                'clientName' => 'Dr. Vuong Dinh Khang',
                'clientTier' => 'Silver Member',
                'garmentTitle' => 'Single-Breasted Travel Blazer in High-Twist Wool',
                'fabric' => 'Dormeuil Tonik Wool (Charcoal Slate)',
                'customDetail' => 'Handmade Horn Buttons with Hidden Passport Pocket',
                'assignedArtisan' => 'Artisan Nguyen Duc Vu',
                'stage' => 'CONSULTATION_MEASUREMENT',
                'priority' => 'STANDARD',
                'deadline' => '2026-12-18',
                'progressPct' => 15,
                'totalValue' => 21000000
            ],
            [
                'id' => 'COMM-2026-077',
                'clientName' => 'Ambassador Jean-Luc Martin',
                'clientTier' => 'Diamond Elite',
                'garmentTitle' => 'Formal Ceremonial Morning Coat',
                'fabric' => 'Ermenegildo Zegna 15milmil15 Wool',
                'customDetail' => 'Imperial Cipher vermilion seal with titanium hardware',
                'assignedArtisan' => 'Master Le Thu Hang',
                'stage' => 'FINAL_PRESS_ARCHIVAL_SEAL',
                'priority' => 'DIPLOMATIC_EXPEDITE',
                'deadline' => '2026-11-16',
                'progressPct' => 98,
                'totalValue' => 55000000
            ]
        ];

        return response()->json([
            'success' => true,
            'summary' => [
                'totalCommissions' => count($commissions),
                'activePipelineValue' => array_sum(array_column($commissions, 'totalValue')),
                'onTrackRatePct' => 94,
                'availableArtisans' => count($artisans)
            ],
            'columns' => $columns,
            'commissions' => $commissions,
            'artisans' => $artisans
        ]);
    }

    /**
     * Move a bespoke commission to another production stage or update assigned artisan.
     */
    public function updateCommissionStage(Request $request, $id)
    {
        $validated = $request->validate([
            'stage' => 'nullable|string',
            'assignedArtisan' => 'nullable|string',
            'progressPct' => 'nullable|numeric|min:0|max:100',
            'note' => 'nullable|string|max:500'
        ]);

        return response()->json([
            'success' => true,
            'message' => "Bespoke commission {$id} updated successfully.",
            'updatedData' => [
                'id' => $id,
                'stage' => $validated['stage'] ?? null,
                'assignedArtisan' => $validated['assignedArtisan'] ?? null,
                'progressPct' => $validated['progressPct'] ?? null,
                'lastUpdated' => date('Y-m-d H:i:s'),
                'updatedBy' => 'Atelier Master Controller'
            ]
        ]);
    }
}
