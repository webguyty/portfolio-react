export default function sendEmail(e) {
  e.preventDefault();
  const name = document.getElementById("form_name"),
    email = document.getElementById("form_email"),
    phone = document.getElementById("form_phone"),
    message = document.getElementById("form_message"),
    success = document.getElementById("form_success"),
    fail = document.getElementById("form_fail");

  console.log(name, email, phone, message);

  fetch("https://ujsa21iwz0.execute-api.us-west-2.amazonaws.com/sendEmail", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name.value,
      email: email.value,
      phone: phone.value,
      message: message.value,
    }),
  })
    .then((res) => {
      if (!res.ok) {
        throw Error(res.statusText);
      }
      return res.json();
    })
    .then((data) => {
      success.style.display = "block";
      name.value = "";
      email.value = "";
      phone.value = "";
      message.value = "";
    })
    .catch((error) => {
      fail.style.display = "block";
      console.log(error);
    });

  setTimeout(() => {
    success.style.display = "none";
    fail.style.display = "none";
  }, 5000);
}
