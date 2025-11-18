<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventory_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inventory_id')->constrained('property_inventories')->onDelete('cascade');
            $table->string('room', 100);
            $table->string('item');
            $table->enum('condition', ['excellent', 'good', 'fair', 'poor', 'damaged']);
            $table->unsignedTinyInteger('quantity')->default(1);
            $table->text('observations')->nullable();
            $table->json('photo_paths')->nullable();
            $table->unsignedSmallInteger('display_order')->default(0);
            $table->timestamps();

            // Indexes
            $table->index(['inventory_id', 'display_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory_items');
    }
};
