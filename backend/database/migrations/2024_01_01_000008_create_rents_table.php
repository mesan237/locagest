<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lease_id')->constrained()->onDelete('cascade');
            $table->date('period_start');
            $table->date('period_end');
            $table->decimal('rent_amount', 10, 2);
            $table->decimal('charges_amount', 10, 2)->default(0);
            $table->decimal('other_amount', 10, 2)->default(0);
            $table->decimal('total_amount', 10, 2);
            $table->decimal('paid_amount', 10, 2)->default(0);
            $table->date('due_date');
            $table->enum('status', ['pending', 'paid', 'partial', 'late', 'cancelled'])->default('pending');
            $table->boolean('is_auto_generated')->default(true);
            $table->text('notes')->nullable();
            $table->timestamps();

            // Indexes
            $table->index(['lease_id', 'period_start']);
            $table->index('status');
            $table->index('due_date');
            $table->unique(['lease_id', 'period_start', 'period_end']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rents');
    }
};
