<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone', 20)->nullable()->after('email');
            $table->string('company_name')->nullable()->after('phone');
            $table->string('company_siret', 14)->nullable()->after('company_name');
            $table->string('address')->nullable()->after('company_siret');
            $table->string('city', 100)->nullable()->after('address');
            $table->string('postal_code', 10)->nullable()->after('city');
            $table->string('country', 2)->default('FR')->after('postal_code');
            $table->string('locale', 5)->default('fr')->after('country');
            $table->string('timezone', 50)->default('Europe/Paris')->after('locale');
            $table->string('avatar')->nullable()->after('timezone');
            $table->boolean('is_active')->default(true)->after('avatar');
            $table->timestamp('last_login_at')->nullable()->after('is_active');
            $table->softDeletes()->after('updated_at');

            // Indexes
            $table->index('is_active');
            $table->index('deleted_at');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'phone', 'company_name', 'company_siret',
                'address', 'city', 'postal_code', 'country',
                'locale', 'timezone', 'avatar', 'is_active',
                'last_login_at'
            ]);
            $table->dropSoftDeletes();
            $table->dropIndex(['is_active']);
            $table->dropIndex(['deleted_at']);
        });
    }
};
