let STORE = {
  streetID: null,
  streetNum: null,
}

let streets = [{
    name: "Oxford Street",
    from: 0,
    to: randomNumber(20, 200),
    id: 1
  },
  {
    name: "Regents Street",
    from: 0,
    to: randomNumber(20, 200),
    id: 2
  },
  {
    name: "Newton Street",
    from: 0,
    to: randomNumber(20, 200),
    id: 3
  }
]

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function getStreetById(id) {
  let street = streets.find(street => {
    return street.id == id;
  })
  return street;
}

function validate(user, pass) {
  let username = "test";
  let password = "password";
  if (user === username && pass === password) {
    return true;
  } else {
    return false;
  }
}

$(".js-login-button").on("click", event => {
  event.preventDefault();
  let inputUsername = $(".js-userName").val();
  let inputPassword = $(".js-password").val();

  if (validate(inputUsername, inputPassword)) {
    $(document).find(".js-main-section").removeClass("hidden");
    $(".js-login").addClass("hidden");
    console.log("login validated");
  }

  console.log(inputUsername, inputPassword);
})

// takes array, returns new array of HTML template literals, appends to street list element
function renderStreetList() {
  listHTML = streets.map(street => {
    return `
      <div class="section-container">
        <div class="street-edit-delete">
          <p>${street.name} ${street.from} to ${street.to}</p>
          <button data-id="${street.id}" class="js-edit-button btn-edit-${street.id}">edit</button>
          <button data-id="${street.id}" class="js-delete-button">delete</button>
          <button data-id="${street.id}" class="js-canvass-button">canvass</button>
        </div>
      </div>
    `
  });
  $('.js-street-list').html(listHTML);
}



//Takes street form input, adds to street list
function handleStreetSubmit() {
  $('.js-street-input').submit(event => {
    event.preventDefault();
    let street = $('.js-street').val();
    let lowNumber = $('.js-houseNumberLow').val();
    let highNumber = $('.js-houseNumberHigh').val();
    let newStreetObject = {
      name: street,
      from: lowNumber,
      to: highNumber,
      id: (streets.length + 1)
    }
    streets.unshift(newStreetObject);
    renderStreetList();
  })
}

function renderEditForm(street) {
  let formHTML = `
  <div id="editForm" class="edit-section">
    <form role="form" action="#" method="post" class="js-street-edit">
      <label for="street-edit">Edit Street Name</label>
      <input value="${street.name}" class="input js-street-edit" id="street-edit" name="street-edit" type="text" placeholder="eg. Oxford Street...">
      <label for="houseNumberRange">Edit property number range</label>
      <input value="${street.from}" class="input js-lowNumEdit" id="lowNumEdit" name="lowNumEdit" type="number" placeholder="0">
      <label for="highNumEdit">to</label>
      <input value="${street.to}" class="input js-highNumEdit" id="highNumEdit" name="highNumEdit" type="number" placeholder="100">
      <p style="display: none; color: red" class="login-error">Please enter a number</p>
      <button class="button js-save-button" type="submit">Save</button>
      <button class="button js-cancel-button" type="submit">Cancel</button>
    </form>
  </div>
  `
  return formHTML;
}

function editButton() {
  $(document).on("click", ".js-edit-button", (event) => {
    const id = $(event.target).data("id")
    const street = getStreetById(id);
    let renderFormHTML = renderEditForm(street);
    $(event.target).parent().after(renderFormHTML);
    $(event.target).prop("disabled", true);
    console.log($(event.target).parent());
    // $(event.currentTarget).closest(".section-container").find('.edit-section').removeClass('hidden');
  });
}

function deleteButton() {
  $(document).on("click", ".js-delete-button", function() {
    let id = $(this).data("id");
    //gets id of street clicked, returns everything in the list that doesn't have that id
    let _streets = streets.filter(street => {
      return street.id !== id;
    })
    //swaps new list with street removed for old, re-renders list
    streets = _streets;
    renderStreetList();
  })
}

function cancelButton() {
  $(document).on("click", ".js-cancel-button", (event) => {
    event.preventDefault();
    const $sectionContainer = $(event.currentTarget).closest(".section-container");
    $sectionContainer.find(".edit-section").addClass('hidden');
    $sectionContainer.find('input[name=street-edit]').val("");
    $sectionContainer.find('input[name=lowNumEdit]').val("");
    $sectionContainer.find('input[name=highNumEdit]').val("");
    $sectionContainer.find(".js-edit-button").prop("disabled", false);
    console.log($(event.currentTarget).prev());
  })
}

function saveButton() {
  $(document).on("click", ".js-save-button", (event) => {
    event.preventDefault();

    let streetField = $(event.currentTarget).closest('.section-container').find('input[name=street-edit]').val();
    let fromField = $(event.currentTarget).closest('.section-container').find('input[name=lowNumEdit]').val();
    let toField = $(event.currentTarget).closest('.section-container').find('input[name=highNumEdit]').val();

    let street;
    let from;
    let to;

    if (streetField === "") {
      street = $(event.currentTarget).closest('.section-container').find('input[name=street-edit]').val();
    } else {
      street = streetField;
    }

    if (fromField === "") {
      from = $(event.currentTarget).closest('.section-container').find('input[name=lowNumEdit]').val();
    } else {
      from = fromField;
    }

    if (toField === "") {
      to = $(event.currentTarget).closest('.section-container').find('input[name=highNumEdit]').val();
    } else {
      to = toField;
    }

    $(event.currentTarget).closest(".section-container").find(".street-edit-delete").html(`
      <p>${street} ${from} to ${to}</p>
      <button class="js-edit-button">edit</button>
      <button data-id="${street.id}" class="js-delete-button">delete</button>
      `);
    $(event.currentTarget).closest(".section-container").find(".edit-section").addClass('hidden');
    $(event.currentTarget).closest('.section-container').find('input[name=street-edit]').val("");
    $(event.currentTarget).closest('.section-container').find('input[name=lowNumEdit]').val("");
    $(event.currentTarget).closest('.section-container').find('input[name=highNumEdit]').val("");
    console.log(street, from, to);
  })
}

function canvassButton() {
  $(document).on("click", ".js-canvass-button", (event) => {
    event.preventDefault();
    STORE.streetID = $(event.target).data("id")
    $(event.target).after(`
        <div>
        <label>choose house number</label>
        <input type='number'>
        <button class="js-survey-button">start survey</button>
        </div>`);
  })
}

function renderSurvey(event) {
  const surveyHTML = `
    <form role="form" action="#" method="post" class="js-survey-form">
      <label>Name</label>
      <input name="name" type="text">
      <input type="submit">
    </form>
  `
  $(event.target).after(surveyHTML);
}

function surveyButton() {
  $(document).on("click", ".js-survey-button", (event) => {
    event.preventDefault();
    STORE.streetNum = $(event.target).prev().val();
    console.log("survey clicked", STORE.streetNum);
    renderSurvey(event);
  })
}

function submitSurvey() {
  $(document).on("submit", ".js-survey-form", (event) => {
    event.preventDefault();
    let name = event.target.name.value
    window.test = event;
    console.log("submit clicked", name);
  })
}





function setUpApp() {
  renderStreetList();
  handleStreetSubmit();
  editButton();
  deleteButton();
  cancelButton();
  saveButton();
  canvassButton();
  surveyButton();
  submitSurvey();
}

$(setUpApp);
