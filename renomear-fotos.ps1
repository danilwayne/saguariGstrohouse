# =====================================================================
#  SAGUARI - renomeador automatico de fotos
#
#  COMO USAR (10 segundos):
#   1. Salve as fotos dentro da pasta:  assets\img\_baixadas
#      Pode salvar com qualquer nome (image1.jpg, download.webp, etc).
#      IMPORTANTE: salve NA ORDEM da lista que aparece abaixo.
#   2. Botao direito neste arquivo > "Executar com o PowerShell"
#
#  O script pega as fotos na ordem em que voce salvou e renomeia para os
#  nomes que a landing page espera. No fim, abre o site pronto.
# =====================================================================

$raiz    = Split-Path -Parent $MyInvocation.MyCommand.Path
$origem  = Join-Path $raiz "assets\img\_baixadas"
$destino = Join-Path $raiz "assets\img"

$alvos = @(
  @{ nome = "hero.jpg";      desc = "TOPO - a foto mais bonita do salao a noite (horizontal)" },
  @{ nome = "ambiente.jpg";  desc = "A CASA - interior / mesas (VERTICAL)" },
  @{ nome = "carnes.jpg";    desc = "CARD - carne na tabua / ancho" },
  @{ nome = "pizzas.jpg";    desc = "CARD - pizza" },
  @{ nome = "drinks.jpg";    desc = "CARD - drinks coloridos" },
  @{ nome = "panelas.jpg";   desc = "CARD - panela / caldeirada com arroz" },
  @{ nome = "porcoes.jpg";   desc = "CARD - porcoes / petiscos / croquete" },
  @{ nome = "vinhos.jpg";    desc = "CARD - garrafa de vinho / taca" },
  @{ nome = "happyhour.jpg"; desc = "FAIXA - drink em destaque (horizontal)" },
  @{ nome = "cta.jpg";       desc = "BLOCO FINAL - ambiente com luzes (horizontal)" },
  @{ nome = "g1.jpg";        desc = "GALERIA 1 (vertical)" },
  @{ nome = "g2.jpg";        desc = "GALERIA 2 (vertical)" },
  @{ nome = "g3.jpg";        desc = "GALERIA 3 (vertical)" },
  @{ nome = "g4.jpg";        desc = "GALERIA 4 (vertical)" },
  @{ nome = "g5.jpg";        desc = "GALERIA 5 (vertical)" },
  @{ nome = "g6.jpg";        desc = "GALERIA 6 (vertical)" },
  @{ nome = "og-cover.jpg";  desc = "MINIATURA ao compartilhar no WhatsApp" }
)

if (-not (Test-Path $origem)) {
  New-Item -ItemType Directory -Path $origem -Force | Out-Null
}

$fotos = @(Get-ChildItem -Path $origem -File |
           Where-Object { $_.Extension -match '^\.(jpg|jpeg|png|webp|avif)$' } |
           Sort-Object CreationTime)

Write-Host ""
Write-Host "=== SAGUARI - renomeador de fotos ===" -ForegroundColor Yellow

if ($fotos.Count -eq 0) {
  Write-Host ""
  Write-Host "Nenhuma foto encontrada em:" -ForegroundColor Red
  Write-Host "  $origem"
  Write-Host ""
  Write-Host "Salve as fotos nessa pasta, NESTA ORDEM:" -ForegroundColor Cyan
  $i = 1
  foreach ($a in $alvos) {
    Write-Host ("  {0,2}. {1}" -f $i, $a.desc)
    $i++
  }
  Write-Host ""
  Read-Host "Pressione ENTER para fechar"
  exit
}

Write-Host ("Encontradas {0} foto(s). Renomeando na ordem em que foram salvas..." -f $fotos.Count) -ForegroundColor Cyan
Write-Host ""

$n = [Math]::Min($fotos.Count, $alvos.Count)
for ($i = 0; $i -lt $n; $i++) {
  $de   = $fotos[$i].FullName
  $para = Join-Path $destino $alvos[$i].nome
  Copy-Item -Path $de -Destination $para -Force
  Write-Host ("  OK   {0,-14} <- {1}" -f $alvos[$i].nome, $fotos[$i].Name) -ForegroundColor Green
}

if ($fotos.Count -gt $alvos.Count) {
  Write-Host ""
  Write-Host ("Aviso: {0} foto(s) a mais foram ignoradas." -f ($fotos.Count - $alvos.Count)) -ForegroundColor DarkYellow
}
if ($fotos.Count -lt $alvos.Count) {
  Write-Host ""
  Write-Host "Faltando (a pagina mostra o gradiente verde no lugar):" -ForegroundColor DarkYellow
  for ($i = $fotos.Count; $i -lt $alvos.Count; $i++) {
    Write-Host ("  --   {0,-14} {1}" -f $alvos[$i].nome, $alvos[$i].desc)
  }
}

Write-Host ""
Write-Host "Pronto! Abrindo o site..." -ForegroundColor Yellow
Start-Process (Join-Path $raiz "index.html")
Write-Host ""
Read-Host "Pressione ENTER para fechar"
