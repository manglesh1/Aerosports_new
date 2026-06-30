$ErrorActionPreference = "Stop"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
Set-Location "C:\code\Aerosports_new"
$sourceBucket = "aerosports"
$destBucket = "media.aerosportsparks.ca"
$cacheControl = "public,max-age=31536000,immutable"
$assetFile = "asset-migration\sheet-assets.txt"
$resultFile = "asset-migration\copy-results-api.json"
$token = (& gcloud auth print-access-token).Trim()
if (-not $token) { throw "Could not get gcloud access token. Run gcloud auth login first." }
$headers = @{ Authorization = "Bearer $token"; "Content-Type" = "application/json" }
$assets = Get-Content -LiteralPath $assetFile | Where-Object { $_.Trim() }
$results = New-Object System.Collections.Generic.List[object]
$total = $assets.Count
$i = 0
foreach ($objectPath in $assets) {
  $i++
  Write-Host "[$i/$total] $objectPath"
  $src = [uri]::EscapeDataString($objectPath)
  $dst = [uri]::EscapeDataString($objectPath)
  $baseUrl = "https://storage.googleapis.com/storage/v1/b/$sourceBucket/o/$src/rewriteTo/b/$destBucket/o/$dst"
  $body = @{ cacheControl = $cacheControl } | ConvertTo-Json -Compress
  $rewriteToken = $null
  $ok = $false
  $errorMessage = $null
  try {
    do {
      $url = $baseUrl
      if ($rewriteToken) { $url = "$baseUrl`?rewriteToken=$([uri]::EscapeDataString($rewriteToken))" }
      $response = Invoke-RestMethod -Method Post -Uri $url -Headers $headers -Body $body
      $rewriteToken = $response.rewriteToken
    } until ($response.done -eq $true)
    $ok = $true
  } catch {
    $errorMessage = $_.Exception.Message
    if ($_.ErrorDetails.Message) { $errorMessage += " :: " + $_.ErrorDetails.Message }
    Write-Host "FAILED $objectPath :: $errorMessage" -ForegroundColor Red
  }
  $results.Add([pscustomobject]@{ objectPath = $objectPath; ok = $ok; error = $errorMessage }) | Out-Null
  $summary = [pscustomobject]@{
    total = $total
    copied = @($results | Where-Object { $_.ok }).Count
    failed = @($results | Where-Object { -not $_.ok }).Count
    failedItems = @($results | Where-Object { -not $_.ok })
  }
  $summary | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath $resultFile -Encoding utf8
}
Write-Host "Done. Results written to $resultFile" -ForegroundColor Green
Get-Content -LiteralPath $resultFile