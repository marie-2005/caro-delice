# Script pour créer les icônes manquantes
# Exécutez ce script dans PowerShell depuis le dossier public/images

Add-Type -AssemblyName System.Drawing

# Créer icon-128x128.png depuis icon-144x144.png (redimensionner)
if (Test-Path "icon-144x144.png") {
    $img = [System.Drawing.Image]::FromFile((Resolve-Path "icon-144x144.png"))
    $newImg = New-Object System.Drawing.Bitmap(128, 128)
    $graphics = [System.Drawing.Graphics]::FromImage($newImg)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.DrawImage($img, 0, 0, 128, 128)
    $newImg.Save("icon-128x128.png", [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $newImg.Dispose()
    $img.Dispose()
    Write-Host "✅ icon-128x128.png créé" -ForegroundColor Green
}

# Créer icon-152x152.png depuis icon-144x144.png (redimensionner légèrement)
if (Test-Path "icon-144x144.png") {
    $img = [System.Drawing.Image]::FromFile((Resolve-Path "icon-144x144.png"))
    $newImg = New-Object System.Drawing.Bitmap(152, 152)
    $graphics = [System.Drawing.Graphics]::FromImage($newImg)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.DrawImage($img, 0, 0, 152, 152)
    $newImg.Save("icon-152x152.png", [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $newImg.Dispose()
    $img.Dispose()
    Write-Host "✅ icon-152x152.png créé" -ForegroundColor Green
}

# Créer icon-384x384.png depuis icon-512x512.png (redimensionner)
if (Test-Path "icon-512x512.png") {
    $img = [System.Drawing.Image]::FromFile((Resolve-Path "icon-512x512.png"))
    $newImg = New-Object System.Drawing.Bitmap(384, 384)
    $graphics = [System.Drawing.Graphics]::FromImage($newImg)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.DrawImage($img, 0, 0, 384, 384)
    $newImg.Save("icon-384x384.png", [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $newImg.Dispose()
    $img.Dispose()
    Write-Host "✅ icon-384x384.png créé" -ForegroundColor Green
}

Write-Host "`n🎉 Toutes les icônes manquantes ont été créées !" -ForegroundColor Cyan

