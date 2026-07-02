<?php
/**
 * Traitement du formulaire de contact — Esprit Jardin Création
 *
 * IMPORTANT (à faire avant mise en ligne) :
 * 1. Remplacer $destinataire par l'adresse e-mail réelle où recevoir les demandes.
 * 2. Vérifier que la fonction mail() est activée chez l'hébergeur (c'est le cas
 *    sur la quasi-totalité des hébergements mutualisés type OVH/cPanel).
 * 3. Pour une meilleure délivrabilité (éviter les spams), configurer un enregistrement
 *    SPF sur le domaine autorisant le serveur à envoyer des mails "de la part de" ce domaine.
 */

$destinataire = "contact@espritjardincreation.fr";

// Honeypot anti-spam : si ce champ caché est rempli, c'est un robot -> on ignore silencieusement
if (!empty($_POST['societe'])) {
    header("Location: index.html");
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: index.html");
    exit;
}

function clean($val) {
    return htmlspecialchars(trim($val), ENT_QUOTES, 'UTF-8');
}

$nom       = clean($_POST['nom'] ?? '');
$email     = clean($_POST['email'] ?? '');
$telephone = clean($_POST['telephone'] ?? '');
$projet    = clean($_POST['projet'] ?? '');
$message   = clean($_POST['message'] ?? '');

// Validation minimale côté serveur (ne jamais faire confiance au seul JS)
$erreurs = [];
if ($nom === '') $erreurs[] = "nom manquant";
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $erreurs[] = "email invalide";
if ($message === '') $erreurs[] = "message manquant";

if (!empty($erreurs)) {
    header("Location: index.html?erreur=1#contact");
    exit;
}

$sujet = "Nouvelle demande de devis — Esprit Jardin Création";

$corps = "Nouvelle demande reçue via le site espritjardincreation.fr\n\n";
$corps .= "Nom : $nom\n";
$corps .= "E-mail : $email\n";
$corps .= "Téléphone : " . ($telephone !== '' ? $telephone : "non renseigné") . "\n";
$corps .= "Type de projet : " . ($projet !== '' ? $projet : "non précisé") . "\n\n";
$corps .= "Message :\n$message\n";

$headers = "From: site@espritjardincreation.fr\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$envoye = mail($destinataire, $sujet, $corps, $headers);

if ($envoye) {
    header("Location: merci.html");
} else {
    header("Location: index.html?erreur=1#contact");
}
exit;
