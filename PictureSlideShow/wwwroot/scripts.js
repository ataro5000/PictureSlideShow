document.addEventListener("DOMContentLoaded", async () => {
    const carouselContent = document.getElementById("carouselContent");
    const toggleButton = document.getElementById("toggleSlideshow");
    const modeButton = document.getElementById("toggleMode");
    const carouselElement = document.getElementById("pictureCarousel");
    const carouselDirection = document.getElementById("toggleDirection");

    let isPlaying = true; // Tracks whether the slideshow is playing
    let isRandom = false; // Tracks whether the slideshow is in random mode
    let isForward = true; // Tracks the direction of the slideshow

    try {
        // Fetch the JSON data from the API
        const response = await fetch("/api/pictures");
        const pictures = await response.json();

        // Debugging: Log the fetched pictures
        console.log("Fetched pictures:", pictures);

        // Populate the carousel
        const populateCarousel = (data) => {
            carouselContent.innerHTML = ""; // Clear existing items
            data.forEach((picture, index) => {
                if (!picture.imagePath || !picture.title || !picture.subtitle) {
                    console.error("Invalid picture data:", picture);
                    return;
                }

                const isActive = index === 0 ? "active" : "";
                const carouselItem = `
                    <div class="carousel-item ${isActive}">
                        <img src="${picture.imagePath}" class="d-block w-100" alt="${picture.title}">
                        <div class="carousel-caption d-none d-md-block">
                            <h5>${picture.title}</h5>
                            <p>${picture.subtitle}</p>
                        </div>
                    </div>
                `;
                carouselContent.innerHTML += carouselItem;
            });
        };

        // Initial population of the carousel
        populateCarousel(pictures);

        // Bootstrap carousel instance
        const carouselInstance = new bootstrap.Carousel(carouselElement, {
            interval: 5000, // Change slides every 3 seconds
            pause: false
        });

        // Toggle slideshow functionality
        toggleButton.addEventListener("click", () => {
            if (isPlaying) {
                carouselInstance.pause(); // Pause the carousel
                carouselInstance._config.interval = 0; // Set interval to 0 to stop automatic cycling

                toggleButton.textContent = "Start Slideshow";
            } else {
                carouselInstance.cycle(); // Resume the carousel
                toggleButton.textContent = "Stop Slideshow";
            }
            isPlaying = !isPlaying;
            // Toggle the state
        });

        // Prevent carousel from cycling when manually interacting with controls
        const nextButton = document.querySelector(".carousel-control-next");
        const prevButton = document.querySelector(".carousel-control-prev");

        nextButton.addEventListener("click", () => {
            if (!isPlaying) {
                carouselInstance.pause(); // Ensure the carousel stays paused
            }
        });

        prevButton.addEventListener("click", () => {
            if (!isPlaying) {
                carouselInstance.pause(); // Ensure the carousel stays paused
            }
        });
        // Toggle slideshow mode (random/sequential)
        modeButton.addEventListener("click", () => {
            isRandom = !isRandom;
            modeButton.textContent = isRandom ? "Switch to Sequential" : "Switch to Random";

            if (isRandom) {
                // Shuffle the pictures array
                const shuffledPictures = [...pictures].sort(() => Math.random() - 0.5);
                console.log("Switched to Random Mode:", shuffledPictures);
                populateCarousel(shuffledPictures);
            } else {
                // Reset to sequential order
                console.log("Switched to Sequential Mode:", pictures);
                populateCarousel(pictures);
            }

            // Restart the slideshow if it's playing
            if (isPlaying) {
                carouselInstance.pause();
                carouselInstance.cycle();
            }
        });

        carouselDirection.addEventListener("click", () => {
            isForward = !isForward;
            carouselDirection.textContent = isForward ? "Switch to Reverse" : "Switch to Forward";

            if (isForward) {
                console.log("Switched to forward direction");
            } else {
                console.log("Switched to reverse direction");
            }
        });
        setInterval(() => {
            if (isPlaying) {
                const totalSlides = carouselElement.querySelectorAll(".carousel-item").length;

                if (isForward) {
                    carouselInstance.next(); // Move to the next slide
                } else {
                    const activeIndex = carouselElement.querySelector(".carousel-item.active").getAttribute("data-bs-slide-to");
                    const previousIndex = activeIndex === "0" ? totalSlides - 1 : parseInt(activeIndex) - 1;

                    carouselInstance.to(previousIndex); // Directly move to the previous slide
                }
            }
        }, carouselInstance._config.interval);

    } catch (error) {
        console.error("Error loading pictures:", error);
    }
});