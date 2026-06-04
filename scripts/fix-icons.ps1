$path = "f:\Dev\WorkshopAdvancedAI2\index.html"
$content = [System.IO.File]::ReadAllText($path)
$content = [regex]::Replace($content, '(?i)<span([^>]*)class="([^"]*material-symbols-outlined[^"]*)"([^>]*)>', {
    param($match)
    if ($match.Value.Contains("aria-hidden")) { return $match.Value }
    return "<span" + $match.Groups[1].Value + 'class="' + $match.Groups[2].Value + '"' + $match.Groups[3].Value + ' aria-hidden="true">'
})
[System.IO.File]::WriteAllText($path, $content)
Write-Output "Accessibility attributes successfully injected."
