<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartDetail;
use Illuminate\Http\Request;
use App\Http\Requests\CartRequest;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $userId = $request->query('user_id');
        if ($userId) {
            $carts = Cart::where('user_id', $userId)->get();
        } else {
            $carts = Cart::orderBy('id', 'asc')->paginate();
        }

        return response()->json(
            [
                'success' => true,
                'data' => $carts,
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
    public function store(CartRequest $request)
    {
        $cart = Cart::where('user_id', $request->user_id)->first();
        if ($cart) {
            return response()->json([
                'success' => true,
                'data' => $cart,
                'message' => 'Cart already exists'
            ]);
        }
        $cart = new Cart();
        $cart->fill($request->all());
        $cart->save();
        return response()->json(
            [
                'success' => true,
                'data' => $cart,
                'message' => 'Add Category Successfully'
            ]
        );
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $cart = Cart::find($id);
        if (!$cart) {
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
                'data' => $cart,
                'message' => 'Find Category Successfully'
            ]
        );
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Cart $cart)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CartRequest $request, $id)
    {
        $cart = Cart::find($id);
        if (!$cart) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found'
            ], 404);
        }

        // Cập nhật chỉ những trường có trong request
        $cart->fill($request->all());
        $cart->save();

        return response()->json([
            'success' => true,
            'data' => $cart,
            'message' => 'Updated Category Successfully'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $cart = Cart::find($id);
        if (!$cart) {
            return response()->json(
                [
                    'success' => false,
                    'message' => 'Category not found'
                ],
                404
            );
        }
        $cart->delete();
        return response()->json([
            'success' => true,
            'message' => 'Category deleted seccessfully'
        ]);
    }

    public function destroyByUser(Request $request)
    {
        $userId = Auth::id(); // Lấy ID người dùng đã xác thực từ token

        if (!$userId) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Tìm giỏ hàng của người dùng
        $cart = Cart::where('user_id', $userId)->first();

        if ($cart) {
            // Xóa tất cả các mục chi tiết giỏ hàng liên quan đến giỏ hàng này
            CartDetail::where('cart_id', $cart->id)->delete();

            return response()->json(['success' => true, 'message' => 'Giỏ hàng đã được làm sạch.']);
        } else {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy giỏ hàng cho người dùng này.'], 404);
        }
    }
}
