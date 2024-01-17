import { toastNotification } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll(".contact-form");
  const lang = document.documentElement.lang;

  forms.forEach((form) => {
    form.addEventListener("submit", async (e) => {
      // Made the event handler async
      e.preventDefault();

      const formData = new FormData(form);
      let formObject = {};

      for (let [key, value] of formData.entries()) {
        formObject[key] = value;
      }

      const { name, email, subject, auth } = formObject;

      // Regular expression for email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name || !email || !subject || !auth) {
        toastNotification("All required fields must be filled out",
          "danger",
          5000
        );
        return false;
      } else if (!emailRegex.test(email)) {
        toastNotification("Please enter a valid email address",
          "danger",
          5000
        );
        return false;
      } else if (auth.toLowerCase() !== "3" && auth.toLowerCase() !== "three") {
        toastNotification("Security question was answered incorrectly", "danger", 5000);
        return false;
      }

      // If everything is filled out, send the POST request
      try {
        const response = await fetch("/mailsend", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formObject),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        toastNotification(data.msg, "success", 5000);
        form.reset();
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        toastNotification(`Error: ${error.message}`, "danger", 5000);
      }
    });
  });
});
