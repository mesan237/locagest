<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('plan_id')->constrained()->onDelete('cascade');
            $table->enum('billing_period', ['monthly', 'yearly'])->default('monthly');
            $table->decimal('amount', 10, 2);
            $table->date('starts_at');
            $table->date('ends_at')->nullable();
            $table->date('trial_ends_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->enum('status', ['trial', 'active', 'cancelled', 'expired', 'suspended'])->default('trial');
            $table->string('payment_method', 50)->nullable();
            $table->date('last_payment_date')->nullable();
            $table->date('next_billing_date')->nullable();
            $table->timestamps();

            // Indexes
            $table->index('user_id');
            $table->index(['status', 'ends_at']);
            $table->index('next_billing_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
