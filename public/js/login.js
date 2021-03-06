let submitForm = e => {
    e.preventDefault();
    fetch("/api/auth/connect", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => {
        return res.json();
    }).then(data => {
        if (data.redirect_url) {
            window.location.href = data.redirect_url;
        }
    });
};