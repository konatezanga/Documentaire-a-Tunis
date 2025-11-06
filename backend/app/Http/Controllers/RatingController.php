<?php

namespace App\Http\Controllers;

use App\Models\Rating;
use App\Models\Screening;
use App\Models\JuryMember;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RatingController extends Controller
{
    /**
     * Display a listing of the ratings.
     */
    public function index(): JsonResponse
    {
        try {
            $ratings = Rating::with(['screening', 'juryMember'])
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json($ratings);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors du chargement des notes',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created rating.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            DB::beginTransaction();

            $validated = $request->validate([
                'screening_id' => 'required|exists:screenings,id',
                'jury_member_id' => 'required|exists:jury_members,id',
                'score' => 'required|numeric|min:0|max:100',
                'comment' => 'nullable|string'
            ]);

            // Vérifier si cette projection existe
            $screening = Screening::findOrFail($validated['screening_id']);

            // Vérifier si le membre du jury existe
            $juryMember = JuryMember::findOrFail($validated['jury_member_id']);

            // Vérifier si ce membre a déjà noté cette projection
            $existingRating = Rating::where('screening_id', $validated['screening_id'])
                ->where('jury_member_id', $validated['jury_member_id'])
                ->first();

            if ($existingRating) {
                return response()->json([
                    'message' => 'Ce membre du jury a déjà noté cette projection'
                ], 422);
            }

            // Créer la note
            $rating = Rating::create($validated);

            DB::commit();

            return response()->json([
                'message' => 'Note enregistrée avec succès',
                'rating' => $rating->load(['screening', 'juryMember'])
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erreur lors de l\'enregistrement de la note',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store multiple ratings at once (for jury president)
     */
    public function storeMultiple(Request $request): JsonResponse
    {
        try {
            DB::beginTransaction();

            $validated = $request->validate([
                'screening_id' => 'required|exists:screenings,id',
                'ratings' => 'required|array',
                'ratings.*.jury_member_id' => 'required|exists:jury_members,id',
                'ratings.*.score' => 'required|numeric|min:0|max:100'
            ]);

            $screeningId = $validated['screening_id'];
            $createdRatings = [];

            foreach ($validated['ratings'] as $ratingData) {
                // Vérifier si ce membre a déjà noté cette projection
                $existingRating = Rating::where('screening_id', $screeningId)
                    ->where('jury_member_id', $ratingData['jury_member_id'])
                    ->first();

                if (!$existingRating) {
                    $rating = Rating::create([
                        'screening_id' => $screeningId,
                        'jury_member_id' => $ratingData['jury_member_id'],
                        'score' => $ratingData['score'],
                        'comment' => $ratingData['comment'] ?? null
                    ]);

                    $createdRatings[] = $rating->load('juryMember');
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Notes enregistrées avec succès',
                'ratings' => $createdRatings
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erreur lors de l\'enregistrement des notes',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display ratings for a specific screening.
     */
    public function forScreening($screeningId): JsonResponse
    {
        try {
            $ratings = Rating::with('juryMember')
                ->where('screening_id', $screeningId)
                ->get();

            return response()->json($ratings);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors du chargement des notes',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified rating.
     */
    public function destroy(Rating $rating): JsonResponse
    {
        try {
            $rating->delete();

            return response()->json([
                'message' => 'Note supprimée avec succès'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la suppression de la note',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}