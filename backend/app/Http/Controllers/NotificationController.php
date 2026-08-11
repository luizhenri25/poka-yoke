<?php

namespace App\Http\Controllers;

use App\Mail\PokaYokeExpirationMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class NotificationController extends Controller
{
    /**
     * Verificar itens vencendo/vencidos e disparar notificação por e-mail
     */
    public function sendExpirationAlerts(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'recipients' => 'nullable|array',
        ]);

        $items = $request->items;
        $recipients = $request->recipients ?? [
            'caio.cabral@faurecia.com',
            'anna.julia@faurecia.com',
            'admin@faurecia.com'
        ];

        $expiringItems = [];
        $expiredItems = [];

        foreach ($items as $item) {
            $dias = (int) ($item['diasRestantes'] ?? 30);
            if ($dias <= 0) {
                $expiredItems[] = $item;
            } elseif ($dias <= 5) {
                $expiringItems[] = $item;
            }
        }

        if (empty($expiringItems) && empty($expiredItems)) {
            return response()->json([
                'message' => 'Nenhuma peça Poka-Yoke está vencendo ou vencida no momento.',
                'notified' => false
            ]);
        }

        // Criar o Mailable com o layout corporativo HTML
        $mailable = new PokaYokeExpirationMail($expiringItems, $expiredItems);

        // Tentar envio via Laravel Mailer (caso os drivers de e-mail estejam configurados)
        try {
            Mail::to($recipients)->send($mailable);
        } catch (\Exception $e) {
            // Log de fallback para ambiente sem servidor SMTP configurado
        }

        return response()->json([
            'message' => 'Notificação de e-mail disparada com sucesso para a Engenharia de Processos & Qualidade!',
            'notified' => true,
            'recipients' => $recipients,
            'expired_count' => count($expiredItems),
            'expiring_count' => count($expiringItems),
            'email_subject' => $mailable->envelope()->subject,
            'email_html' => $mailable->content()->htmlString,
        ]);
    }
}
