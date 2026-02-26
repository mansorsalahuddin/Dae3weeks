function analyzePage() {

    let risk = 0;
    let findings = [];

    const text = document.body.innerText.toLowerCase();

    if (text.includes("password")) {
        risk++;
        findings.push("Suspicious password request detected");
    }

    if (text.includes("credit card")) {
        risk++;
        findings.push("Payment / credit card fields detected");
    }

    if (document.querySelectorAll("script[src]").length > 25) {
        risk++;
        findings.push("Large number of external scripts");
    }

    return {
        verdict: risk === 0 ? "✅ Site Appears Safe" : "⚠️ Potential Risks Found",
        findings
    };
}

/* AUTO SCANNER PANEL */

window.addEventListener("load", () => {

    const result = analyzePage();

    const logoURL = chrome.runtime.getURL("icons/icon48.png");

    const panel = document.createElement("div");
    panel.id = "clicktpy-panel";

    panel.innerHTML = `
        <div class="scanner-header">
            <img src="${logoURL}">
            <span>ClickTPY Scanner</span>
        </div>
        <div class="scanner-verdict">${result.verdict}</div>
    `;

    document.body.appendChild(panel);
});

/* POPUP COMMUNICATION */

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    if (request.action === "scan") {
        sendResponse(analyzePage());
    }
});