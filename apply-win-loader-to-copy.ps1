$ErrorActionPreference = 'Stop'
$project = 'C:\code\Aerosports_new - Copy - Copy'
$log = 'C:\code\Aerosports_new\apply-win-loader-to-copy.log'
try {
  Set-Location -LiteralPath $project
  $loader = @(
    'import { pathToFileURL } from "node:url";',
    '',
    'const windowsAbsolutePath = /^[a-zA-Z]:[\\\\/]/;',
    '',
    'export async function resolve(specifier, context, nextResolve) {',
    '  if (windowsAbsolutePath.test(specifier)) {',
    '    return nextResolve(pathToFileURL(specifier).href, context);',
    '  }',
    '  return nextResolve(specifier, context);',
    '}',
    ''
  ) -join [Environment]::NewLine
  Set-Content -LiteralPath 'win-esm-loader.mjs' -Value $loader -Encoding utf8
  $pkg = Get-Content -LiteralPath 'package.json' -Raw | ConvertFrom-Json
  $pkg.scripts.'preview:cf' = 'set NODE_OPTIONS=--experimental-loader=./win-esm-loader.mjs && opennextjs-cloudflare build && opennextjs-cloudflare preview'
  $pkg.scripts.'deploy:cf' = 'set NODE_OPTIONS=--experimental-loader=./win-esm-loader.mjs && opennextjs-cloudflare build && opennextjs-cloudflare deploy'
  $json = $pkg | ConvertTo-Json -Depth 100
  [System.IO.File]::WriteAllText((Join-Path $project 'package.json'), $json + [Environment]::NewLine, [System.Text.UTF8Encoding]::new($false))
  'OK' | Set-Content -LiteralPath $log -Encoding ascii
} catch {
  ('ERROR: ' + $_.Exception.Message) | Set-Content -LiteralPath $log -Encoding ascii
  throw
}