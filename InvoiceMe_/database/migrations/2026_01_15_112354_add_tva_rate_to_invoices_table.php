<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->decimal('tva_rate', 5, 2)->default(20.00)->after('total_amount');
            $table->decimal('total_ht', 10, 2)->nullable()->after('tva_rate');
            $table->decimal('total_tva', 10, 2)->nullable()->after('total_ht');
        });
    }

    public function down(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->dropColumn(['tva_rate', 'total_ht', 'total_tva']);
        });
    }
};
