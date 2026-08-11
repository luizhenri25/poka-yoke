<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Enums\UserRole;
use App\Enums\UserPermission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Autenticação de Usuário com Proteção Anti-Força Bruta (RateLimiter - Max 5 Tentativas/Minuto)
     */
    public function login(Request $request)
    {
        $request->validate([
            'identifier' => 'required|string',
            'password' => 'required|string',
        ]);

        $identifier = strtolower(trim($request->identifier));
        $throttleKey = 'login-attempts:' . $request->ip() . '|' . $identifier;

        // Verificar limite de tentativas (Máximo 5 tentativas por minuto)
        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            return response()->json([
                'error' => 'RateLimitExceeded',
                'message' => "🚨 Bloqueio de Segurança Pentest: Muitas tentativas de login incorretas. Por favor, aguarde {$seconds} segundos antes de tentar novamente.",
                'retry_after_seconds' => $seconds
            ], 429);
        }

        $user = User::where('email', $identifier)
            ->orWhere('matricula', $identifier)
            ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            // Contabilizar tentativa com falha
            RateLimiter::hit($throttleKey, 60);

            throw ValidationException::withMessages([
                'identifier' => ['Matrícula ou E-mail incorretos.'],
            ]);
        }

        // Sucesso: Limpar histórico de bloqueio de força bruta
        RateLimiter::clear($throttleKey);

        return response()->json([
            'message' => 'Autenticado com sucesso!',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'matricula' => $user->matricula,
                'role' => $user->role->value,
                'role_label' => $user->role->label(),
                'permissions' => $user->permissions,
            ]
        ]);
    }

    /**
     * Obter dados do Usuário Logado
     */
    public function me(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Não autenticado'], 401);
        }

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'matricula' => $user->matricula,
                'role' => $user->role->value,
                'role_label' => $user->role->label(),
                'permissions' => $user->permissions,
            ]
        ]);
    }

    /**
     * Listar todos os Usuários (Exclusivo Admin)
     */
    public function index()
    {
        $users = User::all()->map(function ($u) {
            return [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'matricula' => $u->matricula,
                'role' => $u->role->value,
                'role_label' => $u->role->label(),
                'permissions' => $u->permissions,
            ];
        });

        return response()->json($users);
    }

    /**
     * Cadastrar Novo Usuário (Exclusivo Admin)
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users,email',
            'matricula' => 'nullable|string|unique:users,matricula',
            'password' => 'required|string|min:6',
            'role' => 'required|string|in:admin,engenheiro,operador',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'matricula' => $request->matricula,
            'password' => bcrypt($request->password),
            'role' => UserRole::from($request->role),
        ]);

        return response()->json([
            'message' => 'Usuário cadastrado com sucesso no Laravel Backend!',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'matricula' => $user->matricula,
                'role' => $user->role->value,
                'permissions' => $user->permissions,
            ]
        ], 201);
    }

    /**
     * Excluir Usuário (Exclusivo Admin)
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'Usuário removido com sucesso.']);
    }
}
