chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

    if (changeInfo.status !== "complete" || !tab.url) return;

    chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: scanPage
    });
});

function scanPage() {

    let risk = 0;
    let findings = [];
    let reasons = [];

    const links = document.querySelectorAll("a").length;
    const forms = document.querySelectorAll("form").length;
    const scripts = document.querySelectorAll("script").length;
    const passwordFields = document.querySelectorAll("input[type='password']").length;

    const pageText = document.body.innerText.toLowerCase();

    const phishingSignals = [
        "verify your account",
        "confirm password",
        "login to continue",
        "security alert",
        "unusual activity"
    ];

    phishingSignals.forEach(signal => {
        if (pageText.includes(signal)) {
            risk += 2;
            findings.push("Phishing language detected");
            reasons.push("Uses social engineering phrases.");
        }
    });

    if (passwordFields > 0) {
        risk += 2;
        findings.push("Password field detected");
        reasons.push("Requests sensitive credentials.");
    }

    if (scripts > 25) {
        risk += 1;
        findings.push("Heavy script activity");
        reasons.push("Large script count detected.");
    }

    if (forms > 3) {
        risk += 1;
        findings.push("Multiple forms");
        reasons.push("Potential data collection patterns.");
    }

    if (risk === 0) {
        reasons.push("No suspicious patterns detected.");
    }

    const grade = calculateGrade(risk);

    const result = {
        url: location.href,
        risk,
        grade,
        findings,
        reasons,
        stats: { links, forms, scripts },
        time: Date.now()
    };

    chrome.storage.local.set({ scanData: result });

    storeHistory(result);

    chrome.action.setBadgeText({ text: risk.toString() });
}

function calculateGrade(risk) {
    if (risk === 0) return "A";
    if (risk <= 2) return "B";
    if (risk <= 4) return "C";
    if (risk <= 6) return "D";
    return "F";
}

function storeHistory(result) {

    chrome.storage.local.get("history", (data) => {

        let history = data.history || [];

        history.unshift(result);

        history = history.slice(0, 20); // Keep last 20 scans

        chrome.storage.local.set({ history });
    });
}