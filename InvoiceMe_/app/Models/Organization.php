<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\belongsTo;

class Organization extends Model
{
    protected $table = 'organizations';

    protected $fillable = [
        'nom',
        'logo',
        'pays',
        'type_structure',
        'adresse',
        'code_postal',
        'ville',
        'siret',
        'tva_intracommunautaire',
    ];

    public function clients()
    {
        return $this->hasMany(Client::class);
    }
    public function users()
    {
        return $this->hasMany(User::class);
    }
    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }

}
