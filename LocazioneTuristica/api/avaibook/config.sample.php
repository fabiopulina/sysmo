<?php
/**
 * Copy this file to config.php (NOT committed) and fill values from AvaiBook.
 *
 * PRE-PRODUZIONE (.biz):
 *   Login: https://app.avaibook.biz/login.php
 *   API token: https://app.avaibook.biz/herramientas_api_rest_datos.php
 *   API base: https://api.avaibook.biz
 *   Docs: https://api.avaibook.biz/doc/owner/api
 *
 * PRODUZIONE (.com):
 *   Login: https://app.avaibook.com/login.php
 *   API token: https://app.avaibook.com/herramientas_api_rest_datos.php
 *   API base: https://api.avaibook.com
 *
 * Accommodation ID: after login, list properties or call
 *   GET /api/owner/accommodations/  (via proxy?action=accommodations)
 */
return [
    // Produzione (.com) — come nella schermata Configurazione API AvaiBook
    'env' => 'com', // biz | com
    'base_url' => 'https://api.avaibook.com',
    'token' => 'PASTE_TOKEN_HERE', // clicca l’icona Copia sulla chiave "owner" (non incollarlo in chat)
    // ID alloggio Sanchioli 11
    'default_accommodation_id' => '408300',
];
