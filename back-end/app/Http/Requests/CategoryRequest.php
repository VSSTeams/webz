<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CategoryRequest extends FormRequest
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
        $id = $this->route('category'); // Lấy ID từ route

        $categoryRule = $this->isMethod('post')
            ? 'required|unique:categories,name'
            : 'sometimes|unique:categories,name,' . $id;

        return [
            'name' => $categoryRule,
        ];
    }
}
