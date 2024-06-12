// When the DOM content is loaded, execute the following code
document.addEventListener('DOMContentLoaded', function() {
    // Get references to various elements in the HTML document
    const quoteForm = document.getElementById('quote-form');
    const accessForm = document.getElementById('access-form');
    const quoteList = document.getElementById('quote-list');
    const accessPasswordInput = document.getElementById('access-password');
    const accessButton = document.getElementById('access-button');

    // Get today's date in the format YYYY-MM-DD
const today = new Date().toISOString().split('T')[0];

// Set the max attribute of the date input field to today's date
document.getElementById('date').max = today;

    // Load existing quotes from local storage or initialize an empty array
    const quotes = loadQuotes();

    // Initialize variables to track the state of the application
    let isQuotesDisplayed = false;
    let canDeleteQuotes = false;

    // Define the base path for image files
    const basePath = 'https://github.com/casseebee/casseebee-quote-tracker/blob/main';

    // Define image paths for different individuals
    const imagePaths = {
        Cassie: [
            `${basePath}/Cassie/cassie1.png`,
            `${basePath}/Cassie/cassie2.png`,
            `${basePath}/Cassie/cassie3.png`
        ],
        Sloly: [
            `${basePath}/Sloly/sloly1.png`,
            `${basePath}/Sloly/sloly2.png`,
            `${basePath}/Sloly/sloly3.png`
        ],
        Fliss: [
            `${basePath}/Fliss/fliss1.png`,
            `${basePath}/Fliss/fliss2.png`,
            `${basePath}/Fliss/fliss3.png`
        ],
        Lambo: [
            `${basePath}/Lambo/lambo1.png`,
            `${basePath}/Lambo/lambo2.png`,
            `${basePath}/Lambo/lambo3.png`
        ],
        Nat: [
            `${basePath}/Nat/nat1.png`,
            `${basePath}/Nat/nat2.png`,
            `${basePath}/Nat/nat3.png`
        ],
        Kazia: [
            `${basePath}/Kazia/kazia1.png`,
            `${basePath}/Kazia/kazia2.png`,
            `${basePath}/Kazia/kazia3.png`
        ]
    };

    // Create a span element to display the number of quotes
    const quoteCounter = document.createElement('span');
    updateQuoteCounter();
    // accessButton.appendChild(quoteCounter); // Move the counter inside the button BRAND NEW LINE
    // accessForm.insertBefore(quoteCounter, accessPasswordInput);

    // Add an event listener to the quote form for submitting new quotes
    quoteForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Quote form submitted'); // Add this line to check if the form submission event is triggered

        // Get values from the input fields
        const quote = document.getElementById('quote').value;
        const who = document.getElementById('who').value;
        const date = document.getElementById('date').value;
        const context = document.getElementById('context').value;

        // Get a random image path based on the selected individual
        const image = getRandomImage(who);

        // Create a new quote object
        const quoteItem = { quote, who, date, context, image };

        // Add the new quote to the quotes array and save to local storage
        quotes.push(quoteItem);
        saveQuotes();

        // Reset the quote form and display a success message
        quoteForm.reset();
        console.log('About to show message'); // Add this line to check if the showMessage function is being called
        showMessage('Quote submitted successfully!');
        updateQuoteCounter(); // Add this line to update the quote counter

        // Re-display the quotes
    displayQuotes(canDeleteQuotes); // Make sure to pass the current canDeleteQuotes status, this adds the new quote to the list without needing to refresh

    });

    // Add an event listener to the access button for displaying quotes
    accessButton.addEventListener('click', function() {
        const password = accessPasswordInput.value;
        if (password === '12345cassie' || password === '12345sillybratz') {
            canDeleteQuotes = password === '12345cassie';
            displayQuotes(canDeleteQuotes);
            isQuotesDisplayed = true;
        } else {
            alert('Incorrect password!');
        }
    });

    // Get a random image path for a given individual
    function getRandomImage(who) {
        const images = imagePaths[who] || [];
        if (images.length > 0) {
            return images[Math.floor(Math.random() * images.length)];
        }
        return null;
    }

    // Save quotes to local storage
    function saveQuotes() {
        localStorage.setItem('quotes', JSON.stringify(quotes));
    }

    // Load quotes from local storage
    function loadQuotes() {
        const storedQuotes = localStorage.getItem('quotes');
        return storedQuotes ? JSON.parse(storedQuotes) : [];
    }

    // Delete a quote from the quotes array and update the display
    function deleteQuote(index) {
        quotes.splice(index, 1);
        saveQuotes();
        displayQuotes(true);
        updateQuoteCounter();
    }





    // Function to display the list of quotes
    function displayQuotes(canDelete) {
        // Clear the existing content of the quote list
        quoteList.innerHTML = '';
        // Check if there are no quotes uploaded yet
        if (quotes.length === 0) {
            // If no quotes, display a message indicating so
            quoteList.innerHTML = '<p>No quotes uploaded yet</p>';
        } else {
            // If there are quotes, loop through each quote item
            quotes.forEach((quoteItem, index) => {
                // Add the quote item to the list
                addQuoteToList(quoteItem, index, canDelete);
            });
        }
        // Make the quote list visible by removing the 'hidden' class
        quoteList.classList.remove('hidden');
    }

    // Function to add a quote item to the list
    function addQuoteToList(quoteItem, index, canDelete) {
        // Create a new div element for the quote item
        const div = document.createElement('div');
        div.classList.add('quote-item');

        // Display randomly selected image before the quote
        if (quoteItem.image) {
            const thumbnail = document.createElement('img');
            thumbnail.src = quoteItem.image;
            thumbnail.alt = 'Quote thumbnail';
            thumbnail.classList.add('quote-thumbnail');
            div.appendChild(thumbnail);
        }

           // Add HTML content for the quote details
    const quoteText = document.createElement('p');
    quoteText.classList.add('quote-text');
    quoteText.innerHTML = `<em style="color: #ff69b4;">${quoteItem.quote}</em>`;
    div.appendChild(quoteText);

    const whoParagraph = document.createElement('p');
    whoParagraph.textContent = `Who: ${quoteItem.who}`;
    div.appendChild(whoParagraph);

    const dateParagraph = document.createElement('p');
    dateParagraph.textContent = `Date: ${quoteItem.date}`;
    div.appendChild(dateParagraph);

    // Add Context paragraph if context exists
    if (quoteItem.context.trim() !== '') {
        const contextParagraph = document.createElement('p');
        contextParagraph.classList.add('quote-context');
        contextParagraph.textContent = `Context: ${quoteItem.context}`;
        div.appendChild(contextParagraph);
    }

        // Display uploaded image below the quote
        if (quoteItem.uploadedImage) {
            const uploadedImage = document.createElement('img');
            uploadedImage.src = quoteItem.uploadedImage;
            uploadedImage.alt = 'Uploaded quote image';
            uploadedImage.classList.add('quote-uploaded-image');
            div.appendChild(uploadedImage);
        }

        // If user has permission to delete quotes, add delete button
        if (canDelete) {
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => deleteQuote(index));
            div.appendChild(deleteButton);
        }

        // Append the quote item div to the quote list
        quoteList.appendChild(div);
    }

    
    // Function to display a temporary message
function showMessage(message) {
    // Add a console log to check if the function is being called
    console.log('Showing message:', message);
    // Create a new div element for the message
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.textContent = message;
    // Append the message div to the document body
    document.body.appendChild(messageDiv);
    // Remove the message after a delay of 2 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 2000);
}

// Function to update the quote counter display
function updateQuoteCounter() {
    // Update the text content of the access button to include the counter
    accessButton.textContent = `Access Quotes (${quotes.length})`;
    // Set the text content of the quote counter span element
    quoteCounter.textContent = ` (${quotes.length})`;
}
});
