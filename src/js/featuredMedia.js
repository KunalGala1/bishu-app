const featuredVideoForm = document.getElementById("featured-video-form");
featuredVideoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const featuredVideoId = featuredVideoForm.value;

  fetch("/dashboard/featured/video", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ featuredVideoId }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    })
    .catch((err) => console.log(err));
});
