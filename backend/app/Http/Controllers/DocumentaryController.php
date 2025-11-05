<?php

namespace App\Http\Controllers;

use App\Models\Documentary;
use App\Models\Realisateur;
use App\Models\Producteur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DocumentaryController extends Controller
{
    public function store(Request $request)
    {
        DB::beginTransaction();
        
        try {
            // Validation des données entrantes
            $validator = Validator::make($request->all(), [
                'code' => 'required|string|unique:documentaries,code',
                'title' => 'required|string',
                'date' => 'required|date',
                'subject' => 'required|string',

                'realisateur.code' => 'required|string|unique:realisateurs,code',
                'realisateur.firstName' => 'required|string',
                'realisateur.lastName' => 'required|string',
                'realisateur.birthDate' => 'required|date',

                'producteur.code' => 'required|string|unique:producteurs,code',
                'producteur.firstName' => 'required|string',
                'producteur.lastName' => 'required|string',
                'producteur.birthDate' => 'required|date',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Créer réalisateur 
            $realisateur = Realisateur::create([
                'code' => $request->input('realisateur.code'),
                'first_name' => $request->input('realisateur.firstName'),
                'last_name' => $request->input('realisateur.lastName'),
                'birth_date' => $request->input('realisateur.birthDate'),
            ]);

            // Créer producteur
            $producteur = Producteur::create([
                'code' => $request->input('producteur.code'),
                'first_name' => $request->input('producteur.firstName'),
                'last_name' => $request->input('producteur.lastName'),
                'birth_date' => $request->input('producteur.birthDate'),
            ]);

            // Créer le documentaire
            $documentary = Documentary::create([
                'code' => $request->code,
                'title' => $request->title,
                'date' => $request->date,
                'subject' => $request->subject,
                'realisateur_id' => $realisateur->id,
                'producteur_id' => $producteur->id,
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Documentaire enregistré avec succès',
                'documentary' => [
                    'id' => $documentary->id,
                    'code' => $documentary->code,
                    'title' => $documentary->title,
                    'date' => $documentary->date,
                    'subject' => $documentary->subject,
                    'realisateur' => [  
                        'code' => $realisateur->code,
                        'firstName' => $realisateur->first_name,
                        'lastName' => $realisateur->last_name,
                        'birthDate' => $realisateur->birth_date,
                    ],
                    'producteur' => [  
                        'code' => $producteur->code,
                        'firstName' => $producteur->first_name,
                        'lastName' => $producteur->last_name,
                        'birthDate' => $producteur->birth_date,
                    ]
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            // CORRECTION: Utilisez Log:: au lieu de \Log::
            Log::error('Erreur lors de la création du documentaire: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Erreur serveur lors de la création du documentaire',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function index()
    {
        try {
            $documentaries = Documentary::with(['realisateur', 'producteur'])->get();
            
            $formattedDocumentaries = $documentaries->map(function($doc) {
                return [
                    'id' => $doc->id,
                    'code' => $doc->code,
                    'title' => $doc->title,
                    'date' => $doc->date,
                    'subject' => $doc->subject,
                    'realisateur' => [  
                        'code' => $doc->realisateur->code,
                        'firstName' => $doc->realisateur->first_name,
                        'lastName' => $doc->realisateur->last_name,
                        'birthDate' => $doc->realisateur->birth_date,
                    ],
                    'producteur' => [  
                        'code' => $doc->producteur->code,
                        'firstName' => $doc->producteur->first_name,
                        'lastName' => $doc->producteur->last_name,
                        'birthDate' => $doc->producteur->birth_date,
                    ]
                ];
            });

            return response()->json($formattedDocumentaries);
            
        } catch (\Exception $e) {
            // CORRECTION: Utilisez Log:: au lieu de \Log::
            Log::error('Erreur lors de la récupération des documentaires: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Erreur serveur lors de la récupération des documentaires',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        // À implémenter plus tard
        return response()->json(['message' => 'Méthode non implémentée'], 501);
    }

    public function destroy($id)
    {
        // À implémenter plus tard
        return response()->json(['message' => 'Méthode non implémentée'], 501);
    }
}