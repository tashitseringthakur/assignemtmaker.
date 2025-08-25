//
// ─────────────────────────────────────────────────────────────────
//   █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █
//   █                                                               █
//   █ ▐████▌ ▐███▌ ▐████▌ ▐████▌ ▐███▌ ▐████▌     ▐████▌ ▐███▌ ▐████▌ █
//   █   ▐█▌    █     ▐█▌    ▐█▌    █   ▐█▌          ▐█▌    █   ▐█▌   █
//   █   ▐█▌    █     ▐█▌    ▐█▌    █   ▐█▌          ▐█▌    █   ▐█▌   █
//   █   ▐█▌    █     ▐█▌    ▐█▌    █   ▐█▌          ▐█▌    █   ▐█▌   █
//   █   ▐█▌    █     ▐█▌    ▐█▌    █   ▐█▌          ▐█▌    █   ▐█▌   █
//   █   ▐█▌    █     ▐█▌    ▐█▌    █   ▐█▌          ▐█▌    █   ▐█▌   █
//   █   ▐█▌    █     ▐█▌    ▐█▌    █   ▐█▌          ▐█▌    █   ▐█▌   █
//   █   ▐█▌    █     ▐█▌    ▐█▌    █   ▐█▌          ▐█▌    █   ▐█▌   █
//   █   ▐█▌    █     ▐█▌    ▐█▌    █   ▐█▌          ▐█▌    █   ▐█▌   █
//   █   ▐█▌    █     ▐█▌    ▐█▌    █   ▐█▌          ▐█▌    █   ▐█▌   █
//   █   ▐█▌    █     ▐█▌    ▐█▌    █   ▐█▌          ▐█▌    █   ▐█▌   █
//   █   ▐█▌    █     ▐█▌    ▐█▌    █   ▐█▌          ▐█▌    █   ▐█▌   █
//   █   ▐█▌    █     ▐█▌    ▐█▌    █   ▐█▌          ▐█▌    █   ▐█▌   █
//   █   ▐█▌    █     ▐█▌    ▐█▌    █   ▐█▌          ▐█▌    █   ▐█▌   █
//   █   ▐█▌    █     ▐█▌    ▐█▌    █   ▐█▌          ▐█▌    █   ▐█▌   █
//   █   ▐█▌    █     ▐█▌    ▐█▌    █   ▐█▌          ▐█▌    █   ▐█▌   █
//   █   ▐█▌    █     ▐█▌    ▐█▌    █   ▐█▌          ▐█▌    █   ▐█▌   █
//   █   ▐█▌    █     ▐█▌    ▐█▌    █   ▐█▌          ▐█▌    █   ▐█▌   █
//   █   ▐█▌    █     ▐█▌    ▐█▌    █   ▐█▌          ▐█▌    █   ▐█▌   █
//   █ ▐████▌   █   ▐████▌   ▐█▌    █   ▐████▌       ▐█▌    █   ▐████▌ █
//   █                                                               █
//   █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █
//
//

// ===================================================================
//
//  TABLE OF CONTENTS
//
//  1.  Page Management System
//  2.  Gemini AI Integration
//  3.  Core Content Conversion & Realism Engine
//  4.  Style & Customization Controls
//  5.  Drawing Canvas Functionality
//  6.  Image & PDF Generation
//  7.  UI & Utility Functions
//
// ===================================================================


// -------------------------------------------------------------------
// 1. PAGE MANAGEMENT SYSTEM
// -------------------------------------------------------------------

let currentQuill = null;
let quillContents = ["", ""]; // content for page 0 (template) and 1 (initial page)

const originalPage = document.getElementById("final_page");
const pages = [originalPage, originalPage.cloneNode(true)]; // Store page DOM nodes

let currentPageIndex = 1;

/**
 * Creates a new blank page by cloning the original template.
 * @returns {HTMLElement} The new page element.
 */
function createNewPageInternal() {
    pages.push(pages[0].cloneNode(true));
    quillContents.push(""); // Add empty content slot for the new page
    console.log("New page created. Total pages: " + (pages.length - 1));
    return pages[pages.length - 1];
}

/**
 * Displays a specific page by its index.
 * @param {number} index - The index of the page to show.
 * @param {boolean} [skipSave=false] - If true, skips saving the current page's content.
 */
function showPage(index, skipSave = false) {
    if (!skipSave && currentQuill) {
        quillContents[currentPageIndex] = currentQuill.root.innerHTML;
    }

    const container = document.getElementById("outer-container");
    container.innerHTML = "";
    container.appendChild(pages[index]);

    currentPageIndex = index;

    const savedContent = quillContents[index] || "";
    currentQuill.root.innerHTML = savedContent;

    document.getElementById("pageNumber").innerText = `Page ${index}/${pages.length - 1}`;
}

/**
 * Initializes the Quill editor.
 */
function initQuill() {
    currentQuill = new Quill('#mixed-input', {
        modules: {
            syntax: true,
            toolbar: '#toolbar-container',
        },
        placeholder: 'Type or paste your content here. For long text, use the "Auto-Generate Pages" button.',
        theme: 'snow',
    });

    currentQuill.on('text-change', () => {
        convertToHTML();
    });

    quillContents[1] = currentQuill.root.innerHTML;
}

// --- User-facing Page Controls ---

function creatNewPage() {
    createNewPageInternal();
    showPage(pages.length - 1);
}

function deleteCurrentPage() {
    if (pages.length <= 2) {
        alert("At least one page must remain.");
        return;
    }

    pages.splice(currentPageIndex, 1);
    quillContents.splice(currentPageIndex, 1);

    if (currentPageIndex >= pages.length) {
        currentPageIndex = pages.length - 1;
    }

    showPage(currentPageIndex, true);
}

function nextPage() {
    const nextIndex = currentPageIndex + 1;
    if (nextIndex < pages.length) {
        showPage(nextIndex);
    }
}

function prevPage() {
    if (currentPageIndex > 1) {
        showPage(currentPageIndex - 1);
    }
}


// -------------------------------------------------------------------
// 2. GEMINI AI INTEGRATION
// -------------------------------------------------------------------

/**
 * Sends questions to the Gemini API via a server-side proxy.
 */
async function solveWithGemini() {
    const questions = document.getElementById('gemini-questions-input').value;
    if (!questions.trim()) {
        alert('Please enter your assignment questions first.');
        return;
    }

    const loader = document.getElementById('gemini-loader');
    loader.style.display = 'block';

    const prompt = `
        You are an AI assistant helping a student create a handwritten assignment. 
        Your task is to solve the following questions and provide the answers in a specific format.
        
        **CRITICAL INSTRUCTIONS FOR MATHEMATICS:**
        - When writing mathematical expressions, you MUST use symbols appropriate for handwriting.
        - For multiplication, use the '×' symbol, NOT '*'.
        - For division, use the '÷' symbol, NOT '/'.
        - For exponents, use superscripts (e.g., x², 10⁵), NOT the '^' symbol (e.g., x^2, 10^5).
        - For fractions, write them out clearly, for example: 'the fraction 3 over 4'.

        **DIAGRAMS:**
        - If a question or answer requires a diagram, DO NOT try to draw it with text or ASCII art.
        - Instead, insert a special placeholder tag on its own line like this: [DIAGRAM HERE: A brief, clear description of the required diagram]

        **OUTPUT FORMATTING:**
        - Format the final answer strictly as shown in this example, with each part on a new line:
        
        question no 1.
        [The original question here]
        :sol.
        [The detailed, handwritten-style solution here]

        question no 2.
        [The next question here]
        :sol.
        [The solution here]

        ---
        Here are the questions to solve:
        ${questions}
    `;

    // IMPORTANT: Replace this placeholder with the actual URL of your deployed Replit server.
    const yourServerUrl = 'https://replit.com/@ErroneousBoy/ZestyMistyCoderesource'; // <-- CHANGE THIS

    try {
        const response = await fetch(yourServerUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: prompt })
        });

        if (!response.ok) {
            throw new Error(`Server request failed with status ${response.status}`);
        }

        const result = await response.json();

        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {

            const solutionText = result.candidates[0].content.parts[0].text;
            currentQuill.setContents([{ insert: solutionText }]);
        } else {
            throw new Error("Invalid response structure from server.");
        }

    } catch (error) {
        console.error("Error communicating with server:", error);
        alert("An error occurred while trying to solve the questions. Please check the console for details.");
    } finally {
        loader.style.display = 'none';
    }
}


// -------------------------------------------------------------------
// 3. CORE CONTENT CONVERSION & REALISM ENGINE
// -------------------------------------------------------------------

let isDrawingBeingAdded = false;

/**
 * Converts Quill editor content to styled HTML for the output page.
 * Applies realistic imperfections and diagram placeholders.
 */
function convertToHTML() {
    if (isDrawingBeingAdded) return;

    const mixedInputHTML = document.querySelector('.ql-editor').innerHTML;
    const outputContainer = document.getElementById('output-inner-container');
    const applyImperfections = document.getElementById('realistic-imperfections').checked;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = mixedInputHTML;

    let finalHTML = '';

    if (applyImperfections) {
        finalHTML = processNodeForImperfections(tempDiv);
    } else {
        finalHTML = tempDiv.innerHTML;
    }

    // Find and replace diagram placeholders with styled divs
    const diagramRegex = /\[DIAGRAM HERE: (.*?)\]/g;
    finalHTML = finalHTML.replace(diagramRegex, (match, description) => {
        return `<div class="diagram-placeholder"><strong>Diagram Needed:</strong><br>${description}</div>`;
    });

    outputContainer.innerHTML = finalHTML;
}

/**
 * Recursively processes DOM nodes to apply imperfections to text nodes.
 * @param {Node} node - The current DOM node to process.
 * @returns {string} The HTML string with imperfections applied.
 */
function processNodeForImperfections(node) {
    let html = '';
    node.childNodes.forEach(child => {
        if (child.nodeType === Node.TEXT_NODE) {
            html += child.textContent.split('').map(char => {
                if (char.trim() === '') return char;
                const rotation = (Math.random() - 0.5) * 1.5;
                const yOffset = (Math.random() - 0.5) * 2;
                const spacing = Math.random() * 0.5;
                return `<span style="display:inline-block; transform: rotate(${rotation}deg) translateY(${yOffset}px); letter-spacing: ${spacing}px;">${char}</span>`;
            }).join('');
        } else if (child.nodeType === Node.ELEMENT_NODE) {
            const outerHTML = child.cloneNode(false).outerHTML;
            const innerHTML = processNodeForImperfections(child);
            html += outerHTML.replace(/<\/[^>]+>$/, innerHTML + `</${child.tagName}>`);
        }
    });
    return html;
}



// -------------------------------------------------------------------
// 4. STYLE & CUSTOMIZATION CONTROLS
// -------------------------------------------------------------------

function setCSSVariable(variable, value) {
    document.documentElement.style.setProperty(`--${variable}`, value);
}

document.addEventListener('input', function (event) {
    const target = event.target;
    const valueDisplay = document.getElementById(target.id + '-value');
    if (valueDisplay) {
        valueDisplay.textContent = target.value + (target.dataset.unit || '');
    }

    const cssVar = target.dataset.variable;
    if (cssVar) {
        setCSSVariable(cssVar, target.value + (target.dataset.unit || ''));
    }
});


function changeFontFamily() {
    const select = document.getElementById('font-family-select');
    const font = select.value;
    setCSSVariable('main-font', font);
}

function toggleLeftMargin() {
    const isChecked = document.getElementById('toggle-left-margin').checked;
    setCSSVariable('left-margin-display', isChecked ? 'flex' : 'none');
}

function toggleTopMargin() {
    const isChecked = document.getElementById('toggle-top-margin').checked;
    setCSSVariable('top-margin-display', isChecked ? 'flex' : 'none');
}

function toggleLeftBorder() {
    const isChecked = document.getElementById('toggle-left-border').checked;
    const borderStyle = isChecked ? '2px solid #00000066' : 'none';
    setCSSVariable('output-left-border', borderStyle);
    setCSSVariable('top-margin-left-border', borderStyle);
}

function toggleTopBorder() {
    const isChecked = document.getElementById('toggle-top-border').checked;
    const borderStyle = isChecked ? '1px solid #00000066' : 'none';
    setCSSVariable('top-margin-bottom-border', borderStyle);
    setCSSVariable('subbox-bottom-border', borderStyle);
}

function toggleBackground() {
    const isChecked = document.getElementById('bg-toggle').checked;
    const bgValue = isChecked ? 'linear-gradient(#00000066 0.05em, transparent 0.1em)' : 'none';
    setCSSVariable('background-lines', bgValue);
}

function Shadow() {
    const isChecked = document.getElementById('shadow').checked;
    const shadowValue = isChecked ? 'linear-gradient(-75deg, rgb(0 0 0 / 40%), rgb(0 0 0 / 0%))' : 'none';
    setCSSVariable('heading-shadow', shadowValue);
}

function changeBackgroundImage() {
    var input = document.getElementById('background-image-input');
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            setCSSVariable('custom-background-image', `url('${e.target.result}')`);
            document.getElementById('remove-button').style.display = 'inline-block';
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function removeBackgroundImage() {
    setCSSVariable('custom-background-image', 'none');
    document.getElementById('background-image-input').value = '';
    document.getElementById('remove-button').style.display = 'none';
}


// -------------------------------------------------------------------
// 5. DRAWING CANVAS FUNCTIONALITY
// -------------------------------------------------------------------
// NOTE: The full drawing canvas code from your original file should be placed here.
// It is omitted for brevity in this summary view but is required for functionality.



// -------------------------------------------------------------------
// 6. IMAGE & PDF GENERATION
// -------------------------------------------------------------------
let quality = 2.0;

function changeQuality() {
    quality = parseFloat(document.getElementById('quality-input').value) || 2.0;
}

function handleDownload(value) {
    if (value === "image") {
        downloadCurrentPageImage();
    } else if (value === "pdf") {
        generatePDFfromPages();
    }
    document.getElementById('download_options').value = '';
}

async function generatePDFfromPages() {
    const loader = document.getElementById('pdf-loader');
    loader.style.display = 'flex';

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4'
    });

    const originalPageIndex = currentPageIndex;

    for (let i = 1; i < pages.length; i++) {
        showPage(i, true);
        await new Promise(resolve => setTimeout(resolve, 100));

        const canvas = await html2canvas(document.getElementById('shadow-effect'), { scale: quality });
        const imgData = canvas.toDataURL('image/png');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        if (i > 1) {
            pdf.addPage();
        }
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    }

    pdf.save('handwritten_document.pdf');
    showPage(originalPageIndex, true);
    loader.style.display = 'none';
}

function downloadCurrentPageImage() {
    const loader = document.getElementById('loader');
    loader.style.display = 'block';
    html2canvas(document.getElementById('shadow-effect'), { scale: quality }).then(canvas => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `page_${currentPageIndex}.png`;
        link.click();
        loader.style.display = 'none';
    });
}


// -------------------------------------------------------------------
// 7. UI & UTILITY FUNCTIONS
// -------------------------------------------------------------------

function toggleNav() {
    const navList = document.querySelector('nav ul');
    navList.style.display = navList.style.display === 'flex' ? 'none' : 'flex';
}

// --- Initializations and Event Listeners ---

document.addEventListener('DOMContentLoaded', () => {
    initQuill();
    showPage(1, true);

    document.getElementById('solve-with-gemini-btn').addEventListener('click', solveWithGemini);
    document.getElementById('auto-generate-pages-btn').addEventListener('click', autoGeneratePages);
});


/**
 * Automatically splits the content from the editor into multiple pages.
 */
async function autoGeneratePages() {
    const loader = document.getElementById('loader');
    loader.style.display = 'block';

    const measureContainer = document.createElement('div');
    measureContainer.style.position = 'absolute';
    measureContainer.style.left = '-9999px';
    measureContainer.style.visibility = 'hidden';
    measureContainer.style.width = originalPage.clientWidth + 'px';
    measureContainer.style.height = originalPage.clientHeight + 'px';

    const measureContent = document.createElement('div');
    measureContent.className = 'ql-editor';
    measureContainer.appendChild(measureContent);
    document.body.appendChild(measureContainer);

    const fullContent = currentQuill.getContents();

    pages.splice(1);
    quillContents.splice(1);

    let currentPageContent = new Quill(document.createElement('div')).getContents();

    for (const op of fullContent.ops) {
        const tempQuill = new Quill(document.createElement('div'));
        tempQuill.setContents(currentPageContent);
        tempQuill.updateContents({ ops: [op] });

        measureContent.innerHTML = tempQuill.root.innerHTML;

        if (measureContent.scrollHeight > measureContainer.clientHeight) {
            quillContents.push(currentPageContent);
            createNewPageInternal();
            currentPageContent = new Quill(document.createElement('div')).getContents();
            currentPageContent = currentPageContent.compose({ ops: [op] });
        } else {
            currentPageContent = currentPageContent.compose({ ops: [op] });
        }
    }

    quillContents.push(currentPageContent);
    createNewPageInternal();
    pages.pop();

    document.body.removeChild(measureContainer);

    showPage(1, true);
    loader.style.display = 'none';
    alert(`Content has been split into ${pages.length - 1} pages.`);
}
