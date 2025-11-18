<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('property_inventories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lease_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['check_in', 'check_out']);
            $table->date('date');
            $table->string('inspector_name')->nullable();
            $table->boolean('tenant_present')->default(true);
            $table->boolean('landlord_present')->default(true);
            $table->decimal('water_meter', 10, 2)->nullable();
            $table->decimal('electricity_meter', 10, 2)->nullable();
            $table->decimal('gas_meter', 10, 2)->nullable();
            $table->unsignedTinyInteger('keys_count')->default(1);
            $table->enum('general_condition', ['excellent', 'good', 'fair', 'poor']);
            $table->text('observations')->nullable();
            $table->foreignId('document_id')->nullable()->constrained()->onDelete('set null');
            $table->boolean('signed_by_tenant')->default(false);
            $table->boolean('signed_by_landlord')->default(false);
            $table->timestamps();

            // Indexes
            $table->index(['lease_id', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('property_inventories');
    }
};
