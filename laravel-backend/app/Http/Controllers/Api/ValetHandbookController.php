<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ValetHandbookController extends Controller
{
    /**
     * Get haute care protocols for heritage materials, valet instructions, and emergency stain solver rules.
     */
    public function getCareHandbook()
    {
        $materialProtocols = [
            [
                'id' => 'cashmere-vicuna',
                'materialName' => 'Mongolian Cashmere & Vicuña Fleece',
                'composition' => '100% Grade A Underfleece (13.5 - 15.5 microns)',
                'steamingTemp' => '85°C - 90°C Gentle Distilled Steam Only',
                'washingMethod' => 'Hand wash in cold alpine water or Dry Clean GreenEarth® (silicone-based)',
                'hangerRequirement' => 'Extra-wide contoured natural cedar hanger with flocked shoulder bridge',
                'brushingTechnique' => 'Natural wild boar bristle brush, stroke downwards following fleece grain after each wearing',
                'storageClimate' => '18°C - 21°C, 45% - 50% relative humidity with unvarnished red cedar balls'
            ],
            [
                'id' => 'worsted-wool-mohair',
                'materialName' => 'Super 150s - 180s Worsted Wool & Summer Kid Mohair',
                'composition' => 'Loro Piana & Scabal High-Twist Tailoring Cloth',
                'steamingTemp' => '110°C Vertical Steam Hover (Never press iron directly to fabric)',
                'washingMethod' => 'Specialist Hydrocarbon Dry Cleaning (Max 2 times per year)',
                'hangerRequirement' => 'Anatomical tailored suit hanger with locking trouser clamp lined with felt',
                'brushingTechnique' => 'Stiff badger hair brush to extract particulate matter from worsted weave twill',
                'storageClimate' => 'Breathable 100% unbleached cotton garment bag (Never store in polyethylene plastic)'
            ],
            [
                'id' => 'mulberry-silk-satin',
                'materialName' => 'Como Mulberry Silk Crepe & Charmeuse',
                'composition' => 'Grade 6A Mulberry Silk 22mm - 30mm Heavy Satin',
                'steamingTemp' => '60°C - 70°C Low indirect steam on reverse side with silk press cloth',
                'washingMethod' => 'Cold pH-neutral silk wash or Perchloroethylene-free eco-clean',
                'hangerRequirement' => 'Padded silk-wrapped hanger with rounded tips to prevent shoulder dimpling',
                'brushingTechnique' => 'Microfiber electrostatic mitt (Boar bristles strictly forbidden)',
                'storageClimate' => 'Acid-free archival tissue paper folded horizontally in lacquer storage chests'
            ],
            [
                'id' => 'fullgrain-french-calfskin',
                'materialName' => 'Full-Grain Box Calfskin & Tuscan Vegetable Tan',
                'composition' => 'Aniline finished natural grain with zero synthetic PU coat',
                'steamingTemp' => 'Heat and direct steam strictly prohibited',
                'washingMethod' => 'Glycerin-based saddle soap sparingly applied with horsehair brush',
                'hangerRequirement' => 'Heavy wooden frame with contoured yoke to support natural hide drape',
                'brushingTechnique' => 'Horsehair dauber and soft chamois leather buffing cloth',
                'storageClimate' => 'Shaped with unbleached cotton padding; conditioned every 90 days with mink/beeswax balm'
            ]
        ];

        $emergencyStainGuide = [
            [
                'stainType' => 'Red Wine / Burgundy Grand Cru',
                'immediateAction' => 'Do NOT rub. Blot immediately with dry linen napkin. Dust with cornstarch to absorb tannin liquid. Dispatch to Atelier within 12h.',
                'criticalWarning' => 'Never apply salt or hot water, which permanently sets the wine tannins into protein fibers.'
            ],
            [
                'stainType' => 'Fine Oil / Truffle Emulsion / Vinaigrette',
                'immediateAction' => 'Cover spot generously with pure talc or fuller’s earth. Leave undisturbed for 4 hours to wick lipids away from yarn.',
                'criticalWarning' => 'Do NOT dab with water or alcohol, which causes fat globules to penetrate deeper into the weave.'
            ],
            [
                'stainType' => 'Espresso / Black Coffee',
                'immediateAction' => 'Sponge gently from the reverse side with chilled carbonated mineral water using an uncolored silk handkerchief.',
                'criticalWarning' => 'Avoid soap or alkalinity, which reacts with chlorogenic acid and turns stain yellow-brown permanently.'
            ],
            [
                'stainType' => 'Cosmetic Foundation / Lipstick Wax',
                'immediateAction' => 'Scrape excess surface wax with dull horn spoon edge. Press clean blotting paper over stain; use cool hair dryer on lowest setting to melt wax into paper.',
                'criticalWarning' => 'Never wet directly before wax binder is fully lifted.'
            ]
        ];

        $valetServices = [
            [
                'id' => 'valet-white-glove-pickup',
                'title' => 'Private Valet White-Glove Pick-Up',
                'leadTime' => 'Scheduled 2-hour window in Hanoi & HCMC',
                'cost' => 'Complimentary for Diamond Elite / 250,000 ₫ for Silver',
                'description' => 'Chauffeured wardrobe courier arrives with customized garment hanging racks and climate-controlled transport.'
            ],
            [
                'id' => 'valet-ozone-steaming',
                'title' => 'Ozone Sterilization & Micro-Mist Steaming',
                'leadTime' => '24 - 48 hours',
                'cost' => '450,000 ₫ per two-piece suit',
                'description' => 'Deodorization and fiber rejuvenation in medical-grade ozone mist chamber without harsh chemical solvents.'
            ],
            [
                'id' => 'valet-seasonal-storage',
                'title' => 'Atelier Climate-Vault Seasonal Hibernation',
                'leadTime' => '6-month archival vault storage',
                'cost' => '1,800,000 ₫ per season (up to 5 garments)',
                'description' => 'Garments stored in vault with 19°C constant temperature, 48% humidity, HEPA air filtration and moth-proofing.'
            ]
        ];

        return response()->json([
            'success' => true,
            'protocols' => $materialProtocols,
            'stainGuide' => $emergencyStainGuide,
            'valetServices' => $valetServices,
            'conciergeHotline' => '+84 24 3988 8899 (VIP Atelier Butler Desk)'
        ]);
    }

    /**
     * Submit an urgent Valet Home Care & Restoration request.
     */
    public function requestValetService(Request $request)
    {
        $validated = $request->validate([
            'client_name' => 'required|string|max:100',
            'client_phone' => 'required|string|max:20',
            'client_address' => 'required|string|max:255',
            'service_type' => 'required|string',
            'garment_description' => 'required|string|max:255',
            'urgency' => 'required|string',
            'special_instructions' => 'nullable|string|max:500'
        ]);

        $dossierCode = 'VALET-' . strtoupper(Str::random(6)) . '-' . date('Y');
        $courierEta = $validated['urgency'] === 'EXPEDITED_SAME_DAY' ? 'Within 3 hours' : 'Tomorrow 09:00 - 11:00 AM';

        return response()->json([
            'success' => true,
            'message' => 'Valet restoration dispatch requested successfully.',
            'dossier' => [
                'dossier_code' => $dossierCode,
                'client_name' => $validated['client_name'],
                'service_type' => $validated['service_type'],
                'garment_description' => $validated['garment_description'],
                'courier_eta' => $courierEta,
                'status' => 'BUTLER_DISPATCH_CONFIRMED'
            ]
        ]);
    }
}
