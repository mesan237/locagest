<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('documentable_type');
            $table->unsignedBigInteger('documentable_id');
            $table->enum('type', ['lease_contract', 'receipt', 'inventory_in', 'inventory_out', 'insurance', 'id_card', 'income_proof', 'guarantee', 'notice', 'other']);
            $table->string('category', 100)->nullable();
            $table->string('name');
            $table->string('file_path');
            $table->string('file_name');
            $table->unsignedInteger('file_size');
            $table->string('mime_type', 50);
            $table->unsignedTinyInteger('version')->default(1);
            $table->boolean('is_signed')->default(false);
            $table->date('signed_date')->nullable();
            $table->date('expiry_date')->nullable();
            $table->boolean('is_archived')->default(false);
            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index('user_id');
            $table->index(['documentable_type', 'documentable_id']);
            $table->index('type');
            $table->index('expiry_date');
            $table->index('deleted_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
