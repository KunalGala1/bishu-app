import { toastNotification } from "./utils.js";

// Temporary - to stop form from sending
document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const contactFormData = new FormData(event.target);
      console.log(
        "🚀 ~ contactForm.addEventListener ~ contactFormData:",
        contactFormData
      );

      // Hit siteverify endpoint to consume turnstile token and check validity
      const response = await fetch("/verify-turnstile-token", {
        method: "POST",
        body: contactFormData,
      });
      const result = await response.json();
      console.log("🚀 ~ contactForm.addEventListener ~ result:", result);
      return;

      // Validation
      const formData = new FormData(contactForm);
      let formObject = {};

      for (let [key, value] of formData.entries()) {
        formObject[key] = value;
      }

      const { name, email, subject } = formObject;

      // Regular expression for email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name || !email || !subject) {
        toastNotification(
          "All required fields must be filled out",
          "danger",
          5000
        );
        return false;
      } else if (!emailRegex.test(email)) {
        toastNotification("Please enter a valid email address", "danger", 5000);
        return false;
      } else if (auth.toLowerCase() !== "3" && auth.toLowerCase() !== "three") {
        toastNotification(
          "Security question was answered incorrectly",
          "danger",
          5000
        );
        return false;
      }
    });
  }
});

// document.addEventListener("DOMContentLoaded", () => {
//   return;
//   const contactForm = document.getElementById("contact-form");
//   if (contactForm) {
//     contactForm.addEventListener("submit", async (event) => {
//       event.preventDefault();

//       // Cloudflare turnstile
//     });
//   }

//   const forms = document.querySelectorAll(".contact-form");

//   forms.forEach((form) => {
//     form.addEventListener("submit", async (e) => {
//       // Made the event handler async
//       e.preventDefault();

//       const formData = new FormData(form);
//       let formObject = {};

//       for (let [key, value] of formData.entries()) {
//         formObject[key] = value;
//       }

//       const { name, email, subject } = formObject;

//       // Regular expression for email validation
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//       if (!name || !email || !subject) {
//         toastNotification(
//           "All required fields must be filled out",
//           "danger",
//           5000
//         );
//         return false;
//       } else if (!emailRegex.test(email)) {
//         toastNotification("Please enter a valid email address", "danger", 5000);
//         return false;
//       } else if (auth.toLowerCase() !== "3" && auth.toLowerCase() !== "three") {
//         toastNotification(
//           "Security question was answered incorrectly",
//           "danger",
//           5000
//         );
//         return false;
//       }

//       // If everything is filled out, send the POST request
//       try {
//         const response = await fetch("/mailsend", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(formObject),
//         });

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();
//         toastNotification(data.msg, "success", 5000);
//         form.reset();
//       } catch (error) {
//         console.error("There was a problem with the fetch operation:", error);
//         toastNotification(`Error: ${error.message}`, "danger", 5000);
//       }
//     });
//   });
// });
