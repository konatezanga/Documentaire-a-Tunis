<?php
// app/Http/Controllers/JuryMemberController.php

namespace App\Http\Controllers;

use App\Models\JuryMember;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class JuryMemberController extends Controller
{
    /**
     * Display a listing of the jury members.
     */
    public function index(): JsonResponse
    {
        try {
            $juryMembers = JuryMember::orderBy('first_name')->get();

            return response()->json($juryMembers);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors du chargement des membres du jury',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created jury member.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'expertise' => 'required|string|max:255',
                'role' => 'nullable|string|in:president,member',
                'email' => 'nullable|email|unique:jury_members,email',
                'phone' => 'nullable|string|max:20',
                'bio' => 'nullable|string'
            ]);

            $juryMember = JuryMember::create($validated);

            return response()->json([
                'message' => 'Membre du jury créé avec succès',
                'jury_member' => $juryMember
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la création du membre du jury',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified jury member.
     */
    public function show(JuryMember $juryMember): JsonResponse
    {
        return response()->json($juryMember);
    }

    /**
     * Update the specified jury member.
     */
    public function update(Request $request, JuryMember $juryMember): JsonResponse
    {
        try {
            $validated = $request->validate([
                'first_name' => 'sometimes|string|max:255',
                'last_name' => 'sometimes|string|max:255',
                'expertise' => 'sometimes|string|max:255',
                'role' => 'nullable|string|in:president,member',
                'email' => 'nullable|email|unique:jury_members,email,' . $juryMember->id,
                'phone' => 'nullable|string|max:20',
                'bio' => 'nullable|string'
            ]);

            $juryMember->update($validated);

            return response()->json([
                'message' => 'Membre du jury mis à jour avec succès',
                'jury_member' => $juryMember
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la mise à jour du membre du jury',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified jury member.
     */
    public function destroy(JuryMember $juryMember): JsonResponse
    {
        try {
            $juryMember->delete();

            return response()->json([
                'message' => 'Membre du jury supprimé avec succès'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la suppression du membre du jury',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}