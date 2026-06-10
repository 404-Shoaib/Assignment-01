document.addEventListener('DOMContentLoaded', () => {
    // Set current year in the footer
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Initial predefined events
    let events = [
        {
            id: 1,
            name: "Tech Innovation Conference",
            date: "2026-08-15",
            description: "Annual technology conference focusing on AI, Web Development, and future trends."
        },
        {
            id: 2,
            name: "Community Developer Meetup",
            date: "2024-05-10",
            description: "A local gathering for developers to network, share ideas, and collaborate on open-source projects."
        },
        {
            id: 3,
            name: "End of Year Music Festival",
            date: "2026-12-31",
            description: "Celebrate the end of the year with our grand music festival featuring top local and international artists."
        }
    ];

    const eventsContainer = document.getElementById('events-container');
    const eventForm = document.getElementById('event-form');
    const warningMessage = document.getElementById('warning-message');
    const searchInput = document.getElementById('search-input');

    // Function to sort events by date ascending
    const sortEvents = () => {
        events.sort((a, b) => new Date(a.date) - new Date(b.date));
    };

    // Function to check if a date is in the past
    const isPastEvent = (dateString) => {
        const [year, month, day] = dateString.split('-');
        const eventDate = new Date(year, month - 1, day);
        
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to midnight for accurate date comparison
        
        return eventDate < today;
    };

    // Function to format date beautifully
    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split('-');
        const dateObj = new Date(year, month - 1, day);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return dateObj.toLocaleDateString(undefined, options);
    };

    // Function to render events
    const renderEvents = (filterText = '') => {
        eventsContainer.innerHTML = '';
        sortEvents();

        // Filter events based on search input
        const filteredEvents = events.filter(event => {
            const lowerCaseFilter = filterText.toLowerCase();
            return event.name.toLowerCase().includes(lowerCaseFilter) || 
                   event.date.includes(lowerCaseFilter);
        });

        if (filteredEvents.length === 0) {
            eventsContainer.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #777;">No events found matching your search.</p>';
            return;
        }

        // Create cards for each event
        filteredEvents.forEach(event => {
            const card = document.createElement('div');
            // Add 'past' class if the event date is before today
            card.className = `event-card ${isPastEvent(event.date) ? 'past' : ''}`;
            
            card.innerHTML = `
                <div>
                    <h3>${event.name}</h3>
                    <p class="event-date">📅 ${formatDate(event.date)}</p>
                    <p class="event-description">${event.description}</p>
                </div>
                <button class="btn-delete" onclick="deleteEvent(${event.id})">Delete</button>
            `;

            eventsContainer.appendChild(card);
        });
    };

    // Global delete function to be called from inline onclick handler
    window.deleteEvent = (id) => {
        events = events.filter(event => event.id !== id);
        renderEvents(searchInput.value);
    };

    // Add new event form submission
    eventForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('event-name').value.trim();
        const date = document.getElementById('event-date').value;
        const description = document.getElementById('event-description').value.trim();

        // Form Validation: Check if all fields are filled
        if (!name || !date || !description) {
            warningMessage.classList.remove('hidden');
            return;
        }

        // Hide warning if form is valid
        warningMessage.classList.add('hidden');

        // Create new event object
        const newEvent = {
            id: Date.now(), // Generate a unique ID
            name,
            date,
            description
        };

        // Add to events array
        events.push(newEvent);
        
        // Reset the form fields
        eventForm.reset();

        // Re-render the events list with the current search filter applied
        renderEvents(searchInput.value);
    });

    // Search functionality - listen for input changes
    searchInput.addEventListener('input', (e) => {
        renderEvents(e.target.value);
    });

    // Initial render of events on page load
    renderEvents();
});
