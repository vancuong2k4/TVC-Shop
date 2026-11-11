<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FabricArchiveController extends Controller
{
    /**
     * Danh mục các loại chất liệu thượng hạng và chứng chỉ xuất xứ kỹ thuật số
     */
    private $fabrics = [
        [
            'id' => 'fabric_cashmere_biella',
            'name' => 'Len Cashmere Thượng Hạng 14.5 Micron',
            'code' => 'TEX-IT-7892',
            'origin' => 'Biella, Piemonte, Ý (Italy)',
            'mill' => 'Lanificio Fratelli Atelier (Thành lập 1886)',
            'fiber_type' => '100% Lông cừu Cashmere non Mông Cổ loại A+',
            'fineness' => '14.5 Micron siêu mịn',
            'weight' => '420 g/m²',
            'certifications' => ['Oeko-Tex Standard 100', 'Sustainable Fiber Alliance (SFA)', 'Cradle to Cradle Certified'],
            'image' => 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=600',
            'story' => 'Được tuyển chọn từ lớp lông tơ mềm mại nhất của dê Cashmere tại vùng thảo nguyên ôn đới, sau đó được vận chuyển về xưởng dệt cổ kính tại Biella để chải thoi và ngâm trong dòng nước suối tự nhiên từ dãy Alps giúp sợi len đạt độ đàn hồi và mềm mượt vô song.',
            'products_used_count' => 12,
            'environmental_impact' => [
                'carbon_footprint' => '-38% so với len công nghiệp',
                'water_recycled' => '94% nước thải nhuộm được tuần hoàn khép kín',
                'biodegradability' => '100% phân hủy sinh học trong đất tự nhiên sau 180 ngày'
            ]
        ],
        [
            'id' => 'fabric_mulberry_silk_lyon',
            'name' => 'Lụa Tơ Tằm Tự Nhiên 22 Momme Silk Charmeuse',
            'code' => 'TEX-FR-4501',
            'origin' => 'Lyon, Auvergne-Rhône-Alpes, Pháp (France)',
            'mill' => 'Maison des Soyeux de Lyon',
            'fiber_type' => '100% Sợi tơ tằm dâu tằm tự nhiên',
            'fineness' => 'Định lượng 22 Momme dệt satin chéo',
            'weight' => '95 g/m²',
            'certifications' => ['Global Organic Textile Standard (GOTS)', 'European Flax & Silk Heritage'],
            'image' => 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&q=80&w=600',
            'story' => 'Kỹ thuật dệt tơ tằm truyền thống của kinh đô lụa Lyon từ thế kỷ 15. Bề mặt lụa có độ bóng satin sâu thẳm, cấu trúc sợi tơ hình lăng kính tam giác phản chiếu ánh sáng tựa ngọc trai và chứa 18 loại axit amin tương thích tự nhiên với làn da.',
            'products_used_count' => 8,
            'environmental_impact' => [
                'carbon_footprint' => 'Canh tác dâu tằm hữu cơ không dùng phân bón hóa học',
                'water_recycled' => 'Thuốc nhuộm chiết xuất từ khoáng thạch tự nhiên',
                'biodegradability' => 'Phân hủy sinh học hoàn toàn'
            ]
        ],
        [
            'id' => 'fabric_japanese_selvedge',
            'name' => 'Denim Dệt Thoi Con Thoi Cổ Điển (Selvedge Denim)',
            'code' => 'TEX-JP-1120',
            'origin' => 'Kojima, Okayama, Nhật Bản (Japan)',
            'mill' => 'Kuroki Textile Mills (Okayama)',
            'fiber_type' => '100% Bông hữu cơ Supima dệt chặt chẽ',
            'fineness' => '13.5 oz Vải dệt biên chỉ đỏ (Red-Line Selvedge)',
            'weight' => '385 g/m²',
            'certifications' => ['Better Cotton Initiative (BCI)', 'Okayama Craft Heritage'],
            'image' => 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&q=80&w=600',
            'story' => 'Được dệt trên các cỗ máy dệt thoi Toyoda cổ điển từ thập niên 1950 chạy ở tốc độ chậm. Mỗi mét vải mang kết cấu gợn sóng tự nhiên (Slub texture) và được nhuộm sợi chàm tự nhiên (Natural Indigo) qua 24 lần nhúng thủ công.',
            'products_used_count' => 6,
            'environmental_impact' => [
                'carbon_footprint' => 'Độ bền vật lý vượt trội trên 10 năm sử dụng',
                'water_recycled' => 'Quy trình nhuộm chàm tiết kiệm 80% nước',
                'biodegradability' => 'Sợi bông thiên nhiên thuần khiết'
            ]
        ]
    ];

    /**
     * Lấy toàn bộ kho lưu trữ chất liệu kỹ thuật số
     */
    public function getArchive()
    {
        return response()->json([
            'success' => true,
            'fabrics' => $this->fabrics
        ]);
    }

    /**
     * Tra cứu hộ chiếu xuất xứ chất liệu theo mã chứng nhận (Digital Fabric Passport)
     */
    public function verifyPassport(Request $request)
    {
        $code = strtoupper(trim($request->input('code', '')));

        if (!$code) {
            return response()->json([
                'success' => false,
                'message' => 'Vui lòng cung cấp mã chứng nhận xuất xứ vải.'
            ], 400);
        }

        $fabric = collect($this->fabrics)->firstWhere('code', $code);

        if (!$fabric) {
            return response()->json([
                'success' => false,
                'message' => 'Mã vải không tồn tại trong hệ thống kiểm định của TVC-Shop.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'verified' => true,
            'passport_data' => $fabric,
            'verification_timestamp' => now()->toIso8601String()
        ]);
    }
}
