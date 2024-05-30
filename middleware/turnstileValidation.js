const SECRET_KEY = "0x4AAAAAAAbiMJwLiEasYLFLuL-ZiGvdGmk";

async function handlePost(request) {
  const body = await request.formData();
  // Turnstile injects a token in "cf-turnstile-response".
  const token = body.get("cf-turnstile-response");
  const ip = request.headers.get("CF-Connecting-IP");

  // Validate the token by calling the "/siteverify" API.
  let formData = new FormData();
  formData.append("secret", SECRET_KEY);
  formData.append("response", token);
  formData.append("remoteip", ip);

  const result = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      body: formData,
      method: "POST",
    }
  );

  const outcome = await result.json();
  if (!outcome.success) {
    return new Response(
      "The provided Turnstile token was not valid! \n" + JSON.stringify(outcome)
    );
  }
  // The Turnstile token was successfuly validated. Proceed with your application logic.
  // Validate login, redirect user, etc.
  // For this demo, we just echo the "/siteverify" response:
  return new Response(
    "Turnstile token successfuly validated. \n" + JSON.stringify(outcome)
  );
}

module.exports = {
  handlePost: async (req, res, next) => {
    if (req.method === "POST") {
      const response = await handlePost(req);
      res.status(response.status).send(await response.text());
    } else {
      next();
    }
  },
};
