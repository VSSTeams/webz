<?php

namespace App\Http\Controllers;

use App\Http\Requests\CartDetailRequest;
use App\Models\CartDetail;
use Illuminate\Http\Request;

class CartDetailController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $cart_id = $request->query('cart_id');
        $product_id = $request->query('product_id');

        if ($cart_id && $product_id) {
            $cartDetail = CartDetail::where(['cart_id' => $cart_id, 'product_id' => $product_id])->first();
            if ($cartDetail) {
                return response()->json([
                    'success' => true,
                    'data' => [$cartDetail],
                    'message' => 'Successfully'
                ]);
            } else {
                return response()->json([
                    'success' => true,
                    'data' => [],
                    'message' => 'Successfully'
                ]);
            }
        }

        $carts = CartDetail::orderBy('id', 'asc')->paginate();
        return response()->json(
            [
                'success' => true,
                'data' => $carts,
                'message' => 'Successfully'
            ]
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CartDetailRequest $request)
    {
        try {
            $cartDetail = CartDetail::create($request->validated());
            return response()->json([
                'success' => true,
                'data' => $cartDetail,
                'message' => 'Thêm sản phẩm vào giỏ hàng thành công'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi máy chủ'
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $cartDetail = CartDetail::find($id);
        if (!$cartDetail) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy sản phẩm trong giỏ hàng'
            ], 404);
        }
        return response()->json([
            'success' => true,
            'data' => $cartDetail
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CartDetailRequest $request, string $id)
    {
        $cartDetail = CartDetail::find($id);
        if (!$cartDetail) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy sản phẩm trong giỏ hàng'
            ], 404);
        }

        $cartDetail->update($request->validated());

        return response()->json([
            'success' => true,
            'data' => $cartDetail,
            'message' => 'Cập nhật thành công'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $cartDetail = CartDetail::find($id);
        if (!$cartDetail) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy sản phẩm trong giỏ hàng'
            ], 404);
        }

        $cartDetail->delete();

        return response()->json([
            'success' => true,
            'message' => 'Xóa sản phẩm khỏi giỏ hàng thành công'
        ]);
    }
}
