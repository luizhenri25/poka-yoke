<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Administrador (Acesso total + Gestão de Usuários)
        User::updateOrCreate(
            ['email' => 'admin@faurecia.com'],
            [
                'name' => 'Administrador Geral (Forvia)',
                'matricula' => 'ADM-001',
                'role' => 'admin',
                'password' => bcrypt('admin123'),
            ]
        );

        // 2. Engenheiro de Processos (Acesso total de edição e criação)
        User::updateOrCreate(
            ['email' => 'caio.cabral@faurecia.com'],
            [
                'name' => 'Caio Cabral (Eng. Processos)',
                'matricula' => 'ENG-102',
                'role' => 'engenheiro',
                'password' => bcrypt('eng123'),
            ]
        );

        // 3. Operador de Linha (Acesso restrito - Somente leitura de instruções)
        User::updateOrCreate(
            ['email' => 'luiz.henrique@faurecia.com'],
            [
                'name' => 'Luiz Henrique (Operador BDIA)',
                'matricula' => 'OP-504',
                'role' => 'operador',
                'password' => bcrypt('op123'),
            ]
        );
    }
}
