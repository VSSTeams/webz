<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        Article::insert([
            [
                'title'=>'Tin 1',
                'content'=>'Noi dung 1',
                'image'=>'hinh1',
                'id_author'=>'1',
                'id_subitem'=>'10',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
            [
                'title'=>'Tin 3',
                'content'=>'Noi dung 3',
                'image'=>'hinh2',
                'id_author'=>'1',
                'id_subitem'=>'13',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
            [
                'title'=>'Tin 4',
                'content'=>'Noi dung 4',
                'image'=>'hinh2',
                'id_author'=>'1',
                'id_subitem'=>'12',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
            [
                'title'=>'Tin 5',
                'content'=>'Noi dung 5',
                'image'=>'hinh2',
                'id_author'=>'1',
                'id_subitem'=>'11',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ]
        ]);
        // User::insert([
        //     [
        //         'name'=>'User 1',
        //         'email'=>'user1@gmail.com',
        //         'password'=>bcrypt('123456'),
        //         'created_at' => date('Y-m-d H:i:s'),
        //         'updated_at' => date('Y-m-d H:i:s'),
        //     ],
        //     [
        //         'name'=>'User 2',
        //         'email'=>'user2@gmail.com',
        //         'password'=>bcrypt('123256'),
        //         'created_at' => date('Y-m-d H:i:s'),
        //         'updated_at' => date('Y-m-d H:i:s'),
        //     ]
        // ]);
    }
}
