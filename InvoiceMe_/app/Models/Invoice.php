<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    protected $table = 'invoices';

    protected $fillable = [
        'client_id',
        'organization_id',
        'title',
        'status',
        'invoice_number',
        'date_of_issue',
        'due_date',
        'total_amount',
        'tva_rate',
        'total_ht',
        'total_tva',
    ];

    protected function casts(): array
    {
        return [
            'date_of_issue' => 'date',
            'due_date' => 'date',
            'total_amount' => 'decimal:2',
            'tva_rate' => 'decimal:2',
            'total_ht' => 'decimal:2',
            'total_tva' => 'decimal:2',
        ];
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }
    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }
    public function items()
    {
        return $this->hasMany(InvoiceItem::class);
    }

}
