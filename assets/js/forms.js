/* Set an HTTPS endpoint for each form type after configuring your provider. */
window.STACKLY_FORM_ENDPOINTS = window.STACKLY_FORM_ENDPOINTS || {
    booking: "",
    emergency: "",
    quote: "",
    newsletter: "",
};
const localDate = new Date();
const today = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, "0")}-${String(localDate.getDate()).padStart(2, "0")}`;
document.querySelectorAll('input[type="date"]').forEach((input) => {
    input.min = today;
});
function validateField(control) {
    let error = "";
    if (control.required && !control.value.trim()) error = "Please complete this field.";
    else if (control.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(control.value))
        error = "Enter a valid email address.";
    else if (control.type === "tel" && !/^\+?[\d\s().-]{7,25}$/.test(control.value))
        error = "Enter a phone number with 7–15 digits.";
    else if (
        control.type === "tel" &&
        (control.value.replace(/\D/g, "").length < 7 ||
            control.value.replace(/\D/g, "").length > 15)
    )
        error = "Enter a phone number with 7–15 digits.";
    else if (control.type === "date" && control.value < today)
        error = "Choose today or a future date.";
    control.setAttribute("aria-invalid", String(Boolean(error)));
    const message = control.closest(".field").querySelector(".field-error");
    if (message) {
        if (!message.id) message.id = `${control.id}-error`;
        control.setAttribute("aria-describedby", message.id);
        message.textContent = error;
    }
    return !error;
}
document.querySelectorAll("[data-form]").forEach((form) => {
    const controls = [...form.querySelectorAll("input, select, textarea")];
    controls.forEach((control) => {
        control.addEventListener("blur", () => {
            if (control.value || control.getAttribute("aria-invalid") === "true")
                validateField(control);
        });
        control.addEventListener("input", () => {
            if (control.getAttribute("aria-invalid") === "true") validateField(control);
        });
    });
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const validity = controls.map(validateField);
        const status = form.querySelector(".form-status");
        if (validity.includes(false)) {
            status.textContent = "Please correct the marked fields.";
            controls[validity.indexOf(false)].focus();
            return;
        }
        const endpoint = window.STACKLY_FORM_ENDPOINTS[form.dataset.form];
        if (!endpoint) {
            status.textContent =
                "Your details pass validation. Demo only: nothing has been sent or stored. Connect a submission endpoint to enable this form.";
            return;
        }
        const button = form.querySelector('button[type="submit"]');
        const original = button.innerHTML;
        button.disabled = true;
        button.textContent = "Sending…";
        status.textContent = "Sending your request…";
        try {
            const response = await fetch(endpoint, {
                method: "POST",
                body: new FormData(form),
                headers: { Accept: "application/json" },
            });
            if (!response.ok) throw new Error("Submission failed");
            status.textContent =
                form.dataset.form === "newsletter"
                    ? "Your email was sent to the connected notification service."
                    : "Your request was sent. An appointment is only confirmed when the service provider contacts you.";
            form.reset();
        } catch {
            status.textContent =
                "The request could not be sent. Please try again or contact the service provider directly.";
        } finally {
            button.disabled = false;
            button.innerHTML = original;
        }
    });
});
