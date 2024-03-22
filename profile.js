document.addEventListener("DOMContentLoaded", function() {
    if(localStorage.getItem("imageSrc")) {
        document.getElementById("image").src = localStorage.getItem("imageSrc");
    }

    document.getElementById("imageInput").addEventListener("change", function(event) {
        var file = event.target.files[0];

        if (file) {
            var reader = new FileReader();
            reader.onload = function() {
                var imageDataURL = reader.result;
                document.getElementById("image").src = imageDataURL;
                localStorage.setItem("imageSrc", imageDataURL);
            };

            reader.readAsDataURL(file);
        }
    });

    document.getElementById("changeButton").addEventListener("click", function() {
        document.getElementById("imageInput").click();
    });
});