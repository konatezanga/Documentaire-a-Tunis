<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'Identifiants incorrects'], 401);
        }

        // si mot de passe null, première connexion => on le définit
        if (is_null($user->password)) {
            $user->password = Hash::make($request->password);
            $user->save();
        }

        // vérifie le mot de passe
        if (!\Illuminate\Support\Facades\Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Identifiants incorrects'], 401);
        }

        $token = $user->createToken('docatunis_token')->plainTextToken;

        return response()->json([
            'user' => [
                'id' => $user->id,
                'firstName' => $user->first_name,
                'lastName' => $user->last_name,
                'email' => $user->email,
                'role' => $user->role,
            ],
            'token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    public function logout(Request $request)
    {
        // supprime le token courant (si authentifié via sanctum)
        if ($request->user() && $request->user()->currentAccessToken()) {
            $request->user()->currentAccessToken()->delete();
        }

        return response()->json(['message' => 'Déconnexion réussie']);
    }

    public function me(Request $request)
    {
        return response()->json([
            'id' => $request->user()->id,
            'firstName' => $request->user()->first_name,
            'lastName' => $request->user()->last_name,
            'email' => $request->user()->email,
            'role' => $request->user()->role,
        ]);
    }
}
