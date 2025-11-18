<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tenants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('first_name', 100);
            $table->string('last_name', 100);
            $table->string('email')->nullable();
            $table->string('phone', 20)->nullable();
            $table->string('phone_secondary', 20)->nullable();
            $table->date('birth_date')->nullable();
            $table->string('birth_place', 100)->nullable();
            $table->string('nationality', 100)->nullable();
            $table->enum('id_card_type', ['national_id', 'passport', 'residence_permit'])->nullable();
            $table->string('id_card_number', 50)->nullable();
            $table->date('id_card_expiry_date')->nullable();
            $table->string('profession', 100)->nullable();
            $table->string('employer')->nullable();
            $table->decimal('monthly_income', 10, 2)->nullable();
            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_phone', 20)->nullable();
            $table->text('notes')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index('user_id');
            $table->index('email');
            $table->index('is_active');
            $table->index('deleted_at');
            $table->index(['last_name', 'first_name']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tenants');
    }
};
