<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $q = request()->query('q');
        $users = User::orderBy('id', 'asc');
        if ($q) {
            $users->where(function ($query) use ($q) {
                $query->where('name', 'like', '%' . $q . '%');
                $query->orwhere('email', 'like', '%' . $q . '%');
            });
        }
        return response()->json(
            [
                'success' => true,
                'data' => $users->paginate(),
                'message' => 'Successfully'
            ]
        );
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserRequest $request)
    {
        if (User::where('email', $request->email)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Email already exists'
            ], 400);
        }

        $user = new User;
        $user->fill($request->all());
        $user->password = bcrypt($request->password);
        $user->save();

        return response()->json([
            'success' => true,
            'data' => $user,
            'message' => 'Add User Successfully'
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(
                [
                    'success' => false,
                    'message' => 'User not found'
                ],
                404
            );
        }
        return response()->json(
            [
                'success' => true,
                'data' => $user,
                'message' => 'Find User Successfully'
            ]
        );
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserRequest $request, string $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        if ($request->email && User::where('email', $request->email)->where('id', '!=', $id)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Email already exists'
            ], 400);
        }

        if ($request->name) {
            $user->name = $request->name;
        }
        if ($request->email) {
            $user->email = $request->email;
        }
        if ($request->phone) {
            $user->phone = $request->phone;
        }
        if ($request->password) {
            $user->password = bcrypt($request->password);
        }
        if ($request->has('role')) {
            $newRole = (int) $request->role;
            if (in_array($newRole, [0, 1])) {
                $user->role = $newRole;
            }
        }
        $user->save();

        return response()->json([
            'success' => true,
            'data' => $user,
            'message' => 'Updated User Successfully'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        $user->delete();
        return response()->json([
            'success' => true,
            'message' => 'User deleted successfully'
        ]);
    }
}
