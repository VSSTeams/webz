<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductRequest;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $q = request()->query('q');
        $idCategory = request()->query('id_category'); // Lấy id_subitem từ query params

        $bviets = Product::orderBy('created_at', 'desc');

        // Lọc theo id_subitem nếu có
        if ($idCategory) {
            $bviets->where('id_category', $idCategory);
        }

        // Lọc theo từ khóa tìm kiếm (q) nếu có
        if ($q) {
            $bviets->where(function ($query) use ($q) {
                $query->where('name', 'like', '%' . $q . '%');
            });
        }

        return response()->json(
            [
                'success' => true,
                'data' => $bviets->paginate(12),
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
    public function store(ProductRequest $request)
    {
        $bviet = new Product();
        $bviet->fill($request->all());
        $bviet->save();
        return response()->json(
            [
                'success' => true,
                'data' => $bviet,
                'message' => 'Add Sản phẩm Successfully'
            ]
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $bviet = Product::find($id);
        if (!$bviet) {
            return response()->json(
                [
                    'success' => false,
                    'message' => 'Sản phẩm not found'
                ],
                404
            );
        }
        return response()->json(
            [
                'success' => true,
                'data' => $bviet,
                'message' => 'Find Sản phẩm Successfully'
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
    public function update(ProductRequest $request, string $id)
    {
        $bviet = Product::find($id);
        if (!$bviet) {
            return response()->json([
                'success' => false,
                'message' => 'Sản phẩm not found'
            ], 404);
        }

        // Cập nhật chỉ những trường có trong request
        $bviet->fill($request->all());
        $bviet->save();

        return response()->json([
            'success' => true,
            'data' => $bviet,
            'message' => 'Updated Sản phẩm Successfully'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $bviet = Product::find($id);
        if (!$bviet) {
            return response()->json(
                [
                    'success' => false,
                    'message' => 'Sản phẩm not found'
                ]
            );
        }
        $bviet->delete();
        return response()->json([
            'success' => true,
            'message' => 'San phẩm deleted seccessfully'
        ]);
    }

    public function getFeaturedProducts()
    {
        $products = Product::orderBy('created_at', 'desc')->get();
        return response()->json([
            'success' => true,
            'data' => $products,
            'message' => 'Successfully'
        ]);
    }
}
