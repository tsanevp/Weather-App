const form = document.getElementById('contact-form');

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const objEntries = Object.fromEntries(formData);
    const name = objEntries.name;
    const email = objEntries.emailAddress;
    const message = objEntries.message;
    const contactData = { name, email, message };

    fetch('/contact.html', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData)
    }).then(response => response.json())
        .then(data => {
            clearForm();

            if (!data.complete) {
                displayErrorMsg();
                return;
            }

            displaySuccessMsg();
        })
        .catch(error => {
            console.log("There was an error fetching the weather results. "
                + "Examine the following error:\n" + error);
        });
});

function clearForm() {
    $("#name").text("");
    $("#email-address").text("");
    $("#message").text("");
}

function displayErrorMsg() {
    $("#submission-form").removeClass("middle-container");
    $("#submission-form").addClass("hidden");
    $("#error-msg").addClass("middle-container");
    $("#error-msg").removeClass("hidden");
};

function displaySuccessMsg() {
    $("#submission-form").removeClass("middle-container");
    $("#submission-form").addClass("hidden");
    $("#success-msg").addClass("middle-container");
    $("#success-msg").removeClass("hidden");
};