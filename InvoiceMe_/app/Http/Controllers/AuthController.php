<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Organization;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            
            'organization_name' => 'required|string|max:255',
            'pays' => 'required|string|max:255',
            'type_structure' => 'nullable|string|max:255',
            'adresse' => 'nullable|string|max:255',
            'code_postal' => 'nullable|string|max:20',
            'ville' => 'nullable|string|max:255',
            'siret' => 'nullable|string|max:14',
            'tva_intracommunautaire' => 'nullable|string|max:20',
        ]);

        $organization = Organization::create([
            'nom' => $validated['organization_name'],
            'pays' => $validated['pays'],
            'type_structure' => $validated['type_structure'] ?? null,
            'adresse' => $validated['adresse'] ?? null,
            'code_postal' => $validated['code_postal'] ?? null,
            'ville' => $validated['ville'] ?? null,
            'siret' => $validated['siret'] ?? null,
            'tva_intracommunautaire' => $validated['tva_intracommunautaire'] ?? null,
        ]);

        $user = User::create([
            'organization_id' => $organization->id,
            'nom' => $validated['nom'],
            'prenom' => $validated['prenom'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'owner',
            'is_active' => true,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Inscription réussie',
            'user' => $user,
            'organization' => $organization,
            'token' => $token,
        ], 201);
    }

        public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Les identifiants sont incorrects.'],
            ]);
        }

        if (!$user->is_active) {
            throw ValidationException::withMessages([
                'email' => ['Ce compte a été désactivé.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        $user->load('organization');

        return response()->json([
            'message' => 'Connexion réussie',
            'user' => $user,
            'token' => $token,
        ]);
    }

     public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Déconnexion réussie',
        ]);
    }
    public function me(Request $request)
    {
        $user = $request->user();
        $user->load('organization');

        return response()->json([
            'user' => $user,
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'nom' => 'sometimes|string|max:255',
            'prenom' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'currentPassword' => 'nullable|string',
            'newPassword' => 'nullable|string|min:8|confirmed',
        ]);

        // Mise à jour des infos de base
        if (isset($validated['nom'])) {
            $user->nom = $validated['nom'];
        }
        if (isset($validated['prenom'])) {
            $user->prenom = $validated['prenom'];
        }
        if (isset($validated['email'])) {
            $user->email = $validated['email'];
        }

        // Changement de mot de passe
        if (!empty($validated['newPassword'])) {
            if (empty($validated['currentPassword'])) {
                throw ValidationException::withMessages([
                    'currentPassword' => ['Le mot de passe actuel est requis.'],
                ]);
            }

            if (!Hash::check($validated['currentPassword'], $user->password)) {
                throw ValidationException::withMessages([
                    'currentPassword' => ['Le mot de passe actuel est incorrect.'],
                ]);
            }

            $user->password = Hash::make($validated['newPassword']);
        }

        $user->save();
        $user->load('organization');

        return response()->json([
            'message' => 'Profil mis à jour avec succès',
            'user' => $user,
        ]);
    }
}
