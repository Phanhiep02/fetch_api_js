/*
    {
    method:"POST"
    headers: {
        "Content-Type":"application/json",

    },
    body: JSON.stringify(data),
}
*/
const sererApi = "http://localhost:3000";
const getUsers = async () => {
  try {
    const response = await fetch(`${sererApi}/users`);
    if (!response.ok) {
      throw new Error("Fetch to failed");
    }
    const users = await response.json();
    render(users);
  } catch (e) {
    console.log(e);
  }
};
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
getUsers();
