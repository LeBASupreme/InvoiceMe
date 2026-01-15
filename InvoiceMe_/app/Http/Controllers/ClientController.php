<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $clients = Client::where('organization_id', $request->user()->organization_id)
            ->orderBy('nom')
            ->get();

            return response()->json([
                'clients' => $clients,
        ]);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'telephone' => 'nullable|string|max:20',
            'adresse' => 'nullable|string|max:255',
            'code_postal' => 'nullable|string|max:20',
            'ville' => 'nullable|string|max:255',
            'pays' => 'nullable|string|max:255',
            'siret' => 'nullable|string|max:14',
            'logo' => 'nullable|string|max:255',
        ]);

        $validated['organization_id'] = $request->user()->organization_id;

        $client = Client::create($validated);

        return response()->json([
            'message' => 'Client créé avec succès',
            'client' => $client,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $client = Client::where('id', $id)
            ->where('organization_id', $request->user()->organization_id)
            ->first();

        if (!$client) {
            return response()->json(['message' => 'Client non trouvé'], 404);
        }

        return response()->json(['client' => $client]);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $client = Client::where('id', $id)
            ->where('organization_id', $request->user()->organization_id)
            ->first();

        if (!$client) {
            return response()->json(['message' => 'Client non trouvé'], 404);
        }

        $validated = $request->validate([
            'nom' => 'sometimes|required|string|max:255',
            'email' => 'nullable|email|max:255',
            'telephone' => 'nullable|string|max:20',
            'adresse' => 'nullable|string|max:255',
            'code_postal' => 'nullable|string|max:20',
            'ville' => 'nullable|string|max:255',
            'pays' => 'nullable|string|max:255',
            'siret' => 'nullable|string|max:14',
            'logo' => 'nullable|string|max:255',
        ]);

        $client->update($validated);

        return response()->json([
            'message' => 'Client mis à jour',
            'client' => $client,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        $client = Client::where('id', $id)
            ->where('organization_id', $request->user()->organization_id)
            ->first();

        if (!$client) {
            return response()->json(['message' => 'Client non trouvé'], 404);
        }

        $client->delete();

        return response()->json(['message' => 'Client supprimé']);
    }
}
