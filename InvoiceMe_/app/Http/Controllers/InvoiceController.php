<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Client;
use Barryvdh\DomPDF\Facade\Pdf;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InvoiceController extends Controller
{

    private const EU_COUNTRIES = [
        'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
        'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
        'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE',

        'France', 'Allemagne', 'Belgique', 'Espagne', 'Italie', 'Portugal',
        'Pays-Bas', 'Autriche', 'Irlande', 'Grèce', 'Pologne', 'Suède',
        'Finlande', 'Danemark', 'République tchèque', 'Roumanie', 'Hongrie',
        'Bulgarie', 'Croatie', 'Slovaquie', 'Slovénie', 'Lituanie', 'Lettonie',
        'Estonie', 'Luxembourg', 'Malte', 'Chypre',
    ];


    private function calculateTvaRate(Client $client, $organizationCountry = 'France'): float
    {
        $clientCountry = $client->pays ?? 'France';

        if (in_array($clientCountry, ['France', 'FR'])) {
            return 20.00;
        }

        if (in_array($clientCountry, self::EU_COUNTRIES) && !empty($client->tva_intracommunautaire)) {
            return 0.00;
        }

        if (in_array($clientCountry, self::EU_COUNTRIES)) {
            return 20.00;
        }

        return 0.00;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $invoices = Invoice::where('organization_id', $request->user()->organization_id)
            ->with('client:id,nom,email')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['invoices' => $invoices]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'title' => 'required|string|max:255',
            'date_of_issue' => 'required|date',
            'due_date' => 'required|date|after_or_equal:date_of_issue',
            'items' => 'required|array|min:1',
            'items.*.nom' => 'required|string|max:255',
            'items.*.description' => 'nullable|string',
            'items.*.quantite' => 'required|integer|min:1',
            'items.*.prix_unitaire' => 'required|numeric|min:0',
        ]);

        $client = Client::where('id', $validated['client_id'])
            ->where('organization_id', $request->user()->organization_id)
            ->first();

        if (!$client) {
            return response()->json(['message' => 'Client non trouvé'], 404);
        }

        DB::beginTransaction();
        try {
            $totalHT = collect($validated['items'])->sum(function ($item) {
                return $item['quantite'] * $item['prix_unitaire'];
            });

            $tvaRate = $this->calculateTvaRate($client);
            $totalTVA = $totalHT * $tvaRate / 100;
            $totalTTC = $totalHT + $totalTVA;

            $lastInvoice = Invoice::where('organization_id', $request->user()->organization_id)
                ->orderBy('id', 'desc')
                ->first();
            $nextNumber = $lastInvoice ? intval(substr($lastInvoice->invoice_number, 4)) + 1 : 1;
            $invoiceNumber = 'FAC-' . str_pad($nextNumber, 5, '0', STR_PAD_LEFT);

            $invoice = Invoice::create([
                'client_id' => $validated['client_id'],
                'organization_id' => $request->user()->organization_id,
                'title' => $validated['title'],
                'status' => 'draft',
                'invoice_number' => $invoiceNumber,
                'date_of_issue' => $validated['date_of_issue'],
                'due_date' => $validated['due_date'],
                'total_ht' => $totalHT,
                'tva_rate' => $tvaRate,
                'total_tva' => $totalTVA,
                'total_amount' => $totalTTC,
            ]);

            foreach ($validated['items'] as $item) {
                InvoiceItem::create([
                    'invoice_id' => $invoice->id,
                    'nom' => $item['nom'],
                    'description' => $item['description'] ?? null,
                    'quantite' => $item['quantite'],
                    'prix_unitaire' => $item['prix_unitaire'],
                ]);
            }

            DB::commit();
            $invoice->load('items', 'client');

            return response()->json([
                'message' => 'Facture créée',
                'invoice' => $invoice,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Erreur création'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, string $id)
    {
        $invoice = Invoice::where('id', $id)
            ->where('organization_id', $request->user()->organization_id)
            ->with(['items', 'client'])
            ->first();

        if (!$invoice) {
            return response()->json(['message' => 'Facture non trouvée'], 404);
        }

        return response()->json(['invoice' => $invoice]);
    }

    public function update(Request $request, string $id)
    {
        $invoice = Invoice::where('id', $id)
            ->where('organization_id', $request->user()->organization_id)
            ->first();

        if (!$invoice) {
            return response()->json(['message' => 'Facture non trouvée'], 404);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'status' => 'sometimes|in:draft,sent,paid,overdue,cancelled',
            'date_of_issue' => 'sometimes|date',
            'due_date' => 'sometimes|date',
        ]);

        $invoice->update($validated);

        return response()->json([
            'message' => 'Facture mise à jour',
            'invoice' => $invoice,
        ]);
    }

    public function destroy(Request $request, string $id)
    {
        $invoice = Invoice::where('id', $id)
            ->where('organization_id', $request->user()->organization_id)
            ->first();

        if (!$invoice) {
            return response()->json(['message' => 'Facture non trouvée'], 404);
        }

        $invoice->items()->delete();
        $invoice->delete();

        return response()->json(['message' => 'Facture supprimée']);
    }

    public function downloadPdf(Request $request, string $id)
    {
        $invoice = Invoice::where('id', $id)
            ->where('organization_id', $request->user()->organization_id)
            ->with(['items', 'client', 'organization'])
            ->first();

        if (!$invoice) {
            return response()->json(['message' => 'Facture non trouvée'], 404);
        }

        $pdf = Pdf::loadView('invoices.pdf', ['invoice' => $invoice]);

        return $pdf->download('facture-' . $invoice->invoice_number . '.pdf');
    }

}
