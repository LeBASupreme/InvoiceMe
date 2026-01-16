<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ChatController extends Controller
{
    public function chat(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:2000',
            'history' => 'array|max:10',
        ]);

        $apiKey = config('services.openai.key');
        $user = $request->user();
        $organizationId = $user->organization_id;

        if (!$apiKey) {
            return response()->json([
                'message' => 'Clé API OpenAI non configurée'
            ], 500);
        }

        $clients = Client::where('organization_id', $organizationId)->get(['id', 'nom', 'email', 'telephone', 'adresse', 'ville', 'pays']);
        $invoices = Invoice::with('client:id,nom')->where('organization_id', $organizationId)->get(['id', 'client_id', 'title', 'invoice_number', 'status', 'total_amount', 'date_of_issue', 'due_date']);

        $clientsList = $clients->map(function($c) {
            return "- ID:{$c->id} | {$c->nom} | {$c->email} | {$c->ville}";
        })->implode("\n");

        $invoicesList = $invoices->map(function($f) {
            $clientName = $f->client ? $f->client->nom : 'N/A';
            return "- ID:{$f->id} | {$f->invoice_number} | {$f->title} | Client: {$clientName} | {$f->status} | {$f->total_amount}€";
        })->implode("\n");

        $systemContext = "Tu es un assistant intelligent pour InvoiceMe, une application de facturation. Tu peux aider l'utilisateur à gérer ses clients et factures.

UTILISATEUR CONNECTÉ:
- Nom: {$user->prenom} {$user->nom}
- Email: {$user->email}

CLIENTS DE L'UTILISATEUR (" . count($clients) . "):
{$clientsList}

FACTURES DE L'UTILISATEUR (" . count($invoices) . "):
{$invoicesList}
CAPACITÉS:
Tu peux exécuter ces actions en appelant les fonctions appropriées:
1. Créer un client (create_client)
2. Modifier un client (update_client)
3. Supprimer un client (delete_client)
4. Créer une facture (create_invoice)
5. Modifier le statut d'une facture (update_invoice_status)
6. Supprimer une facture (delete_invoice)
7. Lister les clients (list_clients)
8. Lister les factures (list_invoices)

Réponds toujours en français de manière professionnelle et concise. Quand tu effectues une action, confirme-la clairement.";

        $messages = [
            ['role' => 'system', 'content' => $systemContext]
        ];

        // Ajouter l'historique
        if ($request->has('history')) {
            foreach ($request->history as $msg) {
                if (isset($msg['role']) && isset($msg['content'])) {
                    $messages[] = [
                        'role' => $msg['role'],
                        'content' => $msg['content']
                    ];
                }
            }
        }

        $messages[] = ['role' => 'user', 'content' => $request->message];

        // Définir les fonctions disponibles
        $tools = $this->getTools();

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type' => 'application/json',
            ])->timeout(60)->post('https://api.openai.com/v1/chat/completions', [
                'model' => 'gpt-4o-mini',
                'messages' => $messages,
                'tools' => $tools,
                'tool_choice' => 'auto',
                'max_tokens' => 2000,
                'temperature' => 0.7,
            ]);

            if (!$response->successful()) {
                return response()->json([
                    'message' => 'Erreur API OpenAI: ' . $response->body()
                ], 500);
            }

            $data = $response->json();
            $assistantMessage = $data['choices'][0]['message'];

            // Vérifier si l'assistant veut appeler une fonction
            if (isset($assistantMessage['tool_calls'])) {
                $toolResults = [];

                foreach ($assistantMessage['tool_calls'] as $toolCall) {
                    $functionName = $toolCall['function']['name'];
                    $arguments = json_decode($toolCall['function']['arguments'], true);

                    $result = $this->executeFunction($functionName, $arguments, $organizationId);
                    $toolResults[] = [
                        'tool_call_id' => $toolCall['id'],
                        'role' => 'tool',
                        'content' => json_encode($result, JSON_UNESCAPED_UNICODE)
                    ];
                }

                // Renvoyer à OpenAI avec les résultats des fonctions
                $messages[] = $assistantMessage;
                foreach ($toolResults as $toolResult) {
                    $messages[] = $toolResult;
                }

                $followUpResponse = Http::withHeaders([
                    'Authorization' => 'Bearer ' . $apiKey,
                    'Content-Type' => 'application/json',
                ])->timeout(60)->post('https://api.openai.com/v1/chat/completions', [
                    'model' => 'gpt-4o-mini',
                    'messages' => $messages,
                    'max_tokens' => 2000,
                    'temperature' => 0.7,
                ]);

                if ($followUpResponse->successful()) {
                    $followUpData = $followUpResponse->json();
                    return response()->json([
                        'reply' => $followUpData['choices'][0]['message']['content']
                    ]);
                }
            }

            return response()->json([
                'reply' => $assistantMessage['content']
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur: ' . $e->getMessage()
            ], 500);
        }
    }

    private function getTools(): array
    {
        return [
            [
                'type' => 'function',
                'function' => [
                    'name' => 'create_client',
                    'description' => 'Créer un nouveau client',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'nom' => ['type' => 'string', 'description' => 'Nom du client ou de l\'entreprise'],
                            'email' => ['type' => 'string', 'description' => 'Email du client'],
                            'telephone' => ['type' => 'string', 'description' => 'Numéro de téléphone'],
                            'adresse' => ['type' => 'string', 'description' => 'Adresse postale'],
                            'code_postal' => ['type' => 'string', 'description' => 'Code postal'],
                            'ville' => ['type' => 'string', 'description' => 'Ville'],
                            'pays' => ['type' => 'string', 'description' => 'Pays'],
                            'siret' => ['type' => 'string', 'description' => 'Numéro SIRET'],
                        ],
                        'required' => ['nom']
                    ]
                ]
            ],
            [
                'type' => 'function',
                'function' => [
                    'name' => 'update_client',
                    'description' => 'Modifier un client existant',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'client_id' => ['type' => 'integer', 'description' => 'ID du client à modifier'],
                            'nom' => ['type' => 'string', 'description' => 'Nouveau nom'],
                            'email' => ['type' => 'string', 'description' => 'Nouvel email'],
                            'telephone' => ['type' => 'string', 'description' => 'Nouveau téléphone'],
                            'adresse' => ['type' => 'string', 'description' => 'Nouvelle adresse'],
                            'ville' => ['type' => 'string', 'description' => 'Nouvelle ville'],
                            'pays' => ['type' => 'string', 'description' => 'Nouveau pays'],
                        ],
                        'required' => ['client_id']
                    ]
                ]
            ],
            [
                'type' => 'function',
                'function' => [
                    'name' => 'delete_client',
                    'description' => 'Supprimer un client',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'client_id' => ['type' => 'integer', 'description' => 'ID du client à supprimer'],
                        ],
                        'required' => ['client_id']
                    ]
                ]
            ],
            [
                'type' => 'function',
                'function' => [
                    'name' => 'create_invoice',
                    'description' => 'Créer une nouvelle facture',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'client_id' => ['type' => 'integer', 'description' => 'ID du client'],
                            'title' => ['type' => 'string', 'description' => 'Titre de la facture'],
                            'due_date' => ['type' => 'string', 'description' => 'Date d\'échéance (format: YYYY-MM-DD)'],
                            'items' => [
                                'type' => 'array',
                                'description' => 'Liste des articles/services',
                                'items' => [
                                    'type' => 'object',
                                    'properties' => [
                                        'nom' => ['type' => 'string', 'description' => 'Nom de l\'article'],
                                        'description' => ['type' => 'string', 'description' => 'Description'],
                                        'quantite' => ['type' => 'number', 'description' => 'Quantité'],
                                        'prix_unitaire' => ['type' => 'number', 'description' => 'Prix unitaire HT'],
                                    ],
                                    'required' => ['nom', 'quantite', 'prix_unitaire']
                                ]
                            ]
                        ],
                        'required' => ['client_id', 'title', 'items']
                    ]
                ]
            ],
            [
                'type' => 'function',
                'function' => [
                    'name' => 'update_invoice_status',
                    'description' => 'Modifier le statut d\'une facture (draft, sent, paid, overdue, cancelled)',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'invoice_id' => ['type' => 'integer', 'description' => 'ID de la facture'],
                            'status' => ['type' => 'string', 'enum' => ['draft', 'sent', 'paid', 'overdue', 'cancelled'], 'description' => 'Nouveau statut'],
                        ],
                        'required' => ['invoice_id', 'status']
                    ]
                ]
            ],
            [
                'type' => 'function',
                'function' => [
                    'name' => 'delete_invoice',
                    'description' => 'Supprimer une facture',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'invoice_id' => ['type' => 'integer', 'description' => 'ID de la facture à supprimer'],
                        ],
                        'required' => ['invoice_id']
                    ]
                ]
            ],
            [
                'type' => 'function',
                'function' => [
                    'name' => 'list_clients',
                    'description' => 'Lister tous les clients avec leurs détails',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => (object)[],
                    ]
                ]
            ],
            [
                'type' => 'function',
                'function' => [
                    'name' => 'list_invoices',
                    'description' => 'Lister toutes les factures avec leurs détails',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'status' => ['type' => 'string', 'description' => 'Filtrer par statut (optionnel)'],
                            'client_id' => ['type' => 'integer', 'description' => 'Filtrer par client (optionnel)'],
                        ],
                    ]
                ]
            ],
        ];
    }

    private function executeFunction(string $name, array $args, int $organizationId): array
    {
        switch ($name) {
            case 'create_client':
                return $this->createClient($args, $organizationId);
            case 'update_client':
                return $this->updateClient($args, $organizationId);
            case 'delete_client':
                return $this->deleteClient($args, $organizationId);
            case 'create_invoice':
                return $this->createInvoice($args, $organizationId);
            case 'update_invoice_status':
                return $this->updateInvoiceStatus($args, $organizationId);
            case 'delete_invoice':
                return $this->deleteInvoice($args, $organizationId);
            case 'list_clients':
                return $this->listClients($organizationId);
            case 'list_invoices':
                return $this->listInvoices($args, $organizationId);
            default:
                return ['error' => 'Fonction inconnue'];
        }
    }

    private function createClient(array $args, int $organizationId): array
    {
        try {
            $client = Client::create([
                'organization_id' => $organizationId,
                'nom' => $args['nom'],
                'email' => $args['email'] ?? null,
                'telephone' => $args['telephone'] ?? null,
                'adresse' => $args['adresse'] ?? null,
                'code_postal' => $args['code_postal'] ?? null,
                'ville' => $args['ville'] ?? null,
                'pays' => $args['pays'] ?? 'France',
                'siret' => $args['siret'] ?? null,
            ]);

            return [
                'success' => true,
                'message' => "Client '{$client->nom}' créé avec succès",
                'client_id' => $client->id,
                'client' => $client->toArray()
            ];
        } catch (\Exception $e) {
            return ['error' => 'Erreur lors de la création: ' . $e->getMessage()];
        }
    }

    private function updateClient(array $args, int $organizationId): array
    {
        $client = Client::where('id', $args['client_id'])
            ->where('organization_id', $organizationId)
            ->first();

        if (!$client) {
            return ['error' => 'Client non trouvé'];
        }

        try {
            $updateData = array_filter([
                'nom' => $args['nom'] ?? null,
                'email' => $args['email'] ?? null,
                'telephone' => $args['telephone'] ?? null,
                'adresse' => $args['adresse'] ?? null,
                'ville' => $args['ville'] ?? null,
                'pays' => $args['pays'] ?? null,
            ]);

            $client->update($updateData);

            return [
                'success' => true,
                'message' => "Client '{$client->nom}' mis à jour",
                'client' => $client->fresh()->toArray()
            ];
        } catch (\Exception $e) {
            return ['error' => 'Erreur lors de la mise à jour: ' . $e->getMessage()];
        }
    }

    private function deleteClient(array $args, int $organizationId): array
    {
        $client = Client::where('id', $args['client_id'])
            ->where('organization_id', $organizationId)
            ->first();

        if (!$client) {
            return ['error' => 'Client non trouvé'];
        }

        $clientName = $client->nom;

        // Vérifier s'il y a des factures liées
        $invoiceCount = Invoice::where('client_id', $client->id)->count();
        if ($invoiceCount > 0) {
            return ['error' => "Impossible de supprimer: ce client a {$invoiceCount} facture(s) associée(s)"];
        }

        $client->delete();

        return [
            'success' => true,
            'message' => "Client '{$clientName}' supprimé avec succès"
        ];
    }

    private function createInvoice(array $args, int $organizationId): array
    {
        $client = Client::where('id', $args['client_id'])
            ->where('organization_id', $organizationId)
            ->first();

        if (!$client) {
            return ['error' => 'Client non trouvé'];
        }

        try {
            // Générer le numéro de facture
            $lastInvoice = Invoice::where('organization_id', $organizationId)
                ->orderBy('id', 'desc')
                ->first();
            $nextNumber = $lastInvoice ? intval(substr($lastInvoice->invoice_number, 4)) + 1 : 1;
            $invoiceNumber = 'FAC-' . str_pad($nextNumber, 5, '0', STR_PAD_LEFT);

            // Calculer les totaux
            $totalHt = 0;
            foreach ($args['items'] as $item) {
                $totalHt += $item['quantite'] * $item['prix_unitaire'];
            }

            // Déterminer le taux de TVA
            $tvaRate = 20; // France par défaut
            if ($client->pays && $client->pays !== 'France') {
                $tvaRate = 0; // Hors France = 0% (simplification)
            }

            $totalTva = $totalHt * ($tvaRate / 100);
            $totalAmount = $totalHt + $totalTva;

            $invoice = Invoice::create([
                'organization_id' => $organizationId,
                'client_id' => $client->id,
                'title' => $args['title'],
                'invoice_number' => $invoiceNumber,
                'status' => 'draft',
                'date_of_issue' => now()->format('Y-m-d'),
                'due_date' => $args['due_date'] ?? now()->addDays(30)->format('Y-m-d'),
                'total_ht' => $totalHt,
                'tva_rate' => $tvaRate,
                'total_tva' => $totalTva,
                'total_amount' => $totalAmount,
            ]);

            // Créer les items
            foreach ($args['items'] as $item) {
                InvoiceItem::create([
                    'invoice_id' => $invoice->id,
                    'nom' => $item['nom'],
                    'description' => $item['description'] ?? null,
                    'quantite' => $item['quantite'],
                    'prix_unitaire' => $item['prix_unitaire'],
                ]);
            }

            return [
                'success' => true,
                'message' => "Facture {$invoiceNumber} créée pour {$client->nom}",
                'invoice_id' => $invoice->id,
                'invoice_number' => $invoiceNumber,
                'total_ht' => number_format($totalHt, 2) . '€',
                'total_tva' => number_format($totalTva, 2) . '€',
                'total_ttc' => number_format($totalAmount, 2) . '€',
            ];
        } catch (\Exception $e) {
            return ['error' => 'Erreur lors de la création: ' . $e->getMessage()];
        }
    }

    private function updateInvoiceStatus(array $args, int $organizationId): array
    {
        $invoice = Invoice::where('id', $args['invoice_id'])
            ->where('organization_id', $organizationId)
            ->first();

        if (!$invoice) {
            return ['error' => 'Facture non trouvée'];
        }

        $oldStatus = $invoice->status;
        $invoice->update(['status' => $args['status']]);

        $statusLabels = [
            'draft' => 'Brouillon',
            'sent' => 'Envoyée',
            'paid' => 'Payée',
            'overdue' => 'En retard',
            'cancelled' => 'Annulée'
        ];

        return [
            'success' => true,
            'message' => "Facture {$invoice->invoice_number} : statut changé de '{$statusLabels[$oldStatus]}' à '{$statusLabels[$args['status']]}'"
        ];
    }

    private function deleteInvoice(array $args, int $organizationId): array
    {
        $invoice = Invoice::where('id', $args['invoice_id'])
            ->where('organization_id', $organizationId)
            ->first();

        if (!$invoice) {
            return ['error' => 'Facture non trouvée'];
        }

        $invoiceNumber = $invoice->invoice_number;

        // Supprimer les items d'abord
        InvoiceItem::where('invoice_id', $invoice->id)->delete();
        $invoice->delete();

        return [
            'success' => true,
            'message' => "Facture {$invoiceNumber} supprimée avec succès"
        ];
    }

    private function listClients(int $organizationId): array
    {
        $clients = Client::where('organization_id', $organizationId)
            ->orderBy('nom')
            ->get();

        return [
            'success' => true,
            'count' => $clients->count(),
            'clients' => $clients->map(function($c) {
                return [
                    'id' => $c->id,
                    'nom' => $c->nom,
                    'email' => $c->email,
                    'telephone' => $c->telephone,
                    'ville' => $c->ville,
                    'pays' => $c->pays,
                ];
            })->toArray()
        ];
    }

    private function listInvoices(array $args, int $organizationId): array
    {
        $query = Invoice::with('client:id,nom')
            ->where('organization_id', $organizationId);

        if (!empty($args['status'])) {
            $query->where('status', $args['status']);
        }
        if (!empty($args['client_id'])) {
            $query->where('client_id', $args['client_id']);
        }

        $invoices = $query->orderBy('created_at', 'desc')->get();

        $statusLabels = [
            'draft' => 'Brouillon',
            'sent' => 'Envoyée',
            'paid' => 'Payée',
            'overdue' => 'En retard',
            'cancelled' => 'Annulée'
        ];

        return [
            'success' => true,
            'count' => $invoices->count(),
            'invoices' => $invoices->map(function($f) use ($statusLabels) {
                return [
                    'id' => $f->id,
                    'numero' => $f->invoice_number,
                    'titre' => $f->title,
                    'client' => $f->client ? $f->client->nom : 'N/A',
                    'statut' => isset($statusLabels[$f->status]) ? $statusLabels[$f->status] : $f->status,
                    'total_ttc' => number_format($f->total_amount, 2) . '€',
                    'date_emission' => $f->date_of_issue,
                    'date_echeance' => $f->due_date,
                ];
            })->toArray()
        ];
    }
}
