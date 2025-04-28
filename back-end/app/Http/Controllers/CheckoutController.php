<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use GuzzleHttp\Client;
use App\Models\Product;
use App\Models\CartDetail;
use App\Models\OrderDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\CheckoutRequest;
use Exception;

class CheckoutController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $orders = Order::with('orderDetails.product')
                ->where('user_id', Auth::id())
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $orders,
                'message' => 'Orders retrieved successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve orders',
                'error' => $e->getMessage()
            ], 500);
        }
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
    public function store(CheckoutRequest $request)
    {
        if ($request->payment_method === 'COD') {
            return $this->handleCodPayment($request);
        } elseif ($request->payment_method === 'MoMo') {
            return $this->createMomoPayment($request);
        }

        return response()->json(['message' => 'Invalid payment method'], 400);
    }

    protected function handleCodPayment(CheckoutRequest $request)
    {
        try {
            DB::beginTransaction();

            $order = new Order();
            $order->user_id = Auth::id();
            $order->email = $request->email;
            $order->name = $request->name;
            $order->phone = $request->phone;
            $order->address = $request->address;
            $order->payment_method = 'COD';
            $order->status = 0; // Chờ xử lý cho COD
            $order->save();

            $cartItems = $request->input('cart_items');
            foreach ($cartItems as $item) {
                $product = Product::findOrFail($item['product_id']);
                OrderDetail::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $product->price * $item['quantity'],
                ]);
            }

            CartDetail::whereIn('cart_id', Cart::where('user_id', Auth::id())->pluck('id'))->delete();
            Cart::where('user_id', Auth::id())->delete();

            DB::commit();

            return response()->json(['message' => 'Order placed successfully (COD)', 'order_id' => $order->id], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to place order (COD)', 'error' => $e->getMessage()], 500);
        }
    }

    public function createMomoPayment(CheckoutRequest $request)
    {
        $partnerCode = env('MOMO_PARTNER_CODE', 'MOMOBKUN20180529');
        $accessKey = env('MOMO_ACCESS_KEY', 'klm05TvNBzhg7h7j');
        $secretKey = env('MOMO_SECRET_KEY', 'at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa');
        $endpoint = env('MOMO_ENDPOINT', 'https://test-payment.momo.vn/v2/gateway/api/create');
        $redirectUrl = env('MOMO_REDIRECT_URL', 'http://localhost:8000/api/momo/callback');
        $ipnUrl = env('MOMO_IPN_URL', 'http://localhost:8000/api/momo/ipn');

        $user = Auth::user();
        $orderId = time() . "_" . $user->id;
        $orderInfo = "Thanh toán đơn hàng #" . $orderId;
        $amount = collect($request->input('cart_items'))->sum(function ($item) {
            return Product::find($item['product_id'])->price * $item['quantity'];
        });
        $requestId = time() . "";
        $requestType = "captureWallet";
        $extraData = base64_encode(json_encode(['user_id' => $user->id, 'momo_order_id' => $orderId]));

        $rawHash = "accessKey=" . $accessKey . "&amount=" . $amount . "&extraData=" . $extraData . "&ipnUrl=" . $ipnUrl .
            "&orderId=" . $orderId . "&orderInfo=" . $orderInfo . "&partnerCode=" . $partnerCode . "&redirectUrl=" . $redirectUrl .
            "&requestId=" . $requestId . "&requestType=" . $requestType;
        $signature = hash_hmac("sha256", $rawHash, $secretKey);

        $data = [
            'partnerCode' => $partnerCode,
            'partnerName' => config('app.name'),
            'storeId' => "YourStoreID",
            'requestId' => $requestId,
            'amount' => $amount,
            'orderId' => $orderId,
            'orderInfo' => $orderInfo,
            'redirectUrl' => $redirectUrl,
            'ipnUrl' => $ipnUrl,
            'lang' => 'vi',
            'extraData' => $extraData,
            'requestType' => $requestType,
            'signature' => $signature,
        ];

        $client = new Client();
        try {
            $order = new Order();
            $order->user_id = $user->id;
            $order->email = $request->email;
            $order->name = $request->name;
            $order->phone = $request->phone;
            $order->address = $request->address;
            $order->payment_method = 'MoMo';
            $order->status = 0; // Đặt status = 1 ngay khi tạo đơn hàng MoMo
            $order->save();

            $cartItems = $request->input('cart_items');
            foreach ($cartItems as $item) {
                $product = Product::findOrFail($item['product_id']);
                OrderDetail::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $product->price * $item['quantity'],
                ]);
            }

            $response = $client->post($endpoint, [
                'headers' => ['Content-Type' => 'application/json'],
                'json' => $data,
                'verify' => false,
            ]);
            $body = json_decode($response->getBody(), true);
            if (isset($body['payUrl'])) {
                return response()->json(['payUrl' => $body['payUrl'], 'order_id' => $order->id]);
            }
            return response()->json(['message' => 'Không thể tạo link thanh toán MoMo', 'error' => $body], 500);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Lỗi kết nối MoMo', 'error' => $e->getMessage()], 500);
        }
    }

    public function momoCallback(Request $request)
    {
        Log::info('MoMo Callback Request: ' . json_encode($request->all()));

        if ($request->resultCode == 0) {
            $extraData = json_decode(base64_decode($request->extraData), true);
            $userId = $extraData['user_id'] ?? null;
            $momoOrderId = $extraData['momo_order_id'] ?? null;

            if (!$userId || !$momoOrderId) {
                Log::error('MoMo Callback Error: Thiếu user_id hoặc momo_order_id trong extraData');
                return response()->json(['message' => 'Thiếu user_id hoặc momo_order_id trong extraData'], 400);
            }

            try {
                DB::beginTransaction();

                $order = Order::where('user_id', $userId)
                    ->where('payment_method', 'MoMo')
                    ->where('status', 0)
                    ->where('created_at', '>=', now()->subMinutes(10))
                    ->orderBy('created_at', 'desc')
                    ->first();
                $order->status = 1; // Đặt status = 1 ngay khi tạo đơn hàng MoMo
                $order->save();
                if (!$order) {
                    throw new Exception("Không tìm thấy đơn hàng phù hợp.");
                }

                $cartIds = Cart::where('user_id', $userId)->pluck('id');
                if ($cartIds->isNotEmpty()) {
                    CartDetail::whereIn('cart_id', $cartIds)->delete();
                    Cart::where('user_id', $userId)->delete();
                }

                DB::commit();

                return redirect()->away('http://localhost:3000/checkout?success=true');
            } catch (\Exception $e) {
                DB::rollBack();
                Log::error('MoMo Callback Error: ' . $e->getMessage());
                return response()->json(['message' => 'Lỗi: ' . $e->getMessage()], 500);
            }
        } else {
            return redirect()->away('http://localhost:3000/checkout/failure');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $order = Order::where('id', $id)
                ->where('user_id', Auth::id())
                ->firstOrFail();
            return response()->json(['status' => $order->status]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Không tìm thấy đơn hàng'], 404);
        }
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
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
