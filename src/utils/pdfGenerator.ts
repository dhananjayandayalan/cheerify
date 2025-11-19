import html2pdf from 'html2pdf.js';

export function generatePDF(note: string, username: string) {
    // Create a temporary container for the PDF content
    const element = document.createElement('div');
    element.style.cssText = `
        position: absolute;
        left: -9999px;
        top: 0;
    `;

    // Create the HTML content with inline styles
    element.innerHTML = `
        <div style="
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            color: #000;
            padding: 50px 40px;
            max-width: 500px;
            background: #ffffff;
            box-sizing: border-box;
        ">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 35px;">
                <h1 style="
                    font-size: 36px;
                    font-weight: 700;
                    margin: 0 0 12px 0;
                    letter-spacing: -0.5px;
                    color: #000;
                ">Cheerify</h1>
                <p style="
                    font-size: 13px;
                    color: #666;
                    margin: 0;
                    font-weight: 500;
                ">For @${username}</p>
            </div>

            <!-- Divider -->
            <div style="
                border-top: 2px solid #e0e0e0;
                margin: 25px 0;
            "></div>

            <!-- Main Note -->
            <div style="
                font-size: 17px;
                line-height: 1.75;
                text-align: center;
                margin: 35px 0;
                color: #1a1a1a;
                white-space: pre-wrap;
                word-wrap: break-word;
                font-weight: 400;
            ">${note}</div>

            <!-- Divider -->
            <div style="
                border-top: 2px solid #e0e0e0;
                margin: 25px 0;
            "></div>

            <!-- Signature -->
            <div style="text-align: center; margin-top: 35px;">
                <p style="
                    font-size: 15px;
                    font-style: italic;
                    margin: 0 0 12px 0;
                    color: #333;
                    font-weight: 500;
                ">With Love</p>
                <p style="
                    font-size: 28px;
                    margin: 0 0 12px 0;
                    color: #e63946;
                ">♥</p>
                <p style="
                    font-size: 15px;
                    margin: 0;
                    color: #333;
                    font-weight: 500;
                ">Dhanan :)</p>
            </div>
        </div>
    `;

    // Append to body temporarily
    document.body.appendChild(element);

    // Get the actual content dimensions
    const contentElement = element.firstElementChild as HTMLElement;
    const contentHeight = contentElement.offsetHeight;
    const contentWidth = contentElement.offsetWidth;

    // Calculate PDF dimensions in mm (convert from px, assuming 96 DPI)
    const pxToMm = 0.264583;
    const pdfWidth = Math.max(contentWidth * pxToMm, 150); // Minimum 150mm width
    const pdfHeight = Math.max(contentHeight * pxToMm + 20, 200); // Add some padding, minimum 200mm

    // Configure html2pdf options for compact size
    const options = {
        margin: [10, 10, 10, 10] as [number, number, number, number], // Top, Right, Bottom, Left
        filename: `cheer_for_${username}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: {
            scale: 3, // Higher scale for better quality
            useCORS: true,
            letterRendering: true,
            logging: false
        },
        jsPDF: {
            unit: 'mm' as const,
            format: [pdfWidth, pdfHeight] as [number, number], // Custom size based on content
            orientation: 'portrait' as const,
            compress: true
        },
        pagebreak: { mode: 'avoid-all' }
    };

    // Generate PDF and clean up
    html2pdf()
        .set(options)
        .from(element)
        .save()
        .then(() => {
            document.body.removeChild(element);
        })
        .catch((error: Error) => {
            console.error('Error generating PDF:', error);
            if (document.body.contains(element)) {
                document.body.removeChild(element);
            }
        });
}
