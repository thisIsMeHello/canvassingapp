'use strict';

let STORE = {
  streetID: null,
  streetNum: null,
  streetName: null,
  streetLowNumber: null,
  streetHighNumber: null,
}

let streets = [];
let occupants = [];

function getStreetById(id, callback) {
  $.ajax({
    url: "/api/streets/" + id,
    method: "GET",
    dataType: "json",
    contentType: "application/json; charset=utf-8",
  })
  .done(callback);
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

function loginHomeLink(){
  $(document).on("click", ".js-login-page-home-link", function(event) {
    event.preventDefault();
    console.log("login home link clicked");
    $(document).find(".js-splash-section").removeClass("hidden");
    $(document).find(".js-login-section").addClass("hidden");
  })
}

$(".js-login-page-submit-button").on("click", event => {
  console.log("login button clicked");
  event.preventDefault();
  let inputUsername = $(".js-login-userName").val();
  let inputPassword = $(".js-login-password").val();
  console.log(inputUsername, inputPassword);

  if (validate(inputUsername, inputPassword)) {
    $(document).find(".js-street-section").removeClass("hidden");
    $(".js-login-section").addClass("hidden");
  } else {
    $(document).find("p.js-login-msg").html(`<p>Login details incorrect</p>`);
    $(document).find(".js-login-userName").val("");
    $(document).find(".js-login-password").val("");
  }
})

//exposes form for adding street
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

function renderStreetList(data) {
  let streets = data.streets;

  let listHTML = streets.map(street => {
    return `
      <div class="section-container">
        <div class="street-edit-delete">
          <p class="street-details"><span class="listStreetName">${street.streetName}</span> <span class="listStreetFrom">${street.numRangeStart}</span> to <span class="listStreetTo">${street.numRangeEnd}</span></p>
          <div data-id="${street._id}" class="js-street-buttons">
            <button data-id="${street._id}" class="js-edit-button btn-edit-${street.id}">edit</button>
            <button data-id="${street._id}" class="js-delete-button">delete</button>
            <button data-id="${street._id}" class="js-survey-button">survey</button>
          <div>
        </div>
      </div>
    `
  });
  const html = listHTML.join('');


  //join converts array of strings to single string
  $('.js-street-list').html(html);

}

function getStreetsAndRender(){

  let settings = {
  "async": true,
  "crossDomain": true,
  "url": "/api/streets",
  "method": "GET",
  "headers": {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
    }
  }
  $.ajax(settings).done(function(response){
    renderStreetList(response)
  })
}

//adds street to database, renders streetlist to the DOM
function  addStreetToList() {
  $(".js-street-input-form").submit(event => {
    console.log("street submitted");
    event.preventDefault();
    let street = $('.js-street').val();
    let lowNumber = $('.js-houseNumberLow').val();
    let highNumber = $('.js-houseNumberHigh').val();

    let newStreetObject = {
      streetName: street,
      numRangeStart: lowNumber,
      numRangeEnd: highNumber,
    }

    $(".js-add-street-form").addClass("hidden");
    $('.js-street').val("");
    $('.js-houseNumberLow').val("");
    $('.js-houseNumberHigh').val("");

    $.ajax({
      url: "/api/streets/",
      method: "POST",
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify(newStreetObject)
    })
    .done(reply => {
      console.log("street posted to database");
      getStreetsAndRender(reply);
    })
  })
}

function renderEditForm(data) {
  let street = data.street;
  let formHTML = `
  <div id="editForm" class="edit-section">
    <form role="form" action="#" method="post" class="js-street-edit">
      <label for="street-edit">Edit Street Name</label>
      <input value="${street.streetName}" class="input js-street-edit" id="street-edit" name="street-edit" type="text" placeholder="eg. Oxford Street...">
      <label for="houseNumberRange">Edit property number range</label>
      <input value="${street.numRangeStart}" class="input js-lowNumEdit" id="lowNumEdit" name="lowNumEdit" type="number" placeholder="0">
      <label for="highNumEdit">to</label>
      <input value="${street.numRangeEnd}" class="input js-highNumEdit" id="highNumEdit" name="highNumEdit" type="number" placeholder="100">
      <p style="display: none; color: red" class="login-error">Please enter a number</p>
      <button data-id="${street._id}" class="button js-save-button" type="submit">Save</button>
      <button class="button js-cancel-button" type="submit">Cancel</button>
    </form>
  </div>
  `
  return formHTML;
}

function streetEditButton() {
  $(document).on("click", ".js-edit-button", (event) => {
    let id = $(event.target).data("id")
    getStreetById(id, function(editStreet){
      let renderFormHTML = renderEditForm(editStreet);
      $(event.target).closest(".js-street-buttons").addClass("hidden");
      $(event.target).parent().after(renderFormHTML);
    })
  });
}

function streetDeleteButton() {
  $(document).on("click", ".js-delete-button",(event) => {
    event.preventDefault();
    const id2 = $(event.target).data("id");

    $.ajax({
      url: "/api/streets/" + id2,
      method: "DELETE",
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      // data: JSON.stringify(newStreetObject)
    })
    .done(reply => {
      getStreetsAndRender(reply);
    })
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
    let street = $(event.currentTarget).closest('.section-container').find('input[name=street-edit]').val();
    let from = $(event.currentTarget).closest('.section-container').find('input[name=lowNumEdit]').val();
    let to = $(event.currentTarget).closest('.section-container').find('input[name=highNumEdit]').val();
    console.log(street, from, to);

    let newStreetObject = {
      _id: id2,
      streetName: street,
      numRangeStart: from,
      numRangeEnd: to,
    }

    $.ajax({
      url: "/api/streets/" + id2,
      method: "PUT",
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify(newStreetObject)
    })
    .done(reply => {
      getStreetsAndRender(reply);
    })
  })
}

function streetCanvassButton() {
  $(document).on("click", ".js-survey-button", (event) => {
    event.preventDefault();
    console.log("survey button clicked");
    STORE.streetID = $(event.target).data("id");
    console.log(STORE.streetID);
    STORE.streetName = $(event.currentTarget).closest(".section-container").find(".listStreetName").text();
    STORE.streetLowNumber = $(event.currentTarget).closest(".section-container").find(".listStreetFrom").text();
    STORE.streetHighNumber = $(event.currentTarget).closest(".section-container").find(".listStreetTo").text();
    $(document).find(".js-property-section").removeClass("hidden");
    $(document).find(".js-street-section").addClass("hidden");
    $(document).find(".js-property-section h2").html(`${STORE.streetName} ${STORE.streetLowNumber} to ${STORE.streetHighNumber}`);
  })
}

function addOccupantButton() {
  $(document).on("click", ".js-survey-add-occupant-button", (event) => {
    event.preventDefault();
    console.log("add occupant button clicked");
    let propertyNumber = $(".js-Property-survey-number").val();
    $(document).find(".propertyNumberForm").addClass("hidden");
    $(document).find(".js-survey-form").removeClass("hidden");
    $(document).find(".js-property-section h2").text(`Property number ${propertyNumber}`);
  })
}

function addOccupantButton2() {
  $(document).on("click", ".js-survey-add-occupant-button2", (event) => {
    event.preventDefault();
    console.log("add occupant button clicked");
    let propertyNumber = $(".js-Property-survey-number").val();
    $(document).find(".propertyNumberForm").addClass("hidden");
    $(document).find(".js-survey-form").removeClass("hidden");
    $(document).find(".js-property-section h2").text(`Property number ${propertyNumber}`);
  })
}

function addOccupantToList() {
  $(".js-survey-form").submit(event => {
    event.preventDefault();
    let firstName = $('.js-firstName').val();
    let surname = $('.js-surname').val();
    let votingIntention = $('.js-voting-intention').val();
    let newOccupant = {
      firstName: firstName,
      surname: surname,
      votingIntention: votingIntention,
    }
    $("#residentList").append(renderOccupantHTML(newOccupant));

    $(".js-add-street-form").addClass("hidden");
    $(".js-survey-form").addClass("hidden");
    $(".js-survey-button-group").removeClass("hidden");

    $('.js-firstName').val("");
    $('.js-surname').val("");
    $('.js-voting-intention').val("");

    occupants.push(newOccupant);
  })
}

// function renderOccupantHTML(occupant) {
//     return `
//       <li>
//         ${occupant.firstName} ${occupant.surname}   ${occupant.votingIntention}
//       </li>
//     `
// }

// function renderOccupantList(occupants) {
//   const occupantsHTML = occupants.map(occupant => {
//     return renderOccupantHTML(occupant);
//   });
//   $('#residentList').html(occupantsHTML);
// }


function setUpApp() {
  splashLoginLink();
  loginHomeLink()
  getStreetsAndRender();
  addStreetToList();
  streetHomeLink()
  streetEditButton();
  streetDeleteButton();
  streetEditCancelButton();
  streetEditSaveButton();
  streetCanvassButton();
  addOccupantButton();
  addOccupantToList();
  addOccupantButton2();
  // renderOccupantHTML();
  // renderOccupantList();
}

$(setUpApp);
