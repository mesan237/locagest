<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rent_revisions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lease_id')->constrained()->onDelete('cascade');
            $table->date('revision_date');
            $table->decimal('old_rent', 10, 2);
            $table->decimal('new_rent', 10, 2);
            $table->string('indexation_reference', 50);
            $table->decimal('base_index', 10, 4);
            $table->decimal('new_index', 10, 4);
            $table->decimal('increase_percentage', 5, 2);
            $table->text('calculation_formula')->nullable();
            $table->date('applied_from');
            $table->text('notes')->nullable();
            $table->timestamps();

            // Indexes
            $table->index(['lease_id', 'revision_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rent_revisions');
    }
};
