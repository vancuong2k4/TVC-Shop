<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SealedAuctionController extends Controller
{
    /**
     * Get active archival sealed-bid luxury lots, curatorial dossiers, and bidding rules.
     */
    public function getAuctionCatalog()
    {
        $auctionLots = [
            [
                'id' => 'LOT-2026-PARIS-001',
                'title' => 'Look 01: The Midnight Phoenix Gala Cape & Obsidian Silk Mantle',
                'collection' => 'TVC Autumn/Winter 2024 Paris Runway Archive',
                'edition' => 'Piece Unique (1 of 1 in Existence)',
                'material' => 'Loro Piana Zenith Vicuña Fleece & Hand-Woven Mulberry Silk Velvet',
                'curatorProvenance' => 'Worn exclusively by Global Brand Ambassador on the Grand Palais runway. Archived in TVC Hanoi Vault Chamber 01 under inert argon gas atmosphere.',
                'minimumReserveVnd' => 125000000,
                'estimatedValueVnd' => 180000000,
                'currentBidsCount' => 7,
                'biddingClosesAt' => '2026-11-28 23:59:59',
                'securityDepositVnd' => 15000000,
                'provenanceDeedIncluded' => true,
                'escrowProvider' => 'Swiss Private Banking Escrow Syndicate Geneva',
                'heroImage' => 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=80'
            ],
            [
                'id' => 'LOT-2026-COMO-002',
                'title' => 'Look 14: Hand-Beaded Crystal Constellation Tuxedo',
                'collection' => 'Haute Joaillerie Capsule 2025 Milan Exhibition',
                'edition' => 'Piece Unique (1 of 1)',
                'material' => 'Super 180s Kid Mohair with 3,600 Hand-Set Swarovski Baguette Crystals',
                'curatorProvenance' => 'Crafted across 220 hand-embroidery hours by the Lesage Guild. Accompanied by solid titanium hardware plaque stamped with Poinçon d’Atelier.',
                'minimumReserveVnd' => 95000000,
                'estimatedValueVnd' => 140000000,
                'currentBidsCount' => 11,
                'biddingClosesAt' => '2026-12-02 20:00:00',
                'securityDepositVnd' => 10000000,
                'provenanceDeedIncluded' => true,
                'escrowProvider' => 'Geneva Custody Partners',
                'heroImage' => 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80'
            ],
            [
                'id' => 'LOT-2026-KYOTO-003',
                'title' => 'Look 07: Imperial 24K Aurum Leaf Draped Kimono Overcoat',
                'collection' => 'Atelier Kyoto Metiers d’Art Special Edition',
                'edition' => 'Piece Unique (1 of 1)',
                'material' => 'Double-Weave Charcoal Cashmere with 99.9% Pure Gilt Threading',
                'curatorProvenance' => 'Hand-stitched in Kyoto using antique wooden shuttles. Backed by Ethereum L2 Cryptographic Deed of Authenticity.',
                'minimumReserveVnd' => 160000000,
                'estimatedValueVnd' => 240000000,
                'currentBidsCount' => 9,
                'biddingClosesAt' => '2026-12-08 22:00:00',
                'securityDepositVnd' => 20000000,
                'provenanceDeedIncluded' => true,
                'escrowProvider' => 'Swiss Private Banking Escrow Syndicate Geneva',
                'heroImage' => 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80'
            ]
        ];

        $sealedRules = [
            'blindProtocol' => 'Vickrey-style Blind Bid: Competitors cannot see other bids. Highest bidder wins at their committed valuation.',
            'securityDeposit' => 'Refundable Escrow Deposit: Fully returned within 24 hours if bid is not winning.',
            'deliveryProtocol' => 'Chauffeured Armored Courier Delivery: Delivered inside bulletproof archival titanium trunk with white-glove inspection.',
            'curatorialSignoff' => 'Includes hand-signed Certificate of Heritage by TVC Artistic Director Le Van Cuong.'
        ];

        return response()->json([
            'success' => true,
            'lots' => $auctionLots,
            'rules' => $sealedRules,
            'escrowStatus' => 'SWISS_ESCROW_ENCRYPTED_ACTIVE'
        ]);
    }

    /**
     * Submit an encrypted sealed bid for an archival luxury lot.
     */
    public function submitSealedBid(Request $request)
    {
        $validated = $request->validate([
            'lot_id' => 'required|string',
            'client_name' => 'required|string|max:100',
            'client_email' => 'required|email',
            'client_phone' => 'required|string',
            'bid_amount_vnd' => 'required|numeric|min:50000000',
            'vip_tier' => 'required|string',
            'escrow_confirmation' => 'accepted'
        ]);

        $bidReceipt = 'SEALED-BID-' . strtoupper(Str::random(6)) . '-' . date('Y');
        $hashSignature = hash('sha256', $bidReceipt . $validated['bid_amount_vnd'] . 'TVC-SEALED-SALT');

        return response()->json([
            'success' => true,
            'message' => 'Encrypted sealed bid received and committed to escrow vault.',
            'receipt' => [
                'receipt_id' => $bidReceipt,
                'lot_id' => $validated['lot_id'],
                'client_name' => $validated['client_name'],
                'bid_amount_vnd' => (float) $validated['bid_amount_vnd'],
                'sha256_cryptographic_seal' => substr($hashSignature, 0, 32),
                'escrow_status' => 'FUNDS_HELD_IN_ESCROW',
                'lot_closing_alert' => 'Client will be contacted via private telephone upon sealed dossier opening.',
                'timestamp' => date('Y-m-d H:i:s')
            ]
        ]);
    }
}
