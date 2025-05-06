<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserRequest extends FormRequest
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
        $id = $this->route()->user;
        $emailRule = 'required|email|unique:users,email';
        $googleIdRule = 'nullable|unique:users,google_id';

        if ($id) {
            $emailRule .= ",{$id}";
            $googleIdRule .= ",{$id}";
        }

        $rules = [
            'name' => 'required|min:4',
            'email' => $emailRule,
            'phone' => 'required',
            'password' => 'required|min:6',
            'role' => 'required',
            'google_id' => $googleIdRule,
        ];

        // Nếu là update, chỉ validate các trường được gửi lên
        if ($id) {
            $rules = array_filter($rules, function ($field) {
                return $this->has($field);
            }, ARRAY_FILTER_USE_KEY);
        }

        return $rules;
    }
    public function messages()
    {
        return [
            'required' => ':attribute bat buoc phai nhap',
            'min' => ':attribute phai tu :min ky tu',
            'email' => ':attribute phai dinh dang email',
            'unique' => ':attribute da ton tai',
            'google_id.unique' => 'Google ID da ton tai',
        ];
    }
    public function attributes()
    {
        return [
            'name' => 'Ten',
            'email' => 'Email',
            'phone' => 'So dien thoai',
            'password' => 'Mat khau',
            'role' => 'Vai tro',
            'google_id' => 'Google ID',
        ];
    }
}
