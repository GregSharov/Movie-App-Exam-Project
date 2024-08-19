$(document).ready(function () {
    $('#search').on('input', function () {
        const query = $(this).val();
        if (query === "") {
            location.reload();
        } else {
            $.ajax({
                url: '/search',
                type: 'GET',
                data: { q: query },
                success: function (data) {
                    $('#results').empty();
                    if (data.length === 0) {
                        $('#results').append('<p class="text-center text-gray-700 dark:text-gray-300 col-span-full">No movies found</p>');
                    } else {
                        data.forEach(movie => {
                            const imagePath = movie.image && movie.image.path ? movie.image.path.replace("public", "") : '';
                            const matchedMovie = `
                                <div class="bg-white dark:bg-gray-900 bg-gradient-to-tl from-gray-100 to-white dark:bg-gradient-to-tl dark:from-gray-800 dark:to-gray-900 p-6 rounded-lg shadow-md">
                                    <div class="mb-4">
                                        <div class="flex justify-between">
                                            <p class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">${movie.title}</p>
                                            <form action="/delete/${movie.id}" method="post" class="delete-movie-form text-right">
                                                <button type="submit" class="deleteButton text-gray-500 hover:text-gray-700">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </form>
                                        </div>
                                        <div class="flex flex-col items-center">
                                            ${imagePath ? `<img src="${imagePath}" alt="Image for ${movie.title}" class="cursor-pointer h-80 w-60 rounded-lg mt-4 mb-4" data-modal-target="movie-modal-${movie.id}" data-modal-toggle="movie-modal-${movie.id}">` : ''}
                                        </div>
                                    </div>
                                </div>

                                <!-- Modal structure -->
                                <div id="movie-modal-${movie.id}" tabindex="-1" aria-hidden="true" class="hidden fixed inset-0 z-50 flex items-center justify-center">
                                    <div class="relative w-auto max-w-lg max-h-[80%] overflow-auto p-4">
                                        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                            <div class="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
                                                <h3 class="text-xl font-semibold text-gray-900 dark:text-white break-words">${movie.title}</h3>
                                            </div>
                                            <div class="p-4 space-y-4">
                                                <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400 break-words">Year: ${movie.year}</p>
                                                <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400 break-words">Director: ${movie.director}</p>
                                                <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400 break-words">Actors: ${movie.actors.join(', ')}</p>
                                            </div>
                                            <div class="flex items-center p-4 border-t border-gray-200 rounded-b dark:border-gray-600">
                                                <button type="button" class="text-black bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onclick="closeModal('${movie.id}')">Close</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `;
                            $('#results').append(matchedMovie);
                        });

                        // Attach event listeners for modal toggling
                        $('[data-modal-toggle]').on('click', function () {
                            const modalId = $(this).data('modal-target');
                            $(`#${modalId}`).toggleClass('hidden');
                        });

                        // Close modal when clicking on the Close button or outside the modal
                        $('.modal-close').on('click', function () {
                            $(this).closest('.modal').addClass('hidden');
                        });
                    }
                },
                error: function (error) {
                    console.error("Error searching movies: ", error);
                }
            });
        }
    });
});

function closeModal(movieId) {
    $(`#movie-modal-${movieId}`).addClass('hidden');
}
