<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SubitemRequest extends FormRequest
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
        $id = $this->route('subitem'); // Lấy ID từ route

        $subitemRule = $this->isMethod('post')
            ? 'required|unique:subitems,name'
            : 'sometimes|unique:subitems,name,' . $id;

        return [
            'name' => $subitemRule,
        ];
    }
}
