const serverApi = "http://localhost:3000";
import { debounce } from "./utils.js";

// fetch()
fetch(`${serverApi}/users`).then((response) => {
  // response.json() trả về dữ liệu từ server (điều kiện : dữ liệu trên server phải là json)
  // response.text() trả về dữ liệu gốc của server
  console.log(response);
  return response.json().then((data) => {
    console.log(data);
  });
});

// chuyển code trên thành async await
// mỗi một lần await là 1 lần then
const tbody = document.querySelector("tbody");

const getUser = async () => {
  const response = await fetch(`${serverApi}/users`);
  const users = await response.json();
  tbody.innerHTML = `${users
    .map(
      ({ name, email }, index) =>
        `  <tr>
  <td>${index + 1}</td>
  <td>${name}</td>
  <td>${email}</td>
</tr>`
    )
    .join("")}`;
};
getUser();

// get , post thêm , patch sửa , delete

// hàm gửi dữ liệu server
const addUser = async (data) => {
  const response = await fetch(`${serverApi}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  console.log(response);
  if (response.od) {
    getUser();
  }
};

// xử lí form
const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  //   const data = new FormData(e.target);
  const data = Object.fromEntries([...new FormData(e.target)]);
  console.log(data);
  addUser(data);
  form.reset();
});
