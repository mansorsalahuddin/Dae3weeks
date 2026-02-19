const statusText = document.getElementById("status");
const progressBar = document.getElementById("progress-bar");
const meterFill = document.getElementById("meter-fill");
const riskScoreText = document.getElementById("risk-score");
const warningsText = document.getElementById("warnings");

function startScan() {

    const url = document.getElementById("urlInput").value;

    if (!url) {
        statusText.textContent = "Enter a URL first";
        return;
    }

    warningsText.innerHTML = "";
    riskScoreText.textContent = "";
    meterFill.style.width = "0%";

    fakeScanAnimation(url);
}

function fakeScanAnimation(url) {

    statusText.textContent = "Scanning...";
    progressBar.style.width = "0%";

    let progress = 0;

    const interval = setInterval(() => {

        progress += 10;
        progressBar.style.width = progress + "%";

        if (progress >= 100) {
            clearInterval(interval);
            analyzeWebsite(url);
        }

    }, 200);
}

// Simulated API-style async scan 😏
async function analyzeWebsite(url) {

    statusText.textContent = "Analyzing Security Signals...";

    await delay(800);

    let warnings = [];
    let riskScore = 0;

    if (!url.startsWith("https://")) {
        warnings.push("⚠ Not using HTTPS");
        riskScore += 25;
    }

    const suspiciousWords = ["login", "verify", "bank", "secure", "free"];

    suspiciousWords.forEach(word => {
        if (url.toLowerCase().includes(word)) {
            warnings.push("⚠ Suspicious keyword: " + word);
            riskScore += 15;
        }
    });

    const dotCount = (url.match(/\./g) || []).length;

    if (dotCount > 3) {
        warnings.push("⚠ Unusual domain structure");
        riskScore += 20;
    }

    riskScore = Math.min(riskScore, 100);

    displayResults(riskScore, warnings);
}

function displayResults(score, warnings) {

    statusText.textContent = "Scan Complete";

    riskScoreText.textContent = "Risk Score: " + score + "%";

    meterFill.style.width = score + "%";

    if (score < 30) {
        meterFill.style.background = "#22c55e"; // green
    } else if (score < 70) {
        meterFill.style.background = "#facc15"; // yellow
    } else {
        meterFill.style.background = "#ef4444"; // red
    }

    if (warnings.length === 0) {
        warningsText.innerHTML = "✅ Website appears SAFE";
    } else {
        warningsText.innerHTML = warnings.join("<br>");
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
