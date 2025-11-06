<?php

namespace App\Http\Controllers;

use App\Models\Screening;
use App\Models\Documentary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ScreeningController extends Controller
{
    public function index()
    {
        try {
            $screenings = Screening::with('documentary.realisateur', 'documentary.producteur')->get();
            
            $formattedScreenings = $screenings->map(function($screening) {
                return [
                    'id' =>(string) $screening->id,
                    'documentaryId' =>(string) $screening->documentary_id,
                    'date' => $screening->date->format('Y-m-d'),
                    'time' => $screening->time,
                    'room' => $screening->room,
                    'isPublished' => $screening->is_published,
                    'createdAt' => $screening->created_at,
                    'updatedAt' => $screening->updated_at,
                ];
            });

            return response()->json($formattedScreenings);
            
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des projections: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Erreur serveur lors de la récupération des projections',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        DB::beginTransaction();
        
        try {
            $validator = Validator::make($request->all(), [
                'documentaryId' => 'required|exists:documentaries,id',
                'date' => 'required|date|after_or_equal:today',
                'time' => 'required|date_format:H:i',
                'room' => 'required|string|max:255',
                'isPublished' => 'boolean'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Vérifier les conflits de salle
            $existingScreening = Screening::where('date', $request->date)
                ->where('time', $request->time)
                ->where('room', $request->room)
                ->first();

            if ($existingScreening) {
                return response()->json([
                    'message' => 'Conflit d\'horaire',
                    'error' => 'Cette salle est déjà réservée à cet horaire'
                ], 409);
            }

            $screening = Screening::create([
                'documentary_id' => $request->documentaryId,
                'date' => $request->date,
                'time' => $request->time,
                'room' => $request->room,
                'is_published' => $request->isPublished ?? false
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Projection créée avec succès',
                'screening' => [
                    'id' => $screening->id,
                    'documentaryId' => $screening->documentary_id,
                    'date' => $screening->date->format('Y-m-d'),
                    'time' => $screening->time,
                    'room' => $screening->room,
                    'isPublished' => $screening->is_published,
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Erreur lors de la création de la projection: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Erreur serveur lors de la création de la projection',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $screening = Screening::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'isPublished' => 'boolean'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Pour l'instant, on ne permet que de modifier le statut de publication
            if ($request->has('isPublished')) {
                $screening->update([
                    'is_published' => $request->isPublished
                ]);
            }

            return response()->json([
                'message' => 'Projection mise à jour avec succès',
                'screening' => [
                    'id' => $screening->id,
                    'isPublished' => $screening->is_published
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Erreur lors de la mise à jour de la projection: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Erreur serveur lors de la mise à jour de la projection',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $screening = Screening::findOrFail($id);
            $screening->delete();

            return response()->json([
                'message' => 'Projection supprimée avec succès'
            ]);

        } catch (\Exception $e) {
            Log::error('Erreur lors de la suppression de la projection: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Erreur serveur lors de la suppression de la projection',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Méthode pour récupérer les projections publiées (pour le planning public)
    public function published()
    {
        try {
            $screenings = Screening::with('documentary.realisateur', 'documentary.producteur')
                ->where('is_published', true)
                ->get();
            
            $formattedScreenings = $screenings->map(function($screening) {
                return [
                    'id' => $screening->id,
                    'documentaryId' => $screening->documentary_id,
                    'date' => $screening->date->format('Y-m-d'),
                    'time' => $screening->time,
                    'room' => $screening->room,
                    'isPublished' => $screening->is_published,
                    'documentary' => [
                        'id' => $screening->documentary->id,
                        'code' => $screening->documentary->code,
                        'title' => $screening->documentary->title,
                        'subject' => $screening->documentary->subject,
                        'realisateur' => [
                            'firstName' => $screening->documentary->realisateur->first_name,
                            'lastName' => $screening->documentary->realisateur->last_name,
                        ],
                        'producteur' => [
                            'firstName' => $screening->documentary->producteur->first_name,
                            'lastName' => $screening->documentary->producteur->last_name,
                        ]
                    ]
                ];
            });

            return response()->json($formattedScreenings);
            
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des projections publiées: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Erreur serveur lors de la récupération des projections publiées',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}