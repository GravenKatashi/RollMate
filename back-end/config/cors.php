<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => array_filter([
        // Development origins
        'http://localhost:4200',
        'http://localhost:4201',
        'http://127.0.0.1:4200',
        'http://127.0.0.1:4201',
        // Production origin from environment variable
        env('FRONTEND_URL'),
    ]),
    
    // Allow local network IPs for development (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
    // In production, use FRONTEND_URL environment variable instead
    'allowed_origins_patterns' => env('APP_ENV') === 'production' ? [] : [
        '#^http://192\.168\.\d+\.\d+:\d+$#',
        '#^http://10\.\d+\.\d+\.\d+:\d+$#',
        '#^http://172\.(1[6-9]|2[0-9]|3[0-1])\.\d+\.\d+:\d+$#',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];