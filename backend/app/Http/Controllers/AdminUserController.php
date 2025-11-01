<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminUserController extends Controller
{
    //  Liste tous les utilisateurs
    public function index()
    {
        $users = User::select('id', 'first_name', 'last_name', 'email', 'role', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'firstName' => $user->first_name,
                    'lastName' => $user->last_name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'createdAt' => $user->created_at,
                ];
            });

        return response()->json(User::all());
    }

    //  Création d’un utilisateur (mot de passe null)
    public function store(Request $request)
    {
        $request->validate([
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'role' => ['required', Rule::in([
                'admin',
                'inspection_manager',
                'production_manager',
                'jury_president',
                'jury_member'
            ])],
        ]);

        $user = User::create([
            'first_name' => $request->firstName,
            'last_name' => $request->lastName,
            'email' => $request->email,
            'role' => $request->role,
            'password' => null,
        ]);

        return response()->json([
            'id' => $user->id,
            'firstName' => $user->first_name,
            'lastName' => $user->last_name,
            'email' => $user->email,
            'role' => $user->role,
            'createdAt' => $user->created_at,
        ], 201);
    }

    //  Suppression d’un utilisateur
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'Utilisateur supprimé']);
    }

    //  (Optionnel) Mise à jour
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'role' => ['required', Rule::in([
                'admin',
                'inspection_manager',
                'production_manager',
                'jury_president',
                'jury_member'
            ])],
        ]);

        $user->update([
            'first_name' => $request->firstName,
            'last_name' => $request->lastName,
            'email' => $request->email,
            'role' => $request->role,
        ]);

        return response()->json([
            'id' => $user->id,
            'firstName' => $user->first_name,
            'lastName' => $user->last_name,
            'email' => $user->email,
            'role' => $user->role,
            'createdAt' => $user->created_at,
        ]);
    }
}
