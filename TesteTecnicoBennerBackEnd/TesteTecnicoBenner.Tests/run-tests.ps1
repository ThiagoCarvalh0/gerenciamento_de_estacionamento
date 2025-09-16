# Script para executar testes do projeto de estacionamento
# Demonstra diferentes formas de executar testes para entrevistas técnicas

Write-Host "=== Testes do Sistema de Estacionamento ===" -ForegroundColor Green
Write-Host ""

# Executar todos os testes
Write-Host "1. Executando todos os testes..." -ForegroundColor Yellow
dotnet test --verbosity normal

Write-Host ""
Write-Host "2. Executando testes com cobertura de código..." -ForegroundColor Yellow
dotnet test --collect:"XPlat Code Coverage" --verbosity normal

Write-Host ""
Write-Host "3. Executando apenas testes unitários..." -ForegroundColor Yellow
dotnet test --filter "FullyQualifiedName~Unit" --verbosity normal

Write-Host ""
Write-Host "4. Executando apenas testes de integração..." -ForegroundColor Yellow
dotnet test --filter "FullyQualifiedName~Integration" --verbosity normal

Write-Host ""
Write-Host "5. Executando testes com relatório detalhado..." -ForegroundColor Yellow
dotnet test --logger "console;verbosity=detailed"

Write-Host ""
Write-Host "=== Testes Concluídos ===" -ForegroundColor Green
Write-Host "Para mais informações, consulte o README.md na pasta de testes."
