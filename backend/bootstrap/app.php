<?php

use App\Http\Middleware\CorsMiddleware;
use App\Http\Middleware\RoleMiddleware;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Middleware;


return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php', 
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
  // problème avec Middleware dans la function withMiddleware (c'est souligné en rouge)
    ->withMiddleware(function (Middleware $middleware): void {
        // Middleware global (si besoin)
        $middleware->prepend(CorsMiddleware::class);

        // Enregistrement du middleware personnalisé "role"
        $middleware->alias([
            'role' => RoleMiddleware::class,
        ]);
    })
    ->withExceptions(function ($exceptions): void {
        //
    })
    ->create();
