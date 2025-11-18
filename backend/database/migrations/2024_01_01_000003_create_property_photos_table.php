<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('property_photos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained()->onDelete('cascade');
            $table->string('file_path');
            $table->string('file_name');
            $table->unsignedInteger('file_size');
            $table->string('mime_type', 50);
            $table->unsignedSmallInteger('width')->nullable();
            $table->unsignedSmallInteger('height')->nullable();
            $table->boolean('is_main')->default(false);
            $table->unsignedTinyInteger('display_order')->default(0);
            $table->string('caption')->nullable();
            $table->timestamps();

            // Indexes
            $table->index(['property_id', 'display_order']);
            $table->index(['property_id', 'is_main']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('property_photos');
    }
};
