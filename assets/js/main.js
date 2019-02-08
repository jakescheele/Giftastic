// NOTE: Buttons inside of My Searches div do not work after search bar has been used. They do work after page refresh. I spent way too long trying to fix. 


let search = '';
// set variable for localstorage searches
let storedSearches = '';
// check if local storage contains previous searches
if (localStorage.getItem('searches') === '') {
    storedSearches = [];
}
else {
    storedSearches = JSON.parse(localStorage.getItem('searches'))
}
let searches = storedSearches


// DISPLAY UPDATED PREVIOUS SEARCHES
let showSearches = function () {
    $('#searches').html('');
    for (i in searches) {
        $('#searches').append(
            `<div class='btn-group m-1' role='group'>
            <button id='deleteSearch' class='btn btn-info type='button' search-id=` + searches[i] + `>x</button>
            <button id='prevSearch' type='button' class='btn btn-secondary' val=` + searches[i] + `>` + searches[i] + `</button>
        </div>`
        )
    }
    // if searches array is populated craete clear searches button
    if (Array.isArray(searches)) {
        $('#searches').append(
            `<div class='row justify-content-center'>
                <button class='btn btn-primary my-3' id='clearSearches'>Clear Searches</button>
            </div>`
        )
    }
}

showSearches();


// click handler for SEARCH BUTTON
$('#submit').on('click', function (event) {

    // prevent early form submission
    event.preventDefault();

    // grab text from search
    search = $('#search').val();

    // push search into searches array in localstorage
    if (!searches.includes(search)) {
        searches.push(search)
    }
    localStorage.setItem('searches', JSON.stringify(searches))
    console.log('searches:', searches)

    // refresh searches div
    showSearches()

    searchFunction()

})

// click handler for PREVIOUS SEARCH
$('.btn-secondary').on('click', function () {
    console.log('prev search clicked')
    search = $(this).text()
    console.log('this', $(this))
    searchFunction()
})

// SEARCH GIF function

let searchFunction = function () {

    // set API key
    let key = 'sII6l4Zgnri0RaqqzeRlPpqayiWa2EPt'

    // build giphy URL using search
    var queryURL = 'https://api.giphy.com/v1/gifs/search?api_key=' + key + '&q=' + search + '&limit=10&offset=0&lang=en'

    // ajax Call
    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function (response) {
        console.log(response)
        // Clear images div
        $('#images').html('')
        // Loop through results
        for (i = 0; i < response.data.length; i++) {
            let div = $("<div>")
            let img = $("<img class='gif p-2'>")
            img.attr('src', response.data[i].images.original_still.url)
            img.attr('src1', response.data[i].images.original_still.url)
            img.attr('src2', response.data[i].images.original.url)
            $('#images').prepend(
                div.append(img)
            )
        }
    })
}

// click handler for GIF animation
$(document).on('click', '.gif', function () {
    console.log($(this).attr('src'))
    if ($(this).attr('src').includes('_s')) {
        $(this).attr('src', $(this).attr('src2'))
    }
    else {
        $(this).attr('src', $(this).attr('src1'))
    }

})

// click handler for CLEAR ONE search (x)
$('.btn-info').on('click', function () {
    console.log('delte prev clicked', $(this))
    // loop to remove matching array item
    for (var i = 0; i < searches.length - 1; i++) {
        if (searches[i] === $(this).attr('search-id')) {
            searches.splice(i, 1);
        }

        localStorage.setItem('searches', JSON.stringify(searches))

        showSearches()
    }
})

// click handler for CLEAR ALL searches
$('#clearSearches').on('click', function () {
    searches = [];
    localStorage.setItem('searches', '');
    $('#searches').html('');
})