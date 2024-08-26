/*
    {
    method:"POST",
    headers: {
        "Content-Type":"application/json",

    },
    body: JSON.stringify(data),
}
*/
const serverApi = "http://localhost:3000";
const getUsers = async () => {
  try {
    const response = await fetch(`${serverApi}/users`);
    if (!response.ok) {
      throw new Error("Fetch to failed");
    }
    const users = await response.json();
    render(users);
  } catch (e) {
    console.log(e);
  }
};
// addUser .1
const addUer = async (data) => {
  try {
    const response = await fetch(`${serverApi}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.ok;
  } catch {
    return false;
  }
};
// addUer({
//   name: "user 4",
//   email: "gmail.com",
//   status: "active",
// });
const render = (users) => {
  const tbody = document.querySelector("table tbody");
  tbody.innerHTML = `${users
    .map(({ id, name, email, status }, index) => {
      return `
     <tr>
            <td>${index + 1}</td>
            <td>${name}</td>
            <td>${email}</td>
            <td><span class="badge bg-${
              status === "active" ? "success" : "warning"
            }">${
        status === "active" ? "kích hoạt" : "chưa kích hoạt"
      } </span></td>
            <td><button class="btn btn-warning">Sửa</button></td>
            <td><button class="btn btn-danger">Xóa</button></td>
          </tr>
    `;
    })
    .join("")}`;
};
// handleAddUser .2
const handleAddUser = () => {
  const form = document.querySelector(".form-update");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(form));
    console.log(formData);
    // async phải chuyển cái gần nhất là form.addEvent
    const status = await addUer(formData);
    if (status) {
      // thêm thành công
      getUsers();
      form.reset();
    }
  });
};
handleAddUser();
getUsers();
