<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rent_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rent_id')->constrained()->onDelete('cascade');
            $table->decimal('amount', 10, 2);
            $table->date('payment_date');
            $table->enum('payment_method', ['transfer', 'check', 'cash', 'direct_debit', 'card', 'other']);
            $table->string('transaction_reference', 100)->nullable();
            $table->string('bank_name', 100)->nullable();
            $table->string('receipt_number', 50)->nullable();
            $table->timestamp('receipt_generated_at')->nullable();
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index('rent_id');
            $table->index('payment_date');
            $table->index('receipt_number');
            $table->index('deleted_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rent_payments');
    }
};
