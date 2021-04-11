function searchLength() {
    let search = document.querySelector(".search");
    let cross = document.querySelector(".cross");
    let line = document.querySelector(".vertical-line");

    if (search.value.length > 0) {
        cross.style.display = "block";
        line.style.display = "block";
    } else {
        cross.style.display = "none";
        line.style.display = "none";
    }
};

function searchClear() {
    document.querySelector(".search").value = "";
    searchFocus();
    searchLength();
};

function searchFocus() {
    document.querySelector(".search").focus();
};