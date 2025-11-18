<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('property_id')->nullable()->constrained()->onDelete('cascade');
            $table->enum('category', ['repair', 'maintenance', 'tax', 'insurance', 'loan_interest', 'condo_fees', 'management_fees', 'legal', 'other']);
            $table->string('subcategory', 100)->nullable();
            $table->decimal('amount', 10, 2);
            $table->decimal('vat_amount', 10, 2)->default(0);
            $table->decimal('total_amount', 10, 2);
            $table->text('description');
            $table->date('expense_date');
            $table->date('payment_date')->nullable();
            $table->enum('payment_method', ['transfer', 'check', 'cash', 'card', 'direct_debit'])->nullable();
            $table->string('supplier_name')->nullable();
            $table->string('invoice_number', 100)->nullable();
            $table->string('invoice_path')->nullable();
            $table->string('receipt_path')->nullable();
            $table->boolean('is_deductible')->default(true);
            $table->boolean('is_recoverable')->default(false);
            $table->decimal('recovered_amount', 10, 2)->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index('user_id');
            $table->index('property_id');
            $table->index('category');
            $table->index('expense_date');
            $table->index(['is_deductible', 'expense_date']);
            $table->index('deleted_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('expenses');
    }
};
