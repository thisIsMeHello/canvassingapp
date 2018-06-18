'use strict';

let STORE = {
  streetID: null,
  streetNum: null,
}

let streets = [];

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

function splashLoginLink(){
  $(document).on("click", ".js-splash-login-link", function(event) {
    event.preventDefault();
    console.log("splash login link clicked");
    $(document).find(".js-login-section").removeClass("hidden");
    $(document).find(".js-splash-section").addClass("hidden");
  })
}

// function splashRegisterLink(){
//   $(document).on("click", ".js-splash-register-link", function(event) {
//     event.preventDefault();
//     console.log("splash register link clicked");
//     $(document).find(".js-register-section").removeClass("hidden");
//     $(document).find(".js-splash-section").addClass("hidden");
//   })
// }

// function loginRegisterLink(){
//   $(document).on("click", ".js-login-page-reg-link", function(event) {
//     event.preventDefault();
//     console.log("login register link clicked");
//     $(document).find(".js-register-section").removeClass("hidden");
//     $(document).find(".js-login-section").addClass("hidden");
//   })
// }

function loginHomeLink(){
  $(document).on("click", ".js-login-page-home-link", function(event) {
    event.preventDefault();
    console.log("login home link clicked");
    $(document).find(".js-splash-section").removeClass("hidden");
    $(document).find(".js-login-section").addClass("hidden");
  })
}

// function registerHomeLink(){
//   $(document).on("click", ".js-reg-page-home-link", function(event) {
//     event.preventDefault();
//     console.log("register page home link clicked");
//     $(document).find(".js-splash-section").removeClass("hidden");
//     $(document).find(".js-register-section").addClass("hidden");
//   })
// }

// function loginSubmitButton(){
//   $(document).on("click", ".js-login-page-submit-button", function() {
//     console.log("login page login button clicked");
//     $(document).find(".js-login-section").addClass("hidden");
//     $(document).find(".js-street-section").removeClass("hidden");
//   })
// }

$(".js-login-page-submit-button").on("click", event => {
  console.log("login button clicked");
  event.preventDefault();
  let inputUsername = $(".js-login-userName").val();
  let inputPassword = $(".js-login-password").val();
  console.log(inputUsername, inputPassword);

  if (validate(inputUsername, inputPassword)) {
    $(document).find(".js-street-section").removeClass("hidden");
    $(".js-login-section").addClass("hidden");
    console.log("login validated");
  } else {
    $(document).find("p.js-login-msg").html(`<p>Login details incorrect</p>`);
    $(document).find(".js-login-userName").val("");
    $(document).find(".js-login-password").val("");
  }
})

$(".js-add-street-button").on("click", event => {
  console.log("add street button clicked");
  $(document).find(".js-add-street-form").removeClass("hidden");
})

$(".js-cancel-add-street-button").on("click", event => {
  console.log("cancel add street button clicked");
  $(document).find(".js-street").val("");
  $(document).find(".js-houseNumberLow").val("");
  $(document).find(".js-houseNumberHigh").val("");
  $(document).find(".js-add-street-form").addClass("hidden");
})

function streetHomeLink(){
  $(document).on("click", ".js-street-section-home-link", function(event) {
    event.preventDefault();
    console.log("street page home link clicked");
    $(document).find(".js-splash-section").removeClass("hidden");
    $(document).find(".js-street-section").addClass("hidden");
  })
}

function renderStreetList() {
  const listHTML = streets.map(street => {
    return `
      <div class="section-container">
        <div class="street-edit-delete">
          <p>${street.name} ${street.from} to ${street.to}</p>
          <div data-id="${street.id}" class="js-street-buttons">
            <button data-id="${street.id}" class="js-edit-button btn-edit-${street.id}">edit</button>
            <button data-id="${street.id}" class="js-delete-button">delete</button>
            <button data-id="${street.id}" class="js-survey-button">survey</button>
          <div>
        </div>
      </div>
    `
  });
  $('.js-street-list').html(listHTML);
}

$(".js-add-street-to-list-button").on("click"), event => {
  $(document).find(".js-add-street-form").addClass("hidden");
}


//Takes street form input, adds to street list. re-render list
function  addStreetToList() {
  $(".js-street-input-form").submit(event => {
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
    $(".js-add-street-form").addClass("hidden");
    $('.js-street').val("");
    $('.js-houseNumberLow').val("");
    $('.js-houseNumberHigh').val("");
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
      <button data-id="${street.id}" class="button js-save-button" type="submit">Save</button>
      <button class="button js-cancel-button" type="submit">Cancel</button>
    </form>
  </div>
  `
  return formHTML;
}

function streetEditButton() {
  $(document).on("click", ".js-edit-button", (event) => {
    let id = $(event.target).data("id")
    let street = getStreetById(id);
    let renderFormHTML = renderEditForm(street);
    $(event.target).closest(".js-street-buttons").addClass("hidden");
    $(event.target).parent().after(renderFormHTML);
  });
}

function streetDeleteButton() {
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

function streetEditCancelButton() {
  $(document).on("click", ".js-cancel-button", (event) => {
    event.preventDefault();
    const $sectionContainer = $(event.currentTarget).closest(".section-container");
    $sectionContainer.find(".edit-section").addClass('hidden');
    $sectionContainer.find(".js-street-buttons").removeClass("hidden");
    $sectionContainer.find('input[name=street-edit]').val("");
    $sectionContainer.find('input[name=lowNumEdit]').val("");
    $sectionContainer.find('input[name=highNumEdit]').val("");
    // $(event.target).closest(".js-street-buttons").removeClass("hidden");
  })
}

function streetEditSaveButton() {
  $(document).on("click", ".js-save-button",(event) => {
    event.preventDefault();
    const id2 = $(event.target).data("id");
    const street2 = getStreetById(id2);
    console.log("save button clicked");

    let street = $(event.currentTarget).closest('.section-container').find('input[name=street-edit]').val();
    let from = $(event.currentTarget).closest('.section-container').find('input[name=lowNumEdit]').val();
    let to = $(event.currentTarget).closest('.section-container').find('input[name=highNumEdit]').val();

    streets.splice((id2-1), 1, {name: street, from: from, to: to, id:id2});
    renderStreetList();
  })
}

function streetCanvassButton() {
  $(document).on("click", ".js-survey-button", (event) => {
    event.preventDefault();
    console.log("survey button clicked");
    STORE.streetID = $(event.target).data("id");
    $(document).find(".js-property-section").removeClass("hidden");
    $(document).find(".js-street-section").addClass("hidden");
  })
}



// function startSurveyButton() {
//   $(document).on("click", ".js-start-survey-button", (event) => {
//     event.preventDefault();
//     STORE.streetNum = $(event.target).prev().val();
//     console.log("start survey clicked", STORE.streetNum);
//     renderSurvey(event);
//   })
// }

function renderSurvey(event) {
  const surveyHTML = `
    <form role="form" action="#" method="post" class="js-survey-form">
      <label for="survey-first-name">First Name</label>
      <input id="survey-first-name" type="text">
      <label for="survey-surname">Surname</label>
      <input id="survey-surname" type="text">
      <label for="survey-voting-intention">Voting Intention</label>
      <input id="surney-voting-intention" type="text">
      <button class="js-save-survey">Save</button>
      <button class="js-save-survey">Cancel</button>
    </form>
  `
  $(event.target).after(surveyHTML);
}

function submitSurveyButton() {
  $(document).on("submit", ".js-survey-form", (event) => {
    event.preventDefault();
    console.log("submit clicked", name);
    let name = event.target.name.value

  })
}





function setUpApp() {
  splashLoginLink();
  // splashRegisterLink();
  // loginRegisterLink()
  loginHomeLink()
  // registerHomeLink()
  renderStreetList();
  addStreetToList();
  streetHomeLink()
  streetEditButton();
  streetDeleteButton();
  streetEditCancelButton();
  streetEditSaveButton();
  streetCanvassButton();
  startSurveyButton();
  submitSurveyButton();
}

$(setUpApp);
