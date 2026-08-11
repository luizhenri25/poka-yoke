<?php

namespace App\Enums;

enum UserRole: string
{
    case ADMIN = 'admin';
    case ENGENHEIRO = 'engenheiro';
    case OPERADOR = 'operador';

    public function label(): string
    {
        return match($this) {
            self::ADMIN => 'Administrador Geral',
            self::ENGENHEIRO => 'Engenheiro de Processos',
            self::OPERADOR => 'Operador de Linha',
        };
    }

    public function permissions(): array
    {
        return match($this) {
            self::ADMIN => [
                UserPermission::VIEW_INSTRUCTIONS->value,
                UserPermission::SIGN_TRAINING->value,
                UserPermission::MANAGE_POKA_YOKES->value,
                UserPermission::MANAGE_USERS->value,
                UserPermission::VIEW_ANALYTICS->value,
                UserPermission::GENERATE_DOCUMENTS->value,
            ],
            self::ENGENHEIRO => [
                UserPermission::VIEW_INSTRUCTIONS->value,
                UserPermission::SIGN_TRAINING->value,
                UserPermission::MANAGE_POKA_YOKES->value,
                UserPermission::VIEW_ANALYTICS->value,
                UserPermission::GENERATE_DOCUMENTS->value,
            ],
            self::OPERADOR => [
                UserPermission::VIEW_INSTRUCTIONS->value,
                UserPermission::SIGN_TRAINING->value,
            ],
        };
    }
}
