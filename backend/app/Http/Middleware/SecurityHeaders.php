<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    /**
     * Handle an incoming request and inject OWASP Pentest Security Headers.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Anti-Clickjacking: Impede clonagem do site dentro de iframes maliciosos
        $response->headers->set('X-Frame-Options', 'DENY');

        // Anti-MIME Sniffing: Impede falsificação de arquivos de script
        $response->headers->set('X-Content-Type-Options', 'nosniff');

        // Filtro XSS dos Navegadores
        $response->headers->set('X-XSS-Protection', '1; mode=block');

        // Política de Referência Segura
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

        // Content Security Policy (CSP)
        $response->headers->set(
            'Content-Security-Policy',
            "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: https:;"
        );

        // Strict-Transport-Security (HSTS): Força tráfego criptografado HTTPS por 1 ano
        $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

        return $response;
    }
}
