<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('leases', function (Blueprint $table) {
            $table->id();
            $table->string('reference', 50)->unique();
            $table->foreignId('property_id')->constrained()->onDelete('cascade');
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['residential', 'commercial', 'seasonal', 'colocation'])->default('residential');
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->decimal('initial_rent', 10, 2);
            $table->decimal('current_rent', 10, 2);
            $table->decimal('charges', 10, 2)->default(0);
            $table->enum('charges_type', ['included', 'additional', 'provision'])->default('additional');
            $table->decimal('deposit', 10, 2)->default(0);
            $table->date('deposit_paid_date')->nullable();
            $table->date('deposit_returned_date')->nullable();
            $table->decimal('deposit_returned_amount', 10, 2)->nullable();
            $table->tinyInteger('rent_payment_day')->default(1);
            $table->enum('rent_payment_method', ['transfer', 'check', 'cash', 'direct_debit'])->nullable();
            $table->string('indexation_reference', 50)->nullable();
            $table->decimal('indexation_base_value', 10, 4)->nullable();
            $table->date('indexation_date')->nullable();
            $table->date('last_indexation_date')->nullable();
            $table->tinyInteger('notice_period_tenant')->default(1);
            $table->tinyInteger('notice_period_landlord')->default(6);
            $table->boolean('renewable')->default(true);
            $table->date('signed_date')->nullable();
            $table->enum('status', ['draft', 'active', 'terminated', 'suspended'])->default('draft');
            $table->date('termination_date')->nullable();
            $table->text('termination_reason')->nullable();
            $table->date('termination_notice_date')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index('property_id');
            $table->index('tenant_id');
            $table->index('reference');
            $table->index('status');
            $table->index(['start_date', 'end_date']);
            $table->index(['status', 'end_date']);
            $table->index('deleted_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leases');
    }
};
