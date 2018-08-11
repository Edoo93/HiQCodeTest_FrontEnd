var apiKey = "";
var count = 1;

$(document).ready(function(){
    searchBox();
    sortTable();
});

function searchBox(){
    $("#btnSearch").click(function(){
        var searchBox = $("#searchString").val();
        getFromRest(searchBox);
        resetField();
    });
}

function resetField(){ 
    $("#searchString").attr("placeholder", "Enter Address").val("");
}

function getFromRest(address){
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://maps.googleapis.com/maps/api/geocode/json?address=" +address,
            "method": "GET"
          }
          
          $.ajax(settings).done(function (response) {
            console.log(response);
            noResults(response);
            for(var i = 0; i < response.results.length; i++){
                var temp = response.results[i];
                var address = temp.formatted_address;
                var city = findCity(temp);
                var country = findCountry(temp);
                var lat = temp.geometry.location.lat;
                var lng = temp.geometry.location.lng;

                populateTable(address, city, country, lat, lng);
            }
          }).fail(function(){
                alert("Ange address!");
          });
}

function findCity(response){
    for(var i = 0; i < response.address_components.length; i++){
        if(response.address_components[i].types[0] == "locality"){
            return response.address_components[i].long_name;
        }
    }
}

function findCountry(response){
    for(var i = 0; i < response.address_components.length; i++){
        if(response.address_components[i].types[0] == "country"){
            return response.address_components[i].short_name;
        }
    }
}

function noResults(results){
    if(results.status == "ZERO_RESULTS"){
        alert("Inga platser hittades!");
    }
}

function populateTable(address, city, country, lat, lng){
    var $row = $('<tr> </tr>').attr("id", "table-row");
    var $cells = $('<td>' + count++ + '</td>'
                  + '<td>' + address + '</td>'
                  + '<td>' +city + '</td>'  
                  + '<td>' +country + '</td>'
                    ).click(function(){
                        window.open("https://www.google.se/maps/place/.../@" + lat + "," + lng + ",12z");
                    });

        
    $row.append($cells);
    $('tbody').append($row);
}

function sortTable(){
    $('.tablesorter').tablesorter({widgets: ['zebra']}).click(function(){
         $(".tablesorter").trigger("updateAll");
    })
}