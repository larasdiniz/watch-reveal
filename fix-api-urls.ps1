# fix-api-urls.ps1
# Script para corrigir todas as URLs da API

# URL do seu backend no Render
$API_URL = "https://watch-reveal-backend.onrender.com"

Write-Host "🔧 Corrigindo URLs da API..." -ForegroundColor Green
Write-Host "API URL: $API_URL" -ForegroundColor Cyan

# Lista de arquivos para corrigir
$filesToFix = @(
    "src/components/ComparisonSection.tsx",
    "src/components/CTASection.tsx", 
    "src/components/FeatureStory.tsx",
    "src/components/HeroSection.tsx",
    "src/components/MediaCardGallery.tsx",
    "src/pages/Checkout.tsx",
    "src/pages/Comprar.tsx", 
    "src/pages/ModelsPage.tsx",
    "src/pages/ProductDetail.tsx"
)

foreach ($file in $filesToFix) {
    if (Test-Path $file) {
        Write-Host "`n📁 Processando: $file" -ForegroundColor Yellow
        
        # Ler conteúdo
        $content = Get-Content $file -Raw
        
        # Substituir localhost:3001 pela URL da API
        $newContent = $content -replace "http://localhost:3001", $API_URL
        
        # Salvar arquivo
        Set-Content $file $newContent -Encoding UTF8
        
        Write-Host "   ✅ Arquivo atualizado!" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Arquivo não encontrado: $file" -ForegroundColor Red
    }
}

Write-Host "`n🎉 Todos os arquivos foram atualizados!" -ForegroundColor Green
Write-Host "`nAgora adicione esta constante no topo de cada arquivo:" -ForegroundColor Cyan
Write-Host 'const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";' -ForegroundColor Yellow