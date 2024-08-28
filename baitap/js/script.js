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
const getUsers = async (query = {}) => {
  try {
    // hàm search có sẵn ở js new URLsearch
    let queryString = new URLSearchParams(query).toString();
    if (queryString) {
      queryString = "?" + queryString;
    }

    const response = await fetch(`${serverApi}/users${queryString}`);
    if (!response.ok) {
      throw new Error("Fetch to failed");
    }
    const users = await response.json();
    render(users);
    // tính số trang = tổng số bản ghi / số bản ghi của 1 trang (limit)
    // làm tròn lên Math.ceil
    // tổng số bản ghi x-total-count ở header
    // bản ghi _limit
    const totalPages = Math.ceil(
      response.headers.get("x-total-count") / query._limit
    );

    renderPagination(totalPages);
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
const renderPagination = (totalPages) => {
  const paginationView = document.querySelector(".pagination-view");
  // Xử lí khi ở trang 1 sẽ ko có nút prev
  let paginationHTML = `<ul class="pagination d-flex justify-content-end">
    <li class="page-item">
     ${
       query._page > 1
         ? ` <a class="page-link" href="#" aria-label="Previous" data-type="prev">
        &laquo;`
         : ""
     }
      </a>
    </li>`;
  // 1. đang ở trang nào trang đó sẽ active
  // 2. bấm vào các số chuyển trang tương ứng data-page
  for (let i = 1; i <= totalPages; i++) {
    paginationHTML += `<li class="page-item ${
      i === query._page ? "active" : ""
    }"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
  }

  paginationHTML += `<li class="page-item">
    ${
      query._page < totalPages
        ? `  <a class="page-link" href="#" aria-label="Next" data-type="next">
        &raquo;
      </a>`
        : ""
    }
    </li>
  </ul>`;

  paginationView.innerHTML = paginationHTML;
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
// kĩ thuật debounce
const debounce = (callback, timeout = 500) => {
  let timeoutId = null;

  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback(...args);
    }, timeout);
  };
};
// tìm kiếm JSON thì thêm ?q GET /posts?q=internet
// nếu muốn tìm kiếm kiểu include thì dùng kĩ thuật like JSON GET /posts?title_like=server
const handleSearch = () => {
  const keywordEl = document.querySelector(".keyword");
  keywordEl.addEventListener(
    "input",
    debounce((e) => {
      // lấy keyword khi nhập dùng event input
      const keyword = e.target.value;
      // console.log(keyword);
      // phải để server xử lí chứ không kéo hết về client rồi làm
      // khi nhập thì gửi nhiều request sẽ bị chậm nên sử dụng debounce
      query.q = keyword;
      getUsers(query);
    })
  );
};
// debounce

// sort   GET /posts?_sort=views&_order=asc

const handleSort = () => {
  const btnGroup = document.querySelector(".btn-group ");
  btnGroup.addEventListener("click", (e) => {
    const sortValue = e.target.dataset.value;
    // khi sắp xếp được thì bên tìm kiếm sẽ không đồng bộ
    // call api
    query._order = sortValue === "latest" ? "desc" : "asc";
    getUsers(query);
    // xử lí giao diện
    var btnActive = btnGroup.querySelector(".active");
    if (btnActive) {
      btnActive.classList.remove("active");
    }
    e.target.classList.add("active");
  });
};

// đồng bộ sort và search

const query = {
  _sort: "id",
  _order: "desc",
  _limit: 3,
  _page: 1,
};

// pagination  ?_limit : giới hạn bản ghi
// trả về X-total-count là tổng số bản ghi ở network

// handlePagination
const handleNavigatePagination = () => {
  const paginationViewEl = document.querySelector(".pagination-view");
  paginationViewEl.addEventListener("click", (e) => {
    // thẻ a nên dùng prevent
    e.preventDefault();
    const page = e.target.dataset.page;
    const type = e.target.dataset.type;
    if (page) {
      // cho _page = page hiện tại
      query._page = +page;
      // gọi lại hàm
      getUsers(query);
    }
    // khi bấm lùi
    if (type === "prev") {
      query._page--;
      getUsers(query);
    }
    if (type === "next") {
      query._page++;
      getUsers(query);
    }
  });
};
handleNavigatePagination();
handleSort();
getUsers(query);
handleSearch();
cancelUpdateForm();
handleUpdateUser();
handleAddUser();
handleDeleteUer();
