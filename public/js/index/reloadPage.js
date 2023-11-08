function startCountdown(minutes) {
    const countdownElement = document.getElementById('countdown');
    countdownElement.innerText = minutes;
    
    const countdownInterval = setInterval(() => {
        minutes--;
        countdownElement.innerText = minutes;
        
        if (minutes === 0) {
            clearInterval(countdownInterval);
            location.reload();
        }
    }, 60000); // 1 minute = 60,000 milliseconds
}

// Set the initial countdown time (30 minutes = 30)
startCountdown(14);
