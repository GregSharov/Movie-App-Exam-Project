// Delete movie confirmation
$(document).ready(function () {
    $(document).on("click", ".deleteButton", function (event) {
        event.preventDefault();

        const deleteConfirmation = confirm("Do you really want to delete this movie?");

        if (deleteConfirmation) {
            // Submit the closest form to the clicked button
            $(this).closest("form").submit();
        }
    });
});
