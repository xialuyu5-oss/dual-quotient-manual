param([string]$NodeLicenseFile, [switch]$SkipBuild)
$ErrorActionPreference = 'Stop'
function Get-Sha256([string]$File) {
    $stream = [IO.File]::OpenRead($File)
    $sha = [Security.Cryptography.SHA256]::Create()
    try { return ([BitConverter]::ToString($sha.ComputeHash($stream))).Replace('-', '').ToLowerInvariant() }
    finally { $stream.Dispose(); $sha.Dispose() }
}
$project = Split-Path $PSScriptRoot -Parent
Set-Location $project
$node = (Get-Command node.exe).Source
$platform = & $node -p "process.platform + '-' + process.arch"
if ($platform -ne 'win32-x64') { throw 'Build requires Windows x64 Node.js.' }
$nodeVersion = & $node -p 'process.version'
$version = (Get-Content package.json -Raw | ConvertFrom-Json).version
$name = "dual-quotient-manual-v$version-windows-x64"
$output = Join-Path $project ('dist/build-' + (Get-Date -Format 'yyyyMMdd-HHmmss'))
$package = Join-Path $output $name
New-Item -ItemType Directory -Path "$package/app/site", "$package/runtime", "$package/licenses" -Force | Out-Null
$previous = $env:DQ_PORTABLE
try {
    $env:DQ_PORTABLE = '1'
    if (-not $SkipBuild) { & npm.cmd run build }
    if ($LASTEXITCODE -ne 0) { throw 'Static build failed.' }
} finally { $env:DQ_PORTABLE = $previous }
Get-ChildItem (Join-Path $project '.next-portable') -Force | Copy-Item -Destination "$package/app/site" -Recurse
Copy-Item "$PSScriptRoot/server.cjs" "$package/app/server.cjs"
Copy-Item $node "$package/runtime/node.exe"
if ($NodeLicenseFile) {
    Copy-Item $NodeLicenseFile "$package/runtime/LICENSE-node.txt"
} else {
    Invoke-WebRequest "https://raw.githubusercontent.com/nodejs/node/$nodeVersion/LICENSE" -OutFile "$package/runtime/LICENSE-node.txt"
}
$notices = [System.Collections.Generic.List[string]]::new()
$notices.Add("Bundled Node.js $nodeVersion; full license: runtime/LICENSE-node.txt")
$modules = Join-Path $project 'node_modules'
Get-ChildItem $modules -File -Recurse -Force | Where-Object { $_.Name -match '^(LICENSE|LICENCE|NOTICE|COPYING)(\..*)?$' } | ForEach-Object {
    $relative = $_.FullName.Substring($modules.Length + 1)
    $target = Join-Path "$package/licenses" $relative
    New-Item -ItemType Directory -Path (Split-Path $target) -Force | Out-Null
    Copy-Item -LiteralPath $_.FullName -Destination $target
}
$notices.Add('licenses/ preserves dependency notices, including build-time dependencies conservatively.')
[IO.File]::WriteAllLines("$package/THIRD-PARTY-NOTICES.txt", $notices, [Text.UTF8Encoding]::new($true))
Copy-Item "$PSScriptRoot/使用说明.txt" "$package/使用说明.txt"
$compiler = Join-Path $env:WINDIR 'Microsoft.NET/Framework64/v4.0.30319/csc.exe'
$exeName = ([string][char]0x53CC)+[char]0x5546+[char]0x8BAD+[char]0x7EC3+[char]0x624B+[char]0x518C+'.exe'
$launcherSource = Join-Path $PSScriptRoot 'Launcher.cs'
$launcherOutput = Join-Path $package $exeName
& $compiler /nologo /target:winexe /platform:x64 /optimize+ /utf8output /reference:System.Windows.Forms.dll /reference:System.Drawing.dll "/out:$launcherOutput" $launcherSource
if ($LASTEXITCODE -ne 0) { throw 'Launcher compilation failed.' }
@{version=$version; node=$nodeVersion; nodeSha256=(Get-Sha256 "$package/runtime/node.exe"); architecture='windows-x64'} | ConvertTo-Json | Set-Content "$package/build-info.json" -Encoding UTF8
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = Join-Path $output "$name.zip"
[IO.Compression.ZipFile]::CreateFromDirectory($package, $zip, [IO.Compression.CompressionLevel]::Optimal, $true)
$hash = (Get-Sha256 $zip)
"$hash  $name.zip" | Set-Content (Join-Path $output 'SHA256SUMS.txt') -Encoding ASCII
Write-Output "PORTABLE_ZIP=$zip"
