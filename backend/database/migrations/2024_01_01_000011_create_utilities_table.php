<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('utilities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lease_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['water', 'electricity', 'gas', 'heating', 'internet', 'other']);
            $table->date('period_start');
            $table->date('period_end');
            $table->decimal('previous_meter_reading', 10, 2)->nullable();
            $table->decimal('current_meter_reading', 10, 2)->nullable();
            $table->decimal('consumption', 10, 2)->nullable();
            $table->decimal('unit_price', 10, 4)->nullable();
            $table->decimal('amount', 10, 2);
            $table->string('invoice_reference', 100)->nullable();
            $table->date('invoice_date')->nullable();
            $table->boolean('paid_by_tenant')->default(false);
            $table->timestamps();

            // Indexes
            $table->index(['lease_id', 'period_start']);
            $table->index('type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('utilities');
    }
};
