let setNum = [];
let passwords = [];

function handleFormSubmit(event) {
  event.preventDefault();
  const userDetails = {
    username: event.target.username.value,
    setNo: event.target.setNo.value,
  };

  // Check if the set number already exists
  const existingSet = passwords.find((password) => password.setNo === userDetails.setNo);
  if (existingSet) {
    alert("This set number is already booked!");
    return;
  }

  axios
    .post("https://crudcrud.com/api/94882f40e0ef4ba9a71dcdecaf26b17f/movieSetBook", userDetails)
    .then((response) => {
      passwords.push(response.data);
      displayUserOnScreen(response.data);
      updateTotalBooked();
      toggleNothingPresent();
    })
    .catch((error) => console.log(error));

  // Clearing the input fields
  document.getElementById("username").value = "";
  document.getElementById("setNo").value = "";
}

function displayUserOnScreen(userDetails) {
  const userItem = document.createElement("li");
  userItem.textContent = `${userDetails.username} - ${userDetails.setNo}`;

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  userItem.appendChild(deleteBtn);

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  userItem.appendChild(editBtn);

  const userList = document.getElementById("user-list");
  userList.appendChild(userItem);

  deleteBtn.addEventListener("click", function (event) {
    axios
      .delete(`https://crudcrud.com/api/94882f40e0ef4ba9a71dcdecaf26b17f/movieSetBook/${userDetails._id}`)
      .then((response) => {
        userList.removeChild(userItem);
        passwords = passwords.filter((password) => password._id !== userDetails._id);
        updateTotalBooked();
        toggleNothingPresent();
      })
      .catch((error) => console.log(error));
  });

  editBtn.addEventListener("click", function (event) {
    axios
      .delete(`https://crudcrud.com/api/94882f40e0ef4ba9a71dcdecaf26b17f/movieSetBook/${userDetails._id}`)
      .then(() => {
        userList.removeChild(userItem);
        setNum = setNum.filter((set) => set._id !== userDetails._id);
        updateTotalBooked();
        toggleNothingPresent();
      })
      .catch((error) => console.log(error));

    // populate
    document.getElementById("username").value = userDetails.username;
    document.getElementById("setNo").value = userDetails.setNo;
  });

  updateTotalBooked();
  toggleNothingPresent();
}

function updateTotalBooked() {
  const userList = document.getElementById("user-list");
  const totalSetBooked = userList.getElementsByTagName("li").length;
  document.getElementById("total-value").textContent = `Total Booked: ${totalSetBooked}`;
}

function handleSearch(event) {
  const searchTerm = event.target.value;
  const filteredSet = passwords.filter((password) =>
    password.setNo.includes(searchTerm)
  );
  if (searchTerm) {
    document.getElementById("total-value").style.display = "none";
  } else {
    document.getElementById("total-value").style.display = "block";
  }
  displayFilteredSet(filteredSet);
}

function displayFilteredSet(filteredSet) {
  const userList = document.getElementById("user-list");
  userList.innerHTML = "";
  if (filteredSet.length > 0) {
    filteredSet.forEach((password) => {
      const userItem = document.createElement("li");
      userItem.textContent = `${password.username} - ${password.setNo}`;

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      userItem.appendChild(deleteBtn);

      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      userItem.appendChild(editBtn);

      userList.appendChild(userItem);

      deleteBtn.addEventListener("click", function (event) {
        axios
          .delete(`https://crudcrud.com/api/94882f40e0ef4ba9a71dcdecaf26b17f/movieSetBook/${password._id}`)
          .then((response) => {
            userList.removeChild(userItem);
            passwords = passwords.filter((pwd) => pwd._id !== password._id);
            updateTotalBooked();
            toggleNothingPresent();
          })
          .catch((error) => console.log(error));
      });

      editBtn.addEventListener("click", function (event) {
        axios
          .delete(`https://crudcrud.com/api/94882f40e0ef4ba9a71dcdecaf26b17f/movieSetBook/${password._id}`)
          .then(() => {
            userList.removeChild(userItem);
            setNum = setNum.filter((set) => set._id !== password._id);
            updateTotalBooked();
            toggleNothingPresent();
          })
          .catch((error) => console.log(error));

        // populate
        document.getElementById("username").value = password.username;
        document.getElementById("setNo").value = password.setNo;
      });
    });
  } else {
    toggleNothingPresent();
  }
}

function toggleNothingPresent() {
  const userList = document.getElementById("user-list");
  const noSets = document.getElementById("no-sets");
  if (userList.getElementsByTagName("li").length === 0) {
    noSets.style.display = "block";
  } else {
    noSets.style.display = "none";
  }
}

window.addEventListener("DOMContentLoaded", () => {
  axios
    .get("https://crudcrud.com/api/94882f40e0ef4ba9a71dcdecaf26b17f/movieSetBook")
    .then((response) => {
      passwords = response.data;
      passwords.forEach((password) => displayUserOnScreen(password));
      updateTotalBooked();
      toggleNothingPresent();
    })
    .catch((error) => console.log(error));
});
