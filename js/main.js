$(document).ready(function () {
    checkFlights();
    // setInterval(checkFlights, 6000);
    function checkFlights() {
        // var json = url ('AircraftList.json');
        // 'https://public-api.adsbexchange.com/VirtualRadar/AircraftList.json?lat=44.946664&lng=20.215842&fDstL=0&fDstU=1000'
        $.getJSON('../AircraftListMini.json?')
            .done(function (data) {
                var array = data.acList.sort( GetSortOrder("Alt") );
                array.reverse();

                $('.flight-list .flight').remove();

                array.forEach(function (item) {
                    // console.log(item.OpIcao);
                    var currentLong = item.Long;

                    var direction = ((userLong - currentLong) < 0) ? 'arrow-right' : 'arrow-left';

                    if(item.Op && item.To && item.From && item.Mdl && item.Alt ){
                        var flight = $('<li class="flight">\n' +
                            '    <div class="uk-flex-middle uk-child-width-1-4@s" uk-grid>\n' +
                            '        <div class="direction"><span uk-icon="icon: ' + direction + '"></span></div>\n' +
                            '        <div class="altitude">' + item.Alt + '</div>\n' +
                            '        <div class="id">' + item.Id + '</div>\n' +
                            '        <div class="view-details ">\n' +
                            '            <a href="#" class="button modal-link" data-to="'+ item.To +'" data-from="'+ item.From +'" data-company="'+ item.Op +'" data-model="'+ item.Mdl +'">Details</a>\n' +
                            '        </div>\n' +
                            '    </div>\n' +
                            '</li>');
                        $(".flight-list").append(flight);
                    }
                });
            })
            .always(function () { $("#loader").hide(); });
    }



    $('.flight-list').on('click','.modal-link',function (e) {
        e.preventDefault();
        var from = $(this).attr('data-from');
        var to = $(this).attr('data-to');
        var company = $(this).attr('data-company');
        var model = $(this).attr('data-model');

        var $flightDetailsModal = $('#flight-details-modal');

        $flightDetailsModal.find('.from-to').text(from +' '+to);
        $flightDetailsModal.find('.company').text(company);
        $flightDetailsModal.find('.model').text(model);

        UIkit.modal('#flight-details-modal').show();
    });

    var userLong, userLat;
    var x = document.getElementById("curent-position");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);

    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }

    function showPosition(position) {
        userLat = position.coords.latitude;
        userLong = position.coords.longitude;
        x.innerHTML = "Longitude: " + userLong + " ~ Latitude: " + userLat;
    }


    function GetSortOrder(prop){
        return function(a,b){
            if( a[prop] > b[prop]){
                return 1;
            }else if( a[prop] < b[prop] ){
                return -1;
            }
            return 0;
        }
    }
    dateTime();
    setInterval(dateTime, 6000);
    function dateTime(){
        var d = new Date();
        var t = d.getTime();
        $('.date-time').html(d, t);
    }


});