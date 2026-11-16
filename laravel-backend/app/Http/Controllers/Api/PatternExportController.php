<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PatternExportController extends Controller
{
    /**
     * Get available architectural garment pattern drafting templates, geometric standards, and vector export specifications.
     */
    public function getDraftingSchema()
    {
        $garmentArchetypes = [
            [
                'id' => 'archival-savile-coat',
                'title' => 'Double-Breasted Archival Greatcoat',
                'category' => 'Outerwear',
                'scaleRatio' => '1:1 True-to-Scale & 1:5 Miniature Cadence',
                'panelCount' => 18,
                'seamAllowanceMm' => 12.5,
                'chestDrapeEaseCm' => 14.0,
                'description' => 'Classic Savile-cut silhouette with flared skirt, high-armhole roped sleeve head, and architectural chest darting.',
                'canvasInterfacing' => 'Floating full-canvas horsehair and wool chest felt construction'
            ],
            [
                'id' => 'sculptural-smoking-jacket',
                'title' => 'Single-Button Peak Lapel Tuxedo Jacket',
                'category' => 'Tailoring',
                'scaleRatio' => '1:1 True-to-Scale',
                'panelCount' => 14,
                'seamAllowanceMm' => 10.0,
                'chestDrapeEaseCm' => 9.5,
                'description' => 'Hourglass suppression waist, continuous shawl or dramatic peak silk grosgrain lapel curve.',
                'canvasInterfacing' => 'Medium-weight camel hair chest piece with hand-padded collar melton'
            ],
            [
                'id' => 'bias-evening-column-gown',
                'title' => 'Bias-Cut Silk Crepe Fluid Column Gown',
                'category' => 'Couture Dresses',
                'scaleRatio' => '1:1 True-to-Scale',
                'panelCount' => 8,
                'seamAllowanceMm' => 8.0,
                'chestDrapeEaseCm' => 4.0,
                'description' => '45-degree bias geometric grainline alignment designed to contour bodily curves without structural boning.',
                'canvasInterfacing' => 'Stay-stitched organza understructure with hand-rolled micro-hem edges'
            ]
        ];

        $geometricNotations = [
            [
                'code' => 'P-GRAIN',
                'name' => 'True Warp Grainline Vector',
                'symbol' => 'Double-headed directional arrow aligned with warp threads'
            ],
            [
                'code' => 'P-BALANCE',
                'name' => 'Anatomical Pitch Balance Notch',
                'symbol' => 'High-precision micro-triangle notch at front/back scye connection'
            ],
            [
                'code' => 'P-ROLL',
                'name' => 'Lapel Roll-Line Breakpoint',
                'symbol' => 'Dotted line with bridging hand-basting tension indicators'
            ],
            [
                'code' => 'P-DART',
                'name' => 'Suppression Contour Pivot Dart',
                'symbol' => 'Graduated curved darting terminating 2.5cm prior to bust/scapula apex'
            ]
        ];

        $exportFormats = [
            [
                'format' => 'VECTOR_PDF_PLOTTER',
                'name' => 'Architectural Wide-Format Plotter PDF (A0 / 36-Inch Continuous Roll)',
                'dpi' => 'Vector Path (Infinite Scale)',
                'useCase' => 'Direct atelier laser cutters or industrial vacuum cutter plotting'
            ],
            [
                'format' => 'CAD_DXF_AAMA',
                'name' => 'Standard DXF-AAMA CAD Geometry Exchange',
                'dpi' => 'Coordinate Points Array',
                'useCase' => 'Compatible with Gerber Accumark, Lectra Modaris, Clo3D & Browzwear'
            ],
            [
                'format' => 'PRINT_TILED_A4',
                'name' => 'Tiled Home Workshop Print (A4 / US Letter with Crosshair Registration)',
                'dpi' => '300 DPI High-Resolution',
                'useCase' => 'Self-assembly grid print for bespoke artisan home tailoring'
            ]
        ];

        return response()->json([
            'success' => true,
            'archetypes' => $garmentArchetypes,
            'notations' => $geometricNotations,
            'exportFormats' => $exportFormats,
            'standardTolerances' => '±0.5mm drafting curvature deviation'
        ]);
    }

    /**
     * Generate and calculate customized geometric pattern parameters based on user anatomical measurements.
     */
    public function generateCustomPattern(Request $request)
    {
        $validated = $request->validate([
            'client_name' => 'required|string|max:100',
            'client_email' => 'required|email',
            'archetype_id' => 'required|string',
            'chest_circ_cm' => 'required|numeric|min:70|max:160',
            'waist_circ_cm' => 'required|numeric|min:55|max:150',
            'hip_circ_cm' => 'required|numeric|min:75|max:160',
            'shoulder_width_cm' => 'required|numeric|min:35|max:65',
            'back_length_cm' => 'required|numeric|min:35|max:65',
            'sleeve_length_cm' => 'required|numeric|min:50|max:80',
            'format' => 'required|string',
            'include_seam_allowance' => 'boolean'
        ]);

        $chest = (float) $validated['chest_circ_cm'];
        $waist = (float) $validated['waist_circ_cm'];
        $shoulder = (float) $validated['shoulder_width_cm'];
        $backLength = (float) $validated['back_length_cm'];
        $sleeve = (float) $validated['sleeve_length_cm'];

        // Core Pattern Geometry Coordinates Calculation
        $scyeDepth = round(($chest / 4) + 2.5, 1);
        $halfChestScale = round(($chest / 2) + 6.0, 1); // including ease
        $waistSuppression = round((($chest - $waist) / 2) * 0.45, 1);
        $armholeCirc = round((($chest * 0.4) + ($sleeve * 0.2)), 1);

        $dossierId = 'PATTERN-CAD-' . strtoupper(Str::random(6)) . '-' . date('Y');
        $shaHash = hash('sha256', $dossierId . microtime());

        return response()->json([
            'success' => true,
            'message' => 'Architectural bespoke pattern generated successfully.',
            'pattern' => [
                'dossier_id' => $dossierId,
                'sha256_fingerprint' => substr($shaHash, 0, 32),
                'client_name' => $validated['client_name'],
                'archetype_id' => $validated['archetype_id'],
                'format' => $validated['format'],
                'calculated_metrics' => [
                    'scye_depth_cm' => $scyeDepth,
                    'chest_scale_with_ease_cm' => $halfChestScale,
                    'waist_suppression_dart_cm' => $waistSuppression,
                    'calculated_armhole_circ_cm' => $armholeCirc,
                    'shoulder_slope_degrees' => 14.5,
                    'back_neck_girth_cm' => round(($chest / 12) + 2.0, 1)
                ],
                'panels' => [
                    ['name' => 'Front Canvas Panel (Forepart)', 'areaSqM' => 0.48, 'grain' => 'Parallel to center front'],
                    ['name' => 'Side Body (Sidepart)', 'areaSqM' => 0.22, 'grain' => 'Vertical plumb line'],
                    ['name' => 'Back Panel (Backpart)', 'areaSqM' => 0.44, 'grain' => 'Center back seam'],
                    ['name' => 'Top Sleeve', 'areaSqM' => 0.32, 'grain' => 'Down sleeve crease'],
                    ['name' => 'Under Sleeve', 'areaSqM' => 0.18, 'grain' => 'Parallel to forearm seam'],
                    ['name' => 'Collar Melton & Stand', 'areaSqM' => 0.08, 'grain' => 'Bias 45 degrees']
                ],
                'estimated_cloth_yardage_meters' => round((($backLength * 2) + $sleeve + 25) / 100, 2),
                'timestamp' => date('Y-m-d H:i:s')
            ]
        ]);
    }
}
