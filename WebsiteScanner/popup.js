chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {

    chrome.tabs.sendMessage(tabs[0].id, { action: "scan" }, (response) => {

        if (!response) {
            document.getElementById("verdict-box").innerText = "Unable to scan.";
            return;
        }

        document.getElementById("verdict-box").innerText = response.verdict;

        document.getElementById("findings").innerHTML =
            response.findings.length
                ? response.findings.map(f => `• ${f}`).join("<br>")
                : "No obvious threats detected.";
    });
});