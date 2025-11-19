import html2pdf from 'html2pdf.js';

export function generatePDF(note: string, username: string) {
    // Create a container that's visible but off-screen for proper rendering
    const container = document.createElement('div');
    container.style.cssText = `
        position: fixed;
        left: 0;
        top: 0;
        width: 600px;
        z-index: -9999;
        opacity: 0;
        pointer-events: none;
    `;

    // Create the HTML content with inline styles
    container.innerHTML = `
        <div id="pdf-content" style="
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #000000;
            padding: 60px 50px;
            width: 600px;
            background: #ffffff;
            box-sizing: border-box;
        ">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 40px;">
                <h1 style="
                    font-size: 42px;
                    font-weight: 700;
                    margin: 0 0 15px 0;
                    letter-spacing: -1px;
                    color: #000000;
                ">Cheerify</h1>
                <p style="
                    font-size: 16px;
                    color: #666666;
                    margin: 0;
                    font-weight: 500;
                ">A personalized note for @${username}</p>
            </div>

            <!-- Divider -->
            <div style="
                border-top: 3px solid #e0e0e0;
                margin: 30px 0;
            "></div>

            <!-- Main Note -->
            <div style="
                font-size: 18px;
                line-height: 1.8;
                text-align: justify;
                margin: 40px 0;
                color: #1a1a1a;
                white-space: pre-wrap;
                word-wrap: break-word;
                font-weight: 400;
            ">${note}</div>

            <!-- Divider -->
            <div style="
                border-top: 3px solid #e0e0e0;
                margin: 30px 0;
            "></div>

            <!-- Signature -->
            <div style="text-align: center; margin-top: 40px;">
                <p style="
                    font-size: 16px;
                    font-style: italic;
                    margin: 0 0 15px 0;
                    color: #333333;
                    font-weight: 500;
                ">With Love ♥</p>
                <p style="
                    font-size: 18px;
                    margin: 0;
                    color: #333333;
                    font-weight: 600;
                ">Dhanan :)</p>
            </div>
        </div>
    `;

    // Append to body
    document.body.appendChild(container);

    // Wait for next frame to ensure rendering
    requestAnimationFrame(() => {
        const contentElement = container.querySelector('#pdf-content') as HTMLElement;

        // Configure html2pdf options
        const options = {
            margin: 0,
            filename: `cheerify_${username}_${Date.now()}.pdf`,
            image: {
                type: 'jpeg' as const,
                quality: 0.99
            },
            html2canvas: {
                scale: 2,
                useCORS: true,
                letterRendering: true,
                logging: false,
                backgroundColor: '#ffffff',
                width: 600,
                windowWidth: 600
            },
            jsPDF: {
                unit: 'pt' as const,
                format: 'a4' as const,
                orientation: 'portrait' as const,
                compress: true
            },
            pagebreak: {
                mode: ['avoid-all', 'css', 'legacy'] as any
            }
        };

        // Generate PDF
        html2pdf()
            .set(options)
            .from(contentElement)
            .save()
            .then(() => {
                // Clean up
                if (document.body.contains(container)) {
                    document.body.removeChild(container);
                }
            })
            .catch((error: Error) => {
                console.error('Error generating PDF:', error);
                // Clean up on error
                if (document.body.contains(container)) {
                    document.body.removeChild(container);
                }
                alert('Failed to generate PDF. Please try again.');
            });
    });
}
