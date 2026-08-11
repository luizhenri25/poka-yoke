<?php

namespace App\Enums;

enum UserPermission: string
{
    case VIEW_INSTRUCTIONS = 'view_instructions';
    case SIGN_TRAINING = 'sign_training';
    case MANAGE_POKA_YOKES = 'manage_poka_yokes';
    case MANAGE_USERS = 'manage_users';
    case VIEW_ANALYTICS = 'view_analytics';
    case GENERATE_DOCUMENTS = 'generate_documents';

    public function description(): string
    {
        return match($this) {
            self::VIEW_INSTRUCTIONS => 'Visualizar e ouvir instruções de trabalho por posto',
            self::SIGN_TRAINING => 'Assinar digitalmente com o dedo os treinamentos',
            self::MANAGE_POKA_YOKES => 'Criar/editar Poka-Yokes e lançar novas revisões técnicas',
            self::MANAGE_USERS => 'Gestão total de contas e acessos de usuários',
            self::VIEW_ANALYTICS => 'Visualizar gráficos estatísticos e Pareto 80/20',
            self::GENERATE_DOCUMENTS => 'Emitir e exportar fichas oficiais em PDF A4',
        };
    }
}
