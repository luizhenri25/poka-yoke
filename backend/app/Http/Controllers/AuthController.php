<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Enums\UserRole;
use App\Enums\UserPermission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Autenticação de Usuário (E-mail ou Matrícula)
     */
    public function login(Request $request)
    {
        $request->validate([
            'identifier' => 'required|string',
            'password' => 'required|string',
        ]);

        $identifier = trim($request->identifier);

        $user = User::where('email', $identifier)
            ->orWhere('matricula', $identifier)
            ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'identifier' => ['Matrícula ou E-mail incorretos.'],
            ]);
        }

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
