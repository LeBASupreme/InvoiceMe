<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Facture {{ $invoice->invoice_number }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 11px;
            color: #333;
            line-height: 1.5;
            background: #fff;
        }

        .container {
            padding: 40px;
        }

        /* Header */
        .header {
            display: table;
            width: 100%;
            margin-bottom: 40px;
        }

        .header-left {
            display: table-cell;
            width: 50%;
            vertical-align: top;
        }

        .header-right {
            display: table-cell;
            width: 50%;
            vertical-align: top;
            text-align: right;
        }

        .logo-placeholder {
            width: 60px;
            height: 60px;
            background: #1e293b;
            border-radius: 8px;
            margin-bottom: 15px;
        }

        .company-name {
            font-size: 18px;
            font-weight: bold;
            color: #1a1a2e;
            margin-bottom: 5px;
        }

        .company-details {
            color: #666;
            font-size: 10px;
        }

        .invoice-title {
            font-size: 32px;
            font-weight: bold;
            color: #1e293b;
            letter-spacing: 2px;
            margin-bottom: 10px;
        }

        .invoice-number {
            font-size: 12px;
            color: #666;
            margin-bottom: 5px;
        }

        .status-badge {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .status-draft { background: #f1f5f9; color: #475569; }
        .status-sent { background: #e0f2fe; color: #0369a1; }
        .status-paid { background: #dcfce7; color: #166534; }
        .status-overdue { background: #fef2f2; color: #dc2626; }
        .status-cancelled { background: #f1f5f9; color: #64748b; }

        /* Info Section */
        .info-section {
            display: table;
            width: 100%;
            margin-bottom: 40px;
        }

        .info-box {
            display: table-cell;
            width: 33.33%;
            padding-right: 20px;
            vertical-align: top;
        }

        .info-box:last-child {
            padding-right: 0;
        }

        .info-label {
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #999;
            margin-bottom: 8px;
            font-weight: bold;
        }

        .info-value {
            font-size: 11px;
            color: #333;
        }

        .info-value strong {
            font-size: 13px;
            color: #1a1a2e;
            display: block;
            margin-bottom: 3px;
        }

        /* Dates Box */
        .dates-box {
            background: #f8fafc;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 30px;
        }

        .dates-row {
            display: table;
            width: 100%;
        }

        .date-item {
            display: table-cell;
            width: 50%;
        }

        .date-label {
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #999;
            margin-bottom: 5px;
        }

        .date-value {
            font-size: 14px;
            font-weight: bold;
            color: #1a1a2e;
        }

        /* Table */
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }

        .items-table thead tr {
            background: #1e293b;
        }

        .items-table th {
            padding: 12px 15px;
            text-align: left;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #fff;
            font-weight: bold;
        }

        .items-table th:last-child,
        .items-table th:nth-child(2),
        .items-table th:nth-child(3) {
            text-align: right;
        }

        .items-table td {
            padding: 15px;
            border-bottom: 1px solid #eee;
            vertical-align: top;
        }

        .items-table td:last-child,
        .items-table td:nth-child(2),
        .items-table td:nth-child(3) {
            text-align: right;
        }

        .items-table tbody tr:nth-child(even) {
            background: #fafafa;
        }

        .item-name {
            font-weight: bold;
            color: #1a1a2e;
            margin-bottom: 3px;
        }

        .item-description {
            font-size: 10px;
            color: #666;
        }

        /* Totals */
        .totals-section {
            display: table;
            width: 100%;
        }

        .totals-spacer {
            display: table-cell;
            width: 50%;
        }

        .totals-box {
            display: table-cell;
            width: 50%;
        }

        .totals-row {
            display: table;
            width: 100%;
            margin-bottom: 8px;
        }

        .totals-label {
            display: table-cell;
            width: 50%;
            text-align: right;
            padding-right: 20px;
            color: #666;
        }

        .totals-value {
            display: table-cell;
            width: 50%;
            text-align: right;
            font-weight: bold;
        }

        .totals-row.grand-total {
            background: #1e293b;
            margin-top: 10px;
            border-radius: 5px;
        }

        .totals-row.grand-total .totals-label,
        .totals-row.grand-total .totals-value {
            color: #fff;
            padding: 12px 15px;
            font-size: 14px;
        }

        /* Footer */
        .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 2px solid #eee;
        }

        .footer-content {
            display: table;
            width: 100%;
        }

        .footer-left {
            display: table-cell;
            width: 60%;
            vertical-align: top;
        }

        .footer-right {
            display: table-cell;
            width: 40%;
            vertical-align: top;
            text-align: right;
        }

        .payment-info {
            background: #f8fafc;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
        }

        .payment-title {
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #1e293b;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .payment-details {
            font-size: 10px;
            color: #666;
        }

        .thank-you {
            font-size: 16px;
            color: #1e293b;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .generated-date {
            font-size: 9px;
            color: #999;
        }

        /* Legal */
        .legal-notice {
            margin-top: 20px;
            padding: 15px;
            background: #f8fafc;
            border-left: 3px solid #cbd5e1;
            font-size: 9px;
            color: #64748b;
        }

        .tva-notice {
            margin-top: 15px;
            padding: 10px 15px;
            background: #f0fdf4;
            border-left: 3px solid #22c55e;
            font-size: 9px;
            color: #166534;
            font-style: italic;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="header-left">
                <div class="logo-placeholder"></div>
                <div class="company-name">{{ $invoice->organization->nom }}</div>
                <div class="company-details">
                    {{ $invoice->organization->adresse }}<br>
                    {{ $invoice->organization->code_postal }} {{ $invoice->organization->ville }}<br>
                    {{ $invoice->organization->pays ?? 'France' }}
                    @if($invoice->organization->siret)
                        <br>SIRET: {{ $invoice->organization->siret }}
                    @endif
                    @if($invoice->organization->tva_intracommunautaire)
                        <br>TVA: {{ $invoice->organization->tva_intracommunautaire }}
                    @endif
                </div>
            </div>
            <div class="header-right">
                <div class="invoice-title">FACTURE</div>
                <div class="invoice-number">N° {{ $invoice->invoice_number }}</div>
                @php
                    $statusClass = [
                        'draft' => 'status-draft',
                        'sent' => 'status-sent',
                        'paid' => 'status-paid',
                        'overdue' => 'status-overdue',
                        'cancelled' => 'status-cancelled',
                    ][$invoice->status] ?? 'status-draft';

                    $statusLabel = [
                        'draft' => 'Brouillon',
                        'sent' => 'Envoyée',
                        'paid' => 'Payée',
                        'overdue' => 'En retard',
                        'cancelled' => 'Annulée',
                    ][$invoice->status] ?? 'Brouillon';
                @endphp
                <span class="status-badge {{ $statusClass }}">{{ $statusLabel }}</span>
            </div>
        </div>

        <!-- Dates -->
        <div class="dates-box">
            <div class="dates-row">
                <div class="date-item">
                    <div class="date-label">Date d'émission</div>
                    <div class="date-value">{{ \Carbon\Carbon::parse($invoice->date_of_issue)->format('d/m/Y') }}</div>
                </div>
                <div class="date-item">
                    <div class="date-label">Date d'échéance</div>
                    <div class="date-value">{{ \Carbon\Carbon::parse($invoice->due_date)->format('d/m/Y') }}</div>
                </div>
            </div>
        </div>

        <!-- Client Info -->
        <div class="info-section">
            <div class="info-box">
                <div class="info-label">Facturé à</div>
                <div class="info-value">
                    <strong>{{ $invoice->client->nom }}</strong>
                    {{ $invoice->client->adresse }}<br>
                    {{ $invoice->client->code_postal }} {{ $invoice->client->ville }}<br>
                    {{ $invoice->client->pays ?? 'France' }}
                    @if($invoice->client->siret)
                        <br>SIRET: {{ $invoice->client->siret }}
                    @endif
                </div>
            </div>
            <div class="info-box">
                <div class="info-label">Contact</div>
                <div class="info-value">
                    @if($invoice->client->email)
                        {{ $invoice->client->email }}<br>
                    @endif
                    @if($invoice->client->telephone)
                        {{ $invoice->client->telephone }}
                    @endif
                </div>
            </div>
            <div class="info-box">
                <div class="info-label">Objet</div>
                <div class="info-value">
                    <strong>{{ $invoice->title }}</strong>
                </div>
            </div>
        </div>

        <!-- Items Table -->
        <table class="items-table">
            <thead>
                <tr>
                    <th style="width: 50%;">Description</th>
                    <th style="width: 15%;">Quantité</th>
                    <th style="width: 17%;">Prix unitaire</th>
                    <th style="width: 18%;">Total</th>
                </tr>
            </thead>
            <tbody>
                @php $subtotal = 0; @endphp
                @foreach($invoice->items as $item)
                    @php
                        $lineTotal = $item->quantite * $item->prix_unitaire;
                        $subtotal += $lineTotal;
                    @endphp
                    <tr>
                        <td>
                            <div class="item-name">{{ $item->nom }}</div>
                            @if($item->description)
                                <div class="item-description">{{ $item->description }}</div>
                            @endif
                        </td>
                        <td>{{ $item->quantite }}</td>
                        <td>{{ number_format($item->prix_unitaire, 2, ',', ' ') }} €</td>
                        <td>{{ number_format($lineTotal, 2, ',', ' ') }} €</td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        <!-- Totals -->
        @php
            $tvaRate = $invoice->tva_rate ?? 20;
            $totalHT = $invoice->total_ht ?? $subtotal;
            $totalTVA = $invoice->total_tva ?? ($totalHT * $tvaRate / 100);
            $totalTTC = $totalHT + $totalTVA;
        @endphp
        <div class="totals-section">
            <div class="totals-spacer"></div>
            <div class="totals-box">
                <div class="totals-row">
                    <div class="totals-label">Total HT</div>
                    <div class="totals-value">{{ number_format($totalHT, 2, ',', ' ') }} €</div>
                </div>
                <div class="totals-row">
                    <div class="totals-label">TVA ({{ number_format($tvaRate, 0) }}%)</div>
                    <div class="totals-value">{{ number_format($totalTVA, 2, ',', ' ') }} €</div>
                </div>
                <div class="totals-row grand-total">
                    <div class="totals-label">TOTAL TTC</div>
                    <div class="totals-value">{{ number_format($totalTTC, 2, ',', ' ') }} €</div>
                </div>
            </div>
        </div>

        <!-- Mention TVA spéciale -->
        @if($tvaRate == 0)
            <div class="tva-notice">
                @if($invoice->client->pays && !in_array($invoice->client->pays, ['France', 'FR']))
                    @if($invoice->client->tva_intracommunautaire)
                        TVA non applicable - Article 262 ter I du CGI (Livraison intracommunautaire)
                    @else
                        TVA non applicable - Article 262 I du CGI (Exportation)
                    @endif
                @else
                    TVA non applicable - Article 293 B du CGI (Franchise en base)
                @endif
            </div>
        @endif

        <!-- Footer -->
        <div class="footer">
            <div class="footer-content">
                <div class="footer-left">
                    <div class="payment-info">
                        <div class="payment-title">Informations de paiement</div>
                        <div class="payment-details">
                            Paiement par virement bancaire ou chèque à l'ordre de {{ $invoice->organization->nom }}.<br>
                            Merci de mentionner le numéro de facture {{ $invoice->invoice_number }} lors du règlement.
                        </div>
                    </div>
                    @if($invoice->status !== 'paid')
                        <div class="legal-notice">
                            En cas de retard de paiement, une pénalité de 3 fois le taux d'intérêt légal sera appliquée,
                            ainsi qu'une indemnité forfaitaire de 40€ pour frais de recouvrement.
                        </div>
                    @endif
                </div>
                <div class="footer-right">
                    <div class="thank-you">Merci pour votre confiance !</div>
                    <div class="generated-date">
                        Document généré le {{ now()->format('d/m/Y à H:i') }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
