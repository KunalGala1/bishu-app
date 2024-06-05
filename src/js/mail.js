import { toastNotification } from "./utils.js";

// Temporary - to stop form from sending
document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const contactFormData = new FormData(event.target);

      // Form Validation
      let contactFormObject = {}; // convert to object
      for (let [key, value] of contactFormData.entries()) {
        contactFormObject[key] = value;
      }

      // Check if any field is empty
      const { name, email, subject } = contactFormObject;
      if (!name || !email || !subject) {
        toastNotification("Please fill in all fields", "danger", 5000);
        return;
      }

      // Check validity of email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regular expression for email validation
      if (!emailRegex.test(email)) {
        toastNotification("Please enter a valid email address", "danger", 5000);
        return;
      }

      // Check if Cloudflare turnstile was completed
      const cfTurnstileResponse = document.getElementsByClassName(
        "cf-turnstile-response"
      );
      if (!cfTurnstileResponse) {
        toastNotification(
          "Please complete the Cloudflare verification",
          "danger",
          5000
        );
        return;
      }

      // Hit siteverify endpoint to consume turnstile token and check validity
      const response = await fetch("/verify-turnstile-token", {
        method: "POST",
        body: contactFormData,
      });
      const result = await response.json();
      if (!response.ok) {
        toastNotification(
          "There was an error sending your email. Please try again later.",
          "error",
          5000
        );
      } else {
        toastNotification("Your email was sucessfully sent!", "success", 5000);
        contactForm.reset();
      }
    });
  }
});
