<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CostPerWearController extends Controller
{
    /**
     * Get baseline luxury garment benchmarks and durability profiles.
     */
    public function getBenchmarks()
    {
        $garmentPresets = [
            [
                'id' => 'cashmere-overcoat',
                'name' => 'Archival Double-Faced Cashmere Overcoat',
                'basePrice' => 28500000,
                'avgLifespanYears' => 15,
                'projectedWearsPerYear' => 45,
                'resaleValueRetentionPct' => 62,
                'maintenanceCostPerYear' => 650000,
                'fastFashionComparisonPrice' => 2400000,
                'fastFashionLifespanYears' => 1.5,
                'category' => 'Outerwear',
                'materialGrade' => '100% Mongolian Cashmere 480gsm'
            ],
            [
                'id' => 'tailored-suit-blazer',
                'name' => 'Hand-Stitched Loro Piana Wool Trench Blazer',
                'basePrice' => 18900000,
                'avgLifespanYears' => 12,
                'projectedWearsPerYear' => 60,
                'resaleValueRetentionPct' => 55,
                'maintenanceCostPerYear' => 500000,
                'fastFashionComparisonPrice' => 1800000,
                'fastFashionLifespanYears' => 1.2,
                'category' => 'Tailoring',
                'materialGrade' => 'Super 150s Worsted Virgin Wool'
            ],
            [
                'id' => 'silk-crepe-shirt',
                'name' => 'Como Mulberry Silk Crepe de Chine Shirt',
                'basePrice' => 7800000,
                'avgLifespanYears' => 8,
                'projectedWearsPerYear' => 38,
                'resaleValueRetentionPct' => 45,
                'maintenanceCostPerYear' => 320000,
                'fastFashionComparisonPrice' => 750000,
                'fastFashionLifespanYears' => 0.8,
                'category' => 'Shirts',
                'materialGrade' => 'Grade 6A Mulberry Silk 22mm'
            ],
            [
                'id' => 'leather-weekender-bag',
                'name' => 'Bespoke Vegetable-Tanned Tuscan Leather Weekender',
                'basePrice' => 24500000,
                'avgLifespanYears' => 25,
                'projectedWearsPerYear' => 52,
                'resaleValueRetentionPct' => 78,
                'maintenanceCostPerYear' => 400000,
                'fastFashionComparisonPrice' => 1900000,
                'fastFashionLifespanYears' => 2.0,
                'category' => 'Leather Goods',
                'materialGrade' => 'Full-Grain French Calfskin with Solid Brass Hardware'
            ]
        ];

        return response()->json([
            'success' => true,
            'presets' => $garmentPresets,
            'inflationAssumptionPct' => 3.5,
            'sustainabilityMetrics' => [
                'co2SavedPerYearKg' => 18.4,
                'waterSavedPerLifespanLiters' => 14200,
                'landfillWasteDivertedKg' => 12.6
            ]
        ]);
    }

    /**
     * Compute detailed cost-per-wear simulation with amortization trajectory.
     */
    public function simulate(Request $request)
    {
        $validated = $request->validate([
            'purchase_price' => 'required|numeric|min:100000',
            'estimated_years' => 'required|numeric|min:1|max:50',
            'wears_per_year' => 'required|numeric|min:1|max:365',
            'maintenance_per_year' => 'nullable|numeric|min:0',
            'expected_resale_pct' => 'nullable|numeric|min:0|max:100',
            'fast_fashion_alt_price' => 'nullable|numeric|min:0'
        ]);

        $purchasePrice = (float) $validated['purchase_price'];
        $years = (int) $validated['estimated_years'];
        $wearsPerYear = (int) $validated['wears_per_year'];
        $maintenancePerYear = (float) ($validated['maintenance_per_year'] ?? 0);
        $expectedResalePct = (float) ($validated['expected_resale_pct'] ?? 50);
        $fastFashionPrice = (float) ($validated['fast_fashion_alt_price'] ?? ($purchasePrice * 0.12));

        $totalWears = $years * $wearsPerYear;
        $totalMaintenance = $years * $maintenancePerYear;
        $projectedResaleValue = $purchasePrice * ($expectedResalePct / 100);
        $netTotalCost = ($purchasePrice + $totalMaintenance) - $projectedResaleValue;
        $costPerWear = $totalWears > 0 ? ($netTotalCost / $totalWears) : $purchasePrice;

        // Fast fashion alternative comparison (assuming 1.2 years lifecycle before replacement)
        $fastFashionReplacementsNeeded = ceil($years / 1.5);
        $fastFashionTotalExpenditure = $fastFashionReplacementsNeeded * $fastFashionPrice;
        $fastFashionCostPerWear = $totalWears > 0 ? ($fastFashionTotalExpenditure / $totalWears) : $fastFashionPrice;

        $netSavingsVsFastFashion = $fastFashionTotalExpenditure - $netTotalCost;

        // Yearly amortization timeline
        $trajectory = [];
        $runningWears = 0;
        for ($y = 1; $y <= $years; $y++) {
            $runningWears += $wearsPerYear;
            $runningCost = $purchasePrice + ($y * $maintenancePerYear);
            $runningCostPerWear = round($runningCost / $runningWears);
            $trajectory[] = [
                'year' => $y,
                'cumulativeWears' => $runningWears,
                'cumulativeCost' => round($runningCost),
                'costPerWear' => $runningCostPerWear
            ];
        }

        return response()->json([
            'success' => true,
            'summary' => [
                'total_wears' => $totalWears,
                'gross_purchase_price' => $purchasePrice,
                'total_maintenance_cost' => $totalMaintenance,
                'projected_resale_value' => round($projectedResaleValue),
                'net_lifetime_investment' => round($netTotalCost),
                'cost_per_wear' => round($costPerWear),
                'fast_fashion_total' => round($fastFashionTotalExpenditure),
                'fast_fashion_cost_per_wear' => round($fastFashionCostPerWear),
                'net_savings' => round($netSavingsVsFastFashion),
                'is_profitable_luxury_investment' => $netSavingsVsFastFashion > 0
            ],
            'timeline' => $trajectory
        ]);
    }
}
