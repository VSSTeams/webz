<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->integer('id')->unsigned()->autoIncrement();
            $table->integer('user_id')->unsigned();
            $table->string('email');
            $table->string('name');
            $table->string('phone');
            $table->string('address');
            $table->string('payment_method')->nullable(); // Thêm cột payment_method
            $table->tinyInteger('status')->default(0); // Thêm cột status với giá trị mặc định là 0 (chờ xử lý)
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('RESTRICT')->onUpdate('RESTRICT');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
