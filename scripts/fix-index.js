const fs = require('fs');

let content = fs.readFileSync('f:\\Dev\\WorkshopAdvancedAI2\\index.html', 'utf8');

// 1. Mobile Carousel Content Clipping
content = content.replace(
    'snap-mandatory hide-scrollbar relative z-10 justify-center">',
    'snap-mandatory hide-scrollbar relative z-10 justify-start md:justify-center">'
);

// 2. Add .hide-scrollbar CSS
content = content.replace(
    /(\.animate-gradient\s*\{[\s\S]*?\})/,
    `$1\n        .hide-scrollbar::-webkit-scrollbar {\n            display: none;\n        }\n        .hide-scrollbar {\n            -ms-overflow-style: none;\n            scrollbar-width: none;\n        }`
);

// 3. Heading Hierarchy Disruption
content = content.replace(
    '<h3 class="font-headline-lg text-[32px] text-on-surface mb-6 leading-tight">Translate ideas into interfaces.</h3>',
    '<h2 class="font-headline-lg text-[32px] text-on-surface mb-6 leading-tight">Translate ideas into interfaces.</h2>'
);
content = content.replace(
    '<h3 class="font-headline-lg text-[32px] text-on-surface mb-6 leading-tight">Serverless backends by design.</h3>',
    '<h2 class="font-headline-lg text-[32px] text-on-surface mb-6 leading-tight">Serverless backends by design.</h2>'
);

// 4. Redundant fontFamily Definitions
content = content.replace(
    /"fontFamily":\s*\{[\s\S]*?\},\s*"fontSize":/,
    `"fontFamily": {
                    "sans": [
                            "Plus Jakarta Sans",
                            "sans-serif"
                    ]
            },
            "fontSize":`
);

// 5. Exposing Icon Ligatures to Screen Readers (A11y)
// Find spans containing material-symbols-outlined and add aria-hidden="true"
content = content.replace(/<span\s+class="([^"]*material-symbols-outlined[^"]*)"(?![^>]*aria-hidden)/g, '<span class="$1" aria-hidden="true"');

// Wait, the FAQ icons are like: <span class="faq-icon material-symbols-outlined ...">add</span>
// The regex /<span\s+class="([^"]*material-symbols-outlined[^"]*)"(?![^>]*aria-hidden)/g matches exactly this and adds the attribute before > or other attributes.
// Let's refine the regex to be safer:
// content = content.replace(/<span([^>]*class="[^"]*material-symbols-outlined[^"]*"[^>]*)>/g, (match, p1) => {
//     if (match.includes('aria-hidden')) return match;
//     return `<span${p1} aria-hidden="true">`;
// });

content = fs.readFileSync('f:\\Dev\\WorkshopAdvancedAI2\\index.html', 'utf8'); // re-read to use the function replacer for safety

content = content.replace(
    'snap-mandatory hide-scrollbar relative z-10 justify-center">',
    'snap-mandatory hide-scrollbar relative z-10 justify-start md:justify-center">'
);

content = content.replace(
    /(\.animate-gradient\s*\{[\s\S]*?\})/,
    `$1\n        .hide-scrollbar::-webkit-scrollbar {\n            display: none;\n        }\n        .hide-scrollbar {\n            -ms-overflow-style: none;\n            scrollbar-width: none;\n        }`
);

content = content.replace(
    '<h3 class="font-headline-lg text-[32px] text-on-surface mb-6 leading-tight">Translate ideas into interfaces.</h3>',
    '<h2 class="font-headline-lg text-[32px] text-on-surface mb-6 leading-tight">Translate ideas into interfaces.</h2>'
);
content = content.replace(
    '<h3 class="font-headline-lg text-[32px] text-on-surface mb-6 leading-tight">Serverless backends by design.</h3>',
    '<h2 class="font-headline-lg text-[32px] text-on-surface mb-6 leading-tight">Serverless backends by design.</h2>'
);

content = content.replace(
    /"fontFamily":\s*\{[\s\S]*?\},\s*"fontSize":/,
    `"fontFamily": {
                    "sans": [
                            "Plus Jakarta Sans",
                            "sans-serif"
                    ]
            },
            "fontSize":`
);

content = content.replace(/<span([^>]*class="[^"]*material-symbols-outlined[^"]*"[^>]*)>/g, (match, p1) => {
    if (match.includes('aria-hidden')) return match;
    return `<span${p1} aria-hidden="true">`;
});

fs.writeFileSync('f:\\Dev\\WorkshopAdvancedAI2\\index.html', content);
console.log('Successfully updated index.html');
