<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Http\FormRequest;

class CheckoutRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'email', 'max:255'],
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:20'],
            'address' => ['required', 'string', 'max:255'],
            'payment_method' => ['required', 'string', Rule::in(['COD', 'MoMo'])], // Thêm rule cho payment_method
            'cart_items' => ['required', 'array'],
            'cart_items.*.product_id' => ['required', 'integer', 'exists:products,id'],
            'cart_items.*.quantity' => ['required', 'integer', 'min:1'],
            'cart_items.*.price' => ['required', 'integer', 'min:0'], // Consider validating against the actual product price
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'payment_method.required' => 'Please select a payment method.',
            'payment_method.in' => 'The selected payment method is invalid.',
            'cart_items.required' => 'Please provide the items in your cart.',
            'cart_items.array' => 'The cart items must be an array.',
            'cart_items.*.product_id.required' => 'Each cart item must have a product ID.',
            'cart_items.*.product_id.integer' => 'The product ID must be an integer.',
            'cart_items.*.product_id.exists' => 'The selected product ID is invalid.',
            'cart_items.*.quantity.required' => 'Each cart item must have a quantity.',
            'cart_items.*.quantity.integer' => 'The quantity must be an integer.',
            'cart_items.*.quantity.min' => 'The quantity must be at least 1.',
            'cart_items.*.price.required' => 'Each cart item must have a price.',
            'cart_items.*.price.integer' => 'The price must be an integer.',
            'cart_items.*.price.min' => 'The price cannot be negative.',
        ];
    }
}
