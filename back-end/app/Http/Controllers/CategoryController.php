<?php

namespace App\Http\Controllers;

use App\Http\Requests\CategoryRequest;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $q = request()->query('q');
        $cats = Category::orderBy('id', 'asc');
        if ($q) {
            $cats->where(function ($query) use ($q) {
                $query->where('name', 'like', '%' . $q . '%');
            });
        }
        return response()->json(
            [
                'success' => true,
                'data' => $cats->paginate(),
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
    public function store(CategoryRequest $request)
    {
        $cat = new Category();
        $cat->fill($request->all());
        $cat->save();
        return response()->json(
            [
                'success' => true,
                'data' => $cat,
                'message' => 'Add Category Successfully'
            ]
        );
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $cat = Category::find($id);
        if (!$cat) {
            return response()->json(
                [
                    'success' => false,
                    'message' => 'Category not found'
                ],
                404
            );
        }
        return response()->json(
            [
                'success' => true,
                'data' => $cat,
                'message' => 'Find Category Successfully'
            ]
        );
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CategoryRequest $request, $id)
    {
        $cat = Category::find($id);
        if (!$cat) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found'
            ], 404);
        }

        // Cập nhật chỉ những trường có trong request
        $cat->fill($request->all());
        $cat->save();

        return response()->json([
            'success' => true,
            'data' => $cat,
            'message' => 'Updated Category Successfully'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $cat = Category::find($id);
        if (!$cat) {
            return response()->json(
                [
                    'success' => false,
                    'message' => 'Category not found'
                ],404
            );
        }
        $cat->delete();
        return response()->json([
            'success' => true,
            'message' => 'Category deleted seccessfully'
        ]);
    }
}
