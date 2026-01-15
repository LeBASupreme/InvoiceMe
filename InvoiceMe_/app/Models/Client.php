<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    protected $table = 'clients';

    protected $fillable = [
        'nom',
        'logo',
        'email',
        'telephone',
        'adresse',
        'code_postal',
        'ville',
        'pays',
        'siret',
        'organization_id',
    ];

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function invoices()
{
    return $this->hasMany(Invoice::class);
}


}
