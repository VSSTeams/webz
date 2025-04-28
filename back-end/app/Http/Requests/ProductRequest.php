<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $id = $this->route('product'); // Lấy ID từ route

        $titleRule = $this->isMethod('post')
            ? 'required|unique:products,name'
            : 'sometimes|unique:products,name,' . $id;

        return [
            'name' => $titleRule,
            'price' => $this->isMethod('post') ? 'required' : 'sometimes',
            'description' => $this->isMethod('post') ? 'required' : 'sometimes',
            'image' => $this->isMethod('post') ? 'required' : 'sometimes',
            'id_category' => $this->isMethod('post') ? 'required' : 'sometimes',
        ];
    }
}
