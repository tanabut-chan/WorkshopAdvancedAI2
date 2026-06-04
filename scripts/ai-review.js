const { execSync } = require('child_process');

async function runReview() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('Error: GEMINI_API_KEY environment variable is not set.');
        process.exit(1);
    }

    console.log('Retrieving code changes...');
    let diff = '';
    try {
        // Try getting diff of the last commit
        diff = execSync('git diff HEAD~1 HEAD -- index.html').toString();
    } catch (e) {
        console.log('Could not get commit diff (possibly first commit). Reading full index.html instead...');
        try {
            diff = execSync('cat index.html').toString();
        } catch (err) {
            // fallback for windows environment
            try {
                diff = execSync('type index.html').toString();
            } catch (winErr) {
                console.error('Error reading index.html:', winErr.message);
                process.exit(1);
            }
        }
    }

    if (!diff.trim()) {
        console.log('No code changes detected in index.html to review.');
        process.exit(0);
    }

    console.log('Sending changes to Gemini API for code review...');
    const prompt = `You are a professional AI Code Reviewer. Review the following code changes for a web landing page.
Analyze it for:
1. Critical bugs or syntax errors (e.g. unclosed HTML tags, broken JS scripts).
2. Security issues (e.g. XSS risks, insecure dependencies).
3. SEO improvements (missing meta tags, alt tags, heading hierarchy).
4. Styling defects or non-responsive layout issues.

If you find any CRITICAL blockers that should STOP the deployment, you must explicitly start the feedback line with '[BLOCKER]'.
Otherwise, write constructive recommendations.

Code Changes to Review:
\`\`\`html
${diff}
\`\`\`

Review Report (Keep it concise, in Markdown format):`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const payload = {
        contents: [{
            parts: [{ text: prompt }]
        }]
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Gemini API returned status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        const feedback = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!feedback) {
            throw new Error('Empty response from Gemini API.');
        }

        console.log('\n--- AI CODE REVIEW REPORT ---');
        console.log(feedback);
        console.log('-----------------------------\n');

        if (feedback.includes('[BLOCKER]')) {
            console.error('❌ Deployment stopped: AI detected CRITICAL blockers.');
            process.exit(1);
        } else {
            console.log('✅ AI review passed. Proceeding with deployment...');
            process.exit(0);
        }

    } catch (error) {
        console.error('AI Review failed with error:', error.message);
        // We proceed with the build even if AI review fails due to API issues to avoid blocking CI/CD
        console.log('Proceeding with deployment despite review failure...');
        process.exit(0);
    }
}

runReview();
