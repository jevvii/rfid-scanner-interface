document.addEventListener("DOMContentLoaded", () => {
    const socket = new WebSocket(
        "wss://" + window.location.host + "/ws/rfid/status/",
    );

    let scanStatus = "idle";
    let currentStep = 0;
    const pulseRings = document.getElementById("pulseRings");
    const mainIcon = document.getElementById("mainIcon");
    const cardIcon = document.getElementById("cardIcon");
    const radioIcon = document.getElementById("radioIcon");
    const checkIcon = document.getElementById("checkIcon");
    const errorIcon = document.getElementById("errorIcon");
    const clockIcon = document.getElementById("clockIcon");
    const logoutIcon = document.getElementById("logoutIcon");
    const calendarCheckIcon = document.getElementById("calendarCheckIcon");
    const statusMessage = document.getElementById("statusMessage");

    function setStatus(status, timeRemaining = 0) {
        scanStatus = status;

        // Hide all icons
        cardIcon.classList.add("hidden");
        radioIcon.classList.add("hidden");
        checkIcon.classList.add("hidden");
        errorIcon.classList.add("hidden");
        clockIcon.classList.add("hidden");
        logoutIcon.classList.add("hidden");
        calendarCheckIcon.classList.add("hidden");

        // Remove animations
        cardIcon.classList.remove(
            "scale-in",
            "rotate-animation",
            "scale-rotate-in",
            "shake",
        );
        radioIcon.classList.remove(
            "scale-in",
            "rotate-animation",
            "scale-rotate-in",
            "shake",
        );
        checkIcon.classList.remove(
            "scale-in",
            "rotate-animation",
            "scale-rotate-in",
            "shake",
        );
        errorIcon.classList.remove(
            "scale-in",
            "rotate-animation",
            "scale-rotate-in",
            "shake",
        );
        clockIcon.classList.remove(
            "scale-in",
            "rotate-animation",
            "scale-rotate-in",
            "shake",
        );
        logoutIcon.classList.remove(
            "scale-in",
            "rotate-animation",
            "scale-rotate-in",
            "shake",
        );
        calendarCheckIcon.classList.remove(
            "scale-in",
            "rotate-animation",
            "scale-rotate-in",
            "shake",
        );

        switch (status) {
            case "idle":
                mainIcon.className = "relative text-gray-400 transition-all";
                cardIcon.classList.remove("hidden");
                pulseRings.style.display = "block";
                statusMessage.textContent = "Ready to Scan";
                statusMessage.className = "mt-8 text-gray-400 fade-up";
                break;
            case "scanning":
                mainIcon.className = "relative text-red-600 transition-all";
                radioIcon.classList.remove("hidden");
                radioIcon.classList.add("rotate-animation");
                pulseRings.style.display = "none";
                statusMessage.textContent = "Scanning...";
                statusMessage.className = "mt-8 text-red-600 fade-up";
                break;
            case "success":
                mainIcon.className = "relative text-green-500 transition-all";
                checkIcon.classList.remove("hidden");
                checkIcon.classList.add("scale-in");
                pulseRings.style.display = "none";
                statusMessage.textContent = "Logged In Successfully!";
                statusMessage.className = "mt-8 text-green-500 fade-up";
                break;
            case "logout-success":
                mainIcon.className = "relative text-green-500 transition-all";
                logoutIcon.classList.remove("hidden");
                logoutIcon.classList.add("scale-rotate-in");
                pulseRings.style.display = "none";
                statusMessage.textContent = "Logged Out Successfully!";
                statusMessage.className = "mt-8 text-green-500 fade-up";
                break;
            case "attendance-complete":
                mainIcon.className = "relative text-blue-500 transition-all";
                calendarCheckIcon.classList.remove("hidden");
                calendarCheckIcon.classList.add("scale-in");
                pulseRings.style.display = "none";
                statusMessage.textContent = "Attendance Complete for Today";
                statusMessage.className = "mt-8 text-blue-500 fade-up";
                break;
            case "cooldown":
                mainIcon.className = "relative text-red-700 transition-all";
                clockIcon.classList.remove("hidden");
                clockIcon.classList.add("shake");
                pulseRings.style.display = "none";
                statusMessage.textContent = `Please wait ${timeRemaining}s to logout`;
                statusMessage.className = "mt-8 text-red-700 fade-up";
                break;
            case "error":
                mainIcon.className = "relative text-red-500 transition-all";
                errorIcon.classList.remove("hidden");
                errorIcon.classList.add("scale-in");
                pulseRings.style.display = "none";
                statusMessage.textContent = "Scan Failed";
                statusMessage.className = "mt-8 text-red-500 fade-up";
                break;
        }
    }

    function setStep(step) {
        currentStep = step;

        for (let i = 0; i < 3; i++) {
            const stepCard = document.getElementById(`step${i}`);
            const icon = document.getElementById(`icon${i}`);
            const stepDesc = document.getElementById(`stepDesc${i}`);
            const indicator = document.getElementById(`indicator${i}`);
            const arrow = document.getElementById(`arrow${i}`);

            const isActive = step >= i;
            const isCurrent = step === i;

            if (isActive) {
                stepCard.className =
                    "card p-6 transition-all text-white step-card";
                stepCard.style.backgroundColor = "#800000";
                stepCard.style.borderColor = "#600000";
                stepDesc.className = "text-sm";
                stepDesc.style.opacity = "0.8";
                indicator.className = "w-2 h-2 rounded-full bg-white";
                if (arrow) {
                    arrow.className = "mx-2 icon-arrow";
                    arrow.style.color = "#800000";
                }
            } else {
                stepCard.className =
                    "card p-6 transition-all bg-white text-gray-400 border-gray-200 step-card";
                stepCard.style.backgroundColor = "";
                stepCard.style.borderColor = "";
                stepDesc.className = "text-sm text-gray-400";
                stepDesc.style.opacity = "";
                indicator.className = "w-2 h-2 rounded-full bg-gray-300";
                if (arrow) {
                    arrow.className = "mx-2 text-gray-300 icon-arrow";
                    arrow.style.color = "";
                }
            }

            if (isCurrent) {
                icon.classList.add("bounce-scale");
                indicator.classList.add("blink");
            } else {
                icon.classList.remove("bounce-scale");
                indicator.classList.remove("blink");
            }
        }
    }

    function handleScan() {
        if (scanStatus !== "idle") return;

        // Start scanning
        setStatus("scanning");
        setStep(1);

        // Move to step 2
        setTimeout(() => {
            setStep(2);

            // Show success
            setTimeout(() => {
                setStatus("success");
                setStep(2);

                // Reset
                setTimeout(() => {
                    setStatus("idle");
                    setStep(0);
                }, 2000);
            }, 1500);
        }, 1000);
        return;
    }

    function handleInvalidScan() {
        if (scanStatus !== "idle" && scanStatus !== "scanning") return;

        // Show error feedback
        setStatus("error");
        setStep(3);

        // Reset after a short delay
        setTimeout(() => {
            setStatus("idle");
            setStep(1);
        }, 2000);
        return;
    }

    function handleCooldownScan(remaining) {
        if (scanStatus !== "idle" && scanStatus !== "scanning") return;

        setStatus("cooldown", remaining);
        setStep(3);

        // Reset after showing error
        setTimeout(() => {
            setStatus("idle");
            setStep(0);
        }, 2000);
        return;
    }

    function handleLogoutScan() {
        if (scanStatus !== "idle" && scanStatus !== "scanning") return;

        // Start scanning
        setStatus("logout-success");
        setStep(3);

        // Reset
        setTimeout(() => {
            setStatus("idle");
            setStep(0);
        }, 2000);
    }

    function handleDoneScan() {
        if (scanStatus !== "idle" && scanStatus !== "scanning") return;

        // Start scanning
        setStatus("scanning");
        setStep(1);

        // Move to step 2
        setTimeout(() => {
            setStep(2);

            // Show success
            setTimeout(() => {
                setStatus("attendance-complete");
                setStep(2);

                // Reset
                setTimeout(() => {
                    setStatus("idle");
                    setStep(0);
                }, 2000);
            }, 1500);
        }, 1000);
        return;
    }

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("WS Event:", data);

        const msg = data.message?.toLowerCase();
        const timeValue = parseFloat(data.time || 0);

        switch (msg) {
            case "unknown":
                handleInvalidScan();
                break;

            case "cooldown":
                // Use backend time value if available (e.g., 125.5 seconds)
                const remaining = Math.ceil(timeValue);
                handleCooldownScan(remaining);
                break;

            case "logout":
                handleLogoutScan();
                break;

            case "done":
            case "complete":
                handleDoneScan();
                break;

            default:
                // Treat everything else (like a valid student name) as a valid scan
                handleScan();
                break;
        }
    };

    // Initialize
    setStatus("idle");
    setStep(0);
});
