$path = "f:\Dev\WorkshopAdvancedAI2\index.html"
$content = [System.IO.File]::ReadAllText($path)

# 1. Critical Bug [BLOCKER]: Runtime Exception in CTA Mouse Move Interaction
$content = $content.Replace(
    'id="contact" onmousemove="updateGlowPosition(event)"',
    'id="contact"'
)

$glowFunctionOld = @"
    // Glow position helper for CTA section
    function updateGlowPosition(event) {
        const cta = event.currentTarget;
        const rect = cta.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        cta.style.setProperty('--mouse-x', `${x}px`);
        cta.style.setProperty('--mouse-y', `${y}px`);
    }
"@
$glowFunctionNew = @"
    // Glow position helper for CTA section
    const ctaSection = document.getElementById('contact');
    if (ctaSection) {
        ctaSection.addEventListener('mousemove', (event) => {
            const rect = ctaSection.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            ctaSection.style.setProperty('--mouse-x', `${x}px`);
            ctaSection.style.setProperty('--mouse-y', `${y}px`);
        });
    }
"@
$content = $content.Replace($glowFunctionOld, $glowFunctionNew)

# 2. Missing ARIA Roles on Accordions (FAQ)
$content = $content.Replace('<h3 class="text-headline-md text-on-surface group-hover:text-primary transition-colors text-xl font-light">', '<h3 aria-expanded="false" class="text-headline-md text-on-surface group-hover:text-primary transition-colors text-xl font-light">')

$faqFunctionOld = @"
    // FAQ toggle function
    function toggleFaq(element) {
        const isActive = element.classList.contains('active');
        
        // Close all FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });

        // Toggle clicked item
        if (!isActive) {
            element.classList.add('active');
        }
    }
"@
$faqFunctionNew = @"
    // FAQ toggle function
    function toggleFaq(element) {
        const isActive = element.classList.contains('active');
        
        // Close all FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
            const heading = item.querySelector('h3');
            if (heading) heading.setAttribute('aria-expanded', 'false');
        });

        // Toggle clicked item
        if (!isActive) {
            element.classList.add('active');
            const heading = element.querySelector('h3');
            if (heading) heading.setAttribute('aria-expanded', 'true');
        }
    }
"@
$content = $content.Replace($faqFunctionOld, $faqFunctionNew)

# 3. Image-like SVG Metadata
$content = $content.Replace('<svg class="h-8 w-8 text-primary" fill="none" height="32" viewBox="0 0 32 32" width="32" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Horizon Logo">', '<svg class="h-8 w-8 text-primary" fill="none" height="32" viewBox="0 0 32 32" width="32" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Horizon Logo"><title>Horizon Logo</title>')
$content = $content.Replace('<svg class="h-6 w-6 text-on-surface" fill="none" height="24" viewBox="0 0 32 32" width="24" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Horizon Logo">', '<svg class="h-6 w-6 text-on-surface" fill="none" height="24" viewBox="0 0 32 32" width="24" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Horizon Logo"><title>Horizon Logo</title>')

# 4. Flexbox Layout Center-Scroll Bug (Showcase Section)
$content = $content.Replace('justify-start md:justify-center', 'justify-start xl:justify-center')

# 5. Font Scaling Accessibility (Tailwind Configuration)
$content = $content.Replace('"label-caps": [
                            "12px",', '"label-caps": [
                            "0.75rem",')
$content = $content.Replace('"headline-lg": [
                            "40px",', '"headline-lg": [
                            "2.5rem",')
$content = $content.Replace('"body-lg": [
                            "18px",', '"body-lg": [
                            "1.125rem",')
$content = $content.Replace('"headline-md": [
                            "24px",', '"headline-md": [
                            "1.5rem",')
$content = $content.Replace('"display-xl": [
                            "64px",', '"display-xl": [
                            "4rem",')
$content = $content.Replace('"body-md": [
                            "16px",', '"body-md": [
                            "1rem",')

# Write back to file, preserving UTF8 Encoding so grep_search works in the future
[System.IO.File]::WriteAllText($path, $content, [System.Text.Encoding]::UTF8)
Write-Output "Applied all AI Code Review fixes."
