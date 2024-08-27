/*
    {
    method:"POST",
    headers: {
        "Content-Type":"application/json",

    },
    body: JSON.stringify(data),
}
*/
// tạo element cho button cancel
const serverApi = "http://localhost:3000";
const cancelBtn = document.createElement("button");
cancelBtn.className = "btn btn-danger";
cancelBtn.innerText = "Hủy";
cancelBtn.type = "button";
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
const addUser = async (data) => {
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
// .5 update
const updateUer = async (id, data) => {
  try {
    const response = await fetch(`${serverApi}/users/${id}`, {
      method: "PUT",
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
const deleteUser = async (id) => {
  try {
    const response = await fetch(`${serverApi}/users/${id}`, {
      method: "DELETE",
    });
    return response.ok;
  } catch {
    return false;
  }
};
// sửa tương tự thêm , khác POST thành PATCH , url thêm id
// getUser .1
const getUser = async (id) => {
  try {
    const response = await fetch(`${serverApi}/users/${id}`);
    if (!response.ok) {
      throw new Error("fetch false");
    }
    return response.json();
  } catch {
    return false;
  }
};
// getUser(2);
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
            <td><button class="btn btn-warning" data-id="${id}" data-action="update">Sửa</button></td>
            <td><button class="btn btn-danger"data-id="${id}" data-action="delete">Xóa</button></td>
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
    // console.log(formData);
    // async phải chuyển cái gần nhất là form.addEvent
    const id = form.dataset.id;
    // đặt biến id nếu không phải là id thì nó sẽ là thêm
    // nếu là id thì nó sẽ là sửa
    if (!id) {
      const status = await addUser(formData);
      if (status) {
        // thêm thành công
        getUsers();
        form.reset();
      }
    } else {
      // .3update , lấy đc id , formData
      // console.log(id,formData);

      const status = await updateUer(id, formData);
      if (status) {
        getUsers();
        // trong hàm nãy sẽ phải xóa dataset đi

        switchFormAdd();
      }
    }
  });
};
// 4update .hàm reset để khi sửa xong thì về chữ thêm
const switchFormAdd = () => {
  const form = document.querySelector(".form-update");
  form.reset();
  const h2 = form.querySelector("h2");
  let btn = form.querySelector(".btn-primary");
  btn.innerText = "Thêm";
  h2.innerText = `Thêm người dùng`;
  delete form.dataset.id;
  cancelBtn.remove();
};
// .1update xử lí hàm update , lấy được ra các phần tử khi click vào sửa
const handleUpdateUser = () => {
  const tbody = document.querySelector("table tbody");
  tbody.addEventListener("click", async (e) => {
    const action = e.target.dataset.action;
    const id = e.target.dataset.id;
    if (action === "update") {
      // khi click vào sửa thì callAPI thì phải chuyển thành async
      const user = await getUser(id);
      //   console.log(user);
      if (!user) {
        alert("Đã có lỗi xảy ra");
        return;
      }
      changeFormUpdate(user);
    }
  });
};
// thay đổi formUpdate .2update
const changeFormUpdate = (user) => {
  const form = document.querySelector(".form-update");
  const h2 = form.querySelector("h2");
  let btn = form.querySelector(".btn-primary");
  btn.innerText = "Cập nhật";
  h2.innerText = `Cập nhật người dùng`;
  // để nhận biết đây là hành động sửa ta phải cho dataset vào form
  // không khi bấm lưu nó sẽ thành thêm
  // sau đó quay lại phần submitForm để sửa lại
  form.dataset.id = user.id;
  //   form có một mẹo dùng
  console.dir(form.elements.name);
  form.elements.name.value = user.name;
  form.elements.email.value = user.email;
  form.elements.status.value = user.status;
  // btn hủy
  form.append(cancelBtn);
};
// handle
const cancelUpdateForm = () => {
  cancelBtn.addEventListener("click", () => {
    switchFormAdd();
    // khi bấm hủy thì xóa cancel cho vào hàm switch
    // cancelBtn.remove();
  });
};
// handleDelete
const handleDeleteUer = () => {
  const tbody = document.querySelector("tbody");
  tbody.addEventListener("click", async (e) => {
    const { action, id } = e.target.dataset;
    if (action === "delete" && confirm("Chắc chưa ?")) {
      // call API
      const status = await deleteUser(id);
      if (!status) {
        alert("Đã có lỗi xảy ra");
      }
      getUsers();
    }
  });
};
cancelUpdateForm();
handleUpdateUser();
handleAddUser();
getUsers();
handleDeleteUer();
