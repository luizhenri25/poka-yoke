<?php

namespace App\Models;

use App\Enums\UserRole;
use App\Enums\UserPermission;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['name', 'email', 'matricula', 'role', 'password'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'role' => UserRole::class,
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Verificar se o usuário possui determinado papel (UserRole Enum)
     */
    public function hasRole(UserRole|string $role): bool
    {
        if (is_string($role)) {
            return $this->role->value === $role;
        }
        return $this->role === $role;
    }

    /**
     * Verificar se o usuário possui determinada permissão (UserPermission Enum)
     */
    public function hasPermission(UserPermission|string $permission): bool
    {
        $permValue = is_string($permission) ? $permission : $permission->value;
        return in_array($permValue, $this->role->permissions());
    }

    /**
     * Obter lista de permissões ativas do usuário
     */
    public function getPermissionsAttribute(): array
    {
        return $this->role ? $this->role->permissions() : [];
    }
}
