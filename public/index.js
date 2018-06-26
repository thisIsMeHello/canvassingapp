'use strict';

let STORE = {
  streetID: null,
  streetNum: null,
  streetName: null,
  streetLowNumber: null,
  streetHighNumber: null,
  propertyID: null
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

function getPropertyById(id, callback) {
  $.ajax({
    url: "/api/properties/" + id,
    method: "GET",
    dataType: "json",
    contentType: "application/json; charset=utf-8",
  })
  .done(callback);
}

function getResidentsById(id, callback) {
  $.ajax({
    url: "/api/residents" + id,
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
            <button data-id="${street._id}" class="js-edit-button>edit</button>
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

function streetSurveyButton() {
  $(document).on("click", ".js-survey-button", (event) => {
    event.preventDefault();
    console.log("survey button clicked");
    STORE.streetID = $(event.target).data("id");

    let id = STORE.streetID;

    getStreetById(id, (data) => {
      $(document).find(".js-property-section h2").html(`${data.street.streetName} ${data.street.numRangeStart} to ${data.street.numRangeEnd}`);
    })

    $(document).find(".js-property-section").removeClass("hidden");
    $(document).find(".js-street-section").addClass("hidden");

    getPropertiesAndRender();
  })
}

function exposePropertyInputButton() {
  $(document).on("click", ".js-survey-expose-property-input-button", (event) => {
    event.preventDefault();
    console.log("add property button clicked");
    let propertyNumber = $(".js-property-survey-number").val();
    $(document).find(".property-input").removeClass("hidden");
    $(document).find(".js-survey-expose-property-input-button").addClass("hidden");
    $(document).find(".js-survey-cancel-property-input-button").addClass("hidden");
  })
}

function cancelExposePropertyInputButton() {
  $(document).on("click", ".js-survey-cancel-add-button", (event) => {
    event.preventDefault();
    console.log("cancel expose property input button clicked");
    $(document).find(".property-input").addClass("hidden");
    $(document).find(".js-survey-expose-property-input-button").removeClass("hidden");
    $(document).find(".js-survey-cancel-property-input-button").removeClass("hidden");
  })
}

function cancelSurveyStreetButton() {
  $(document).on("click", ".js-survey-cancel-property-input-button", (event) => {
    console.log("js-survey-cancel-property-input-button clicked");
    event.preventDefault();
    $(document).find(".js-property-section").addClass("hidden");
    $(document).find(".js-street-section").removeClass("hidden");
  })
}

function renderPropertyList(data) {
  let properties = data.properties;

  let listHTML = properties.map(property => {
    return `
      <div class="section-container">
        <div class="property-edit-delete">
          <h2>${property.propertyNum}</h2>
          <div data-id="${property._id}" class="js-property-buttons">
            <button data-id="${property._id}" class="js-property-delete-button">delete</button>
            <button data-id="${property._id}" class="js-propertySurvey-button">survey</button>
          <div>
        </div>
      </div>
    `
  });
  const html = listHTML.join('');
  //join converts array of strings to single string
  $('.js-property-number-list').html(html);
}


function getPropertiesAndRender(){
  let _url = `/api/streets/${STORE.streetID}/properties`
  let settings = {
  "async": true,
  "crossDomain": true,
  "url": _url,
  "method": "GET",
  "headers": {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
    }
  }
  $.ajax(settings).done(function(response){
    console.log("getPropertiesList and render", response)
    renderPropertyList(response)
  })
}

function addPropertyToList() {
  $(document).on("click", ".js-survey-add-button", (event) => {
    event.preventDefault();
    console.log("js-survey-add-button clicked");
    let propertyNumber = $('.js-property-survey-number').val();

    let newPropertyObject = {
      propertyNum: propertyNumber,
      street: STORE.streetID
    }

    $.ajax({
      url: "/api/properties/",
      method: "POST",
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify(newPropertyObject)
    })
    .done(reply => {
      console.log("property posted to database", reply);
      getPropertiesAndRender(reply);
    })
    $(document).find(".property-input").addClass("hidden");
    $(document).find(".js-survey-expose-property-input-button").removeClass("hidden");
    $(document).find(".js-survey-cancel-property-input-button").removeClass("hidden");
  })
}

function propertySurveyButton() {
  $(document).on("click", ".js-propertySurvey-button", (event) => {
    event.preventDefault();
    console.log("property button clicked");
    STORE.propertyID = $(event.target).data("id");
    let id = STORE.propertyID;
    console.log(id);

    getPropertyById(id, (data) => {
      console.log("getPropertyById is firing", data);
      $(document).find(".js-property-section h3").html(`Property number ${data.Property.propertyNum}`);
    })

  $(document).find(".js-property-number-list").addClass("hidden");
  $(document).find(".js-property-input-buttons").addClass("hidden");
  $(document).find(".js-occupant-input-buttons").removeClass("hidden");
  getResidentsAndRender();
  })
}

function propertyDeleteButton() {
  $(document).on("click", ".js-property-delete-button",(event) => {
    event.preventDefault();
    const id2 = $(event.target).data("id");

    $.ajax({
      url: "/api/properties/" + id2,
      method: "DELETE",
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      // data: JSON.stringify(newStreetObject)
    })
    .done(reply => {
      getPropertiesAndRender(reply);
    })
  })
}

function exposeAddOccupantForm() {
  $(document).on("click", ".js-survey-expose-occupant-input-button", (event) => {
    event.preventDefault();
    console.log("expose add occupant form button clicked");
    $(document).find(".js-resident-survey-form").removeClass("hidden");
    $(document).find(".js-survey-form").removeClass("hidden");
    $(document).find(".js-occupant-input-buttons").addClass("hidden");
  })
}

function cancelExposeAddOccupantForm() {
  $(document).on("click", ".js-cancel-save-resident", (event) => {
    event.preventDefault();
    console.log("cancel expose add occupant form button clicked");
    $(document).find(".js-resident-survey-form").addClass("hidden");
    $(document).find(".js-survey-form").addClass("hidden");
    $(document).find(".js-occupant-input-buttons").removeClass("hidden");
  })
}

function renderResidentList(data) {
  let residents = data.residents;

  let listHTML = residents.map(resident => {
    return `
      <div class="section-container">
        <div class="resident-edit-delete">
          <h2>${resident.firstName} ${resident.surname}</h2>
          <h3>${resident.votingIntention}</h3>
          <div data-id="${resident._id}" class="js-resident-buttons">
            <button data-id="${resident._id}" class="js-resident-delete-button">delete</button>
          <div>
        </div>
      </div>
    `
  });
  const html = listHTML.join('');
  //join converts array of strings to single string
  $('.js-occupant-list').html(html);
}



function getResidentsAndRender(){
  let _url = `/api/properties/${STORE.propertyID}/residents`

  let settings = {
  "async": true,
  "crossDomain": true,
  "url": _url,
  "method": "GET",
  "headers": {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
    }
  }
  $.ajax(settings).done(function(response){
    console.log("get OccupantsList and render", response)
    renderResidentList(response)
  })
}

function addResidentToList() {
  $(document).on("click", ".js-save-resident", (event) => {
    event.preventDefault();
    console.log("save resident button clicked");
    let firstName = $('.survey-first-name').val();
    let surname = $('.survey-surname').val();
    let votingIntention = $('.survey-voting-intention').val();

    let newResidentObject = {
      firstName: firstName,
      surname: surname,
      votingIntention: votingIntention,
      property: STORE.propertyID
    }

    console.log(newResidentObject);

    $(".js-resident-survey-form").addClass("hidden");
    $('.survey-first-name').val("");
    $('.survey-surname').val("");
    $('.survey-voting-intention').val("");

    $.ajax({
      url: "/api/residents/",
      method: "POST",
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify(newResidentObject)
    })
    .done(reply => {
      console.log("resident posted to database", reply);
      getResidentsAndRender(reply);
    })
    $(document).find(".js-occupant-input-buttons").removeClass("hidden");
  })
}

function backToPropertyList() {
  $(document).on("click", ".js-survey-cancel-occupant-input-button", (event) => {
    event.preventDefault();
    console.log("back to property list button clicked");

    $(document).find(".js-property-number-list").removeClass("hidden");
    $(document).find(".js-property-input-buttons").removeClass("hidden");
    $(document).find(".js-occupant-input-buttons").addClass("hidden");
    $('.js-occupant-list').html("");
  // getResidentsAndRender();
  })
}

function residentDeleteButton() {
  $(document).on("click", ".js-resident-delete-button",(event) => {
    event.preventDefault();
    const id2 = $(event.target).data("id");

    $.ajax({
      url: "/api/residents/" + id2,
      method: "DELETE",
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      // data: JSON.stringify(newStreetObject)
    })
    .done(reply => {
      getResidentsAndRender(reply);
    })
  })
}

function residentEditButton() {
  $(document).on("click", ".js-resident-edit-button", (event) => {
    let id = $(event.target).data("id")
    getResidentsById(id, function(editResident){
      let renderFormHTML = renderResidentEditForm(editResident);
      $(event.target).closest(".js-street-buttons").addClass("hidden");
      $(event.target).parent().after(renderFormHTML);
    })
  });
}

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
  streetSurveyButton();
  exposePropertyInputButton();
  cancelExposePropertyInputButton();
  cancelSurveyStreetButton();
  addPropertyToList();
  propertySurveyButton();
  propertyDeleteButton();
  exposeAddOccupantForm();
  cancelExposeAddOccupantForm()
  addResidentToList();
  backToPropertyList();
  residentDeleteButton();
  // renderOccupantHTML();
  // renderOccupantList();
}

$(setUpApp);
