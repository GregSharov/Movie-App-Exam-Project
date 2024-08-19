// Validation user's input data

$(document).ready(function () {

    // Title length
    function titleLengthCheck() {
        let title = $("#title").val();
        if (isTextInputsEmpty(title)) {
            return true;
        }
        return false;
    };

    // Director check
    function directorInputCheck() {
        let director = $("#director").val();
        if (isTextInputsEmpty(director)) {
            return true;
        }
        return false;
    }

    // Actors array
    function actorsArrLengthCheck() {
        let actors = $("#actors").val();
        const actorsArray = actors.split(",");

        for (let i = 0; i < actorsArray.length; i++) {
            if (isTextInputsEmpty(actorsArray[i]) || actorsArray.length < 2) {
                return true;
            }
        }

        return false;
    };

    // Is year correct
    function isYearCorrect() {
        let year = $("#year").val();
        return year < 1888 || year > new Date().getFullYear();
    }

    // Is image uploaded check
    function isImageUploaded() {
        let image = $("#image").val();
        console.log(image);
        return image === "";
    };

    // Check if text input fields are empty, null or spaces
    function isTextInputsEmpty(string) {
        string = string.trim();
        if (string === undefined || string === "" || string === null) {
            return true;
        }
        return false;
    };

    // Prevent Submit action
    $("#submitAddMovie").on("click", (event) => {
        let preventSubmition = false;

        if (titleLengthCheck()) {
            console.log("Title's length less than one character...", titleLengthCheck());
            $("#titleAlert").text("* title required (at least two characters)");
            preventSubmition = true;
        } else {
            $("#titleAlert").text("");
        }

        if (directorInputCheck()) {
            console.log("Director field is empty...", directorInputCheck());
            $("#directorAlert").text("* director required");
            preventSubmition = true;
        } else {
            $("#directorAlert").text("");
        }

        if (actorsArrLengthCheck()) {
            console.log("Actors less than two added...", actorsArrLengthCheck());
            $("#actorsAlert").text("* at least two actors required");
            preventSubmition = true;
        } else {
            $("#actorsAlert").text("");
        }

        if (isYearCorrect()) {
            console.log("Year is not correct...", isImageUploaded());
            $("#yearAlert").text("* year required (1888 - current year)");
            preventSubmition = true;
        } else {
            $("#yearAlert").text("");
        }

        if (isImageUploaded()) {
            console.log("Image is not uploaded...", isImageUploaded());
            $("#imageAlert").text("* image required");
            preventSubmition = true;
        } else {
            $("#imageAlert").text("");
        }

        if (preventSubmition) {
            console.log("Prevent true: " + preventSubmition);
            event.preventDefault();
        }
    });
});