<?php
// backend/db_seed/import_pessoas_csv.php
// Uso: php import_pessoas_csv.php membros.csv

if ($argc < 2) { die("Uso: php import_pessoas_csv.php arquivo.csv\n"); }
$csvFile = $argv[1];
if (!file_exists($csvFile)) { die("Arquivo não encontrado: $csvFile\n"); }

$dbFile = __DIR__ . '/../database/ibvrd.sqlite';
$pdo = new PDO("sqlite:" . $dbFile);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$fp = fopen($csvFile, 'r');
$header = fgetcsv($fp);
if (!$header) die("CSV sem cabeçalho.\n");

$norm = fn($s) => mb_strtolower(trim(preg_replace('/\s+/', ' ', $s)));

$idx = [];
foreach ($header as $i => $col) $idx[$norm($col)] = $i;

// Ajuste os nomes conforme estiver no seu CSV:
$colNome = $idx['nome completo'] ?? null;
$colNasc = $idx['data de nascimento'] ?? null;
$colTel  = $idx['telefone'] ?? null;
$colEmail = $idx['e-mail'] ?? ($idx['email'] ?? null);
$colEnd  = $idx['endereço'] ?? ($idx['endereco'] ?? null);
$colMin  = $idx['função ministerial exerce'] ?? ($idx['função ministerial'] ?? ($idx['ministerio'] ?? null));

if ($colNome === null) die("Não achei a coluna 'Nome completo'.\n");

$insert = $pdo->prepare("
  INSERT INTO pessoas (nome_completo, data_nascimento, telefone, email, endereco, tipo, ministerio, observacoes)
  VALUES (:nome, :nasc, :tel, :email, :end, :tipo, :min, :obs)
");

$pdo->beginTransaction();
$inseridos = 0;

while (($row = fgetcsv($fp)) !== false) {
  $nome = trim($row[$colNome] ?? '');
  if ($nome === '') continue;

  $insert->execute([
    ':nome' => $nome,
    ':nasc' => trim($row[$colNasc] ?? ''),
    ':tel' => trim($row[$colTel] ?? ''),
    ':email' => trim($row[$colEmail] ?? ''),
    ':end' => trim($row[$colEnd] ?? ''),
    ':tipo' => 'Membro',
    ':min' => trim($row[$colMin] ?? ''),
    ':obs' => '', // você disse que não quer mais infos
  ]);

  $inseridos++;
}

$pdo->commit();
fclose($fp);

echo "Inseridos: $inseridos\n";