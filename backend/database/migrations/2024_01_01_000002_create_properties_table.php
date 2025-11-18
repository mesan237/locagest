<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('reference', 50)->unique();
            $table->string('name');
            $table->enum('type', ['apartment', 'house', 'commercial', 'parking', 'office', 'land', 'garage']);
            $table->string('address');
            $table->string('address_complement')->nullable();
            $table->string('city', 100);
            $table->string('postal_code', 10);
            $table->string('country', 2)->default('FR');
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->string('cadastral_reference', 50)->nullable();
            $table->decimal('surface_area', 8, 2)->nullable();
            $table->tinyInteger('rooms')->unsigned()->nullable();
            $table->tinyInteger('bedrooms')->unsigned()->nullable();
            $table->tinyInteger('bathrooms')->unsigned()->nullable();
            $table->tinyInteger('floor')->nullable();
            $table->tinyInteger('total_floors')->unsigned()->nullable();
            $table->year('construction_year')->nullable();
            $table->char('energy_rating', 1)->nullable();
            $table->char('ges_rating', 1)->nullable();
            $table->boolean('has_elevator')->default(false);
            $table->boolean('has_parking')->default(false);
            $table->boolean('has_balcony')->default(false);
            $table->boolean('has_terrace')->default(false);
            $table->boolean('has_garden')->default(false);
            $table->boolean('is_furnished')->default(false);
            $table->text('description')->nullable();
            $table->json('equipment')->nullable();
            $table->enum('status', ['available', 'rented', 'maintenance', 'sold', 'draft'])->default('draft');
            $table->date('acquisition_date')->nullable();
            $table->decimal('acquisition_price', 10, 2)->nullable();
            $table->decimal('estimated_value', 10, 2)->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index('user_id');
            $table->index('reference');
            $table->index('status');
            $table->index('type');
            $table->index('city');
            $table->index('deleted_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
