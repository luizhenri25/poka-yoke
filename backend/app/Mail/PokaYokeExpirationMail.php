<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PokaYokeExpirationMail extends Mailable
{
    use Queueable, SerializesModels;

    public array $expiringItems;
    public array $expiredItems;

    public function __construct(array $expiringItems, array $expiredItems)
    {
        $this->expiringItems = $expiringItems;
        $this->expiredItems = $expiredItems;
    }

    public function envelope(): Envelope
    {
        $totalExpired = count($this->expiredItems);
        $totalExpiring = count($this->expiringItems);

        $subject = "ALERTA POKA-YOKE: ";
        if ($totalExpired > 0) {
            $subject .= "🚨 {$totalExpired} Peça(s) Coelho Vencida(s) - Ação Imediata Necessária";
        } else {
            $subject .= "⚠️ {$totalExpiring} Peça(s) Coelho Vencendo nos Próximos 5 Dias";
        }

        return new Envelope(
            subject: $subject,
        );
    }

    public function content(): Content
    {
        return new Content(
            htmlString: $this->buildHtmlContent()
        );
    }

    private function buildHtmlContent(): string
    {
        $html = '<div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; border: 1px solid #CBD5E1; border-radius: 8px; overflow: hidden;">';
        
        // Cabeçalho Corporativo
        $html .= '<div style="background-color: #0A1B9F; color: #FFFFFF; padding: 20px; text-align: center;">';
        $html .= '<h1 style="margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 1px;">FORVIA FAURECIA — ALERTA DE POKA-YOKE</h1>';
        $html .= '<p style="margin: 5px 0 0 0; font-size: 13px; opacity: 0.9;">Notificação de Controle de Integridade das Peças Coelho (30 Dias)</p>';
        $html .= '</div>';

        $html .= '<div style="padding: 20px; background-color: #FFFFFF;">';

        // Alertas Críticos (Vencidos)
        if (count($this->expiredItems) > 0) {
            $html .= '<div style="background-color: #FEF2F2; border-left: 4px solid #EF4444; padding: 15px; margin-bottom: 20px; border-radius: 4px;">';
            $html .= '<h3 style="color: #B91C1C; margin: 0 0 10px 0; font-size: 15px;">🚨 ATENÇÃO: Peças Coelho VENCIDAS (Prazo de 30 Dias Excedido)</h3>';
            $html .= '<table style="width: 100%; border-collapse: collapse; font-size: 13px;">';
            $html .= '<tr style="background-color: #FCA5A5; color: #7F1D1D; text-align: left;">';
            $html .= '<th style="padding: 6px 8px;">Poka-Yoke / Peça</th><th style="padding: 6px 8px;">Posto</th><th style="padding: 6px 8px;">Linha</th><th style="padding: 6px 8px;">Última Inspeção</th><th style="padding: 6px 8px;">Atraso</th>';
            $html .= '</tr>';

            foreach ($this->expiredItems as $item) {
                $html .= '<tr style="border-bottom: 1px solid #FECACA;">';
                $html .= '<td style="padding: 6px 8px; font-weight: bold;">' . htmlspecialchars($item['nome']) . '</td>';
                $html .= '<td style="padding: 6px 8px;">' . htmlspecialchars($item['posto']) . '</td>';
                $html .= '<td style="padding: 6px 8px;">' . htmlspecialchars($item['linha']) . '</td>';
                $html .= '<td style="padding: 6px 8px;">' . htmlspecialchars($item['ultimaInspecao']) . '</td>';
                $html .= '<td style="padding: 6px 8px; color: #DC2626; font-weight: bold;">VENCIDA (' . abs($item['diasRestantes']) . ' dias atrás)</td>';
                $html .= '</tr>';
            }
            $html .= '</table></div>';
        }

        // Avisos Preventivos (Vencendo nos próximos 5 dias)
        if (count($this->expiringItems) > 0) {
            $html .= '<div style="background-color: #FFFBEB; border-left: 4px solid #F59E0B; padding: 15px; margin-bottom: 20px; border-radius: 4px;">';
            $html .= '<h3 style="color: #B45309; margin: 0 0 10px 0; font-size: 15px;">⚠️ AVISO PREVENTIVO: Peças Coelho Vencendo em Breve</h3>';
            $html .= '<table style="width: 100%; border-collapse: collapse; font-size: 13px;">';
            $html .= '<tr style="background-color: #FDE68A; color: #78350F; text-align: left;">';
            $html .= '<th style="padding: 6px 8px;">Poka-Yoke / Peça</th><th style="padding: 6px 8px;">Posto</th><th style="padding: 6px 8px;">Linha</th><th style="padding: 6px 8px;">Última Inspeção</th><th style="padding: 6px 8px;">Dias Restantes</th>';
            $html .= '</tr>';

            foreach ($this->expiringItems as $item) {
                $html .= '<tr style="border-bottom: 1px solid #FEF3C7;">';
                $html .= '<td style="padding: 6px 8px; font-weight: bold;">' . htmlspecialchars($item['nome']) . '</td>';
                $html .= '<td style="padding: 6px 8px;">' . htmlspecialchars($item['posto']) . '</td>';
                $html .= '<td style="padding: 6px 8px;">' . htmlspecialchars($item['linha']) . '</td>';
                $html .= '<td style="padding: 6px 8px;">' . htmlspecialchars($item['ultimaInspecao']) . '</td>';
                $html .= '<td style="padding: 6px 8px; color: #D97706; font-weight: bold;">Vence em ' . $item['diasRestantes'] . ' dia(s)</td>';
                $html .= '</tr>';
            }
            $html .= '</table></div>';
        }

        $html .= '<p style="font-size: 13px; color: #475569; line-height: 1.5;">Por favor, acesse o módulo <strong>Peças Coelho</strong> no POKA-YOKE System para inspecionar os itens no posto de trabalho e renovar a integridade por mais 30 dias.</p>';

        $html .= '<div style="text-align: center; margin-top: 25px;">';
        $html .= '<a href="http://localhost:5173/jit" style="background-color: #0A1B9F; color: #FFFFFF; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px; display: inline-block;">Accesar Sistema POKA-YOKE</a>';
        $html .= '</div></div>';

        // Rodapé
        $html .= '<div style="background-color: #F1F5F9; color: #64748B; padding: 12px; text-align: center; font-size: 11px; border-top: 1px solid #E2E8F0;">';
        $html .= 'E-mail gerado automaticamente pelo Sistema POKA-YOKE — Forvia Faurecia (Planta Porto Real)';
        $html .= '</div></div>';

        return $html;
    }
}
