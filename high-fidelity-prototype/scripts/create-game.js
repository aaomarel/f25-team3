document.addEventListener('DOMContentLoaded', function() {
    const sportSelect = document.getElementById('sport');
    const locationSelect = document.getElementById('location');
    const playerLimitSelect = document.getElementById('player-limit');
    const timeSelect = document.getElementById('time');
    const dateInput = document.querySelector('input[type="date"]');

    const locations = {
        'Basketball': [
            { name: 'Outdoor Courts 1', times: ['6:00pm', '7:00pm', '8:00pm'] },
            { name: 'Outdoor Courts 2', times: ['7:00pm', '8:00pm', '9:00pm'] },
            { name: 'Outdoor Courts 3', times: ['6:00pm', '9:00pm'] },
            { name: 'Kaplan Upstairs Court 1', times: ['6:00pm', '7:00pm'] },
            { name: 'Kaplan Upstairs Court 2', times: ['8:00pm', '9:00pm'] },
            { name: 'Kaplan Upstairs Court 3', times: ['6:00pm', '8:00pm'] },
            { name: 'Kaplan Downstairs Court 1', times: ['7:00pm', '9:00pm'] }
        ],
        'Soccer': [
            { name: 'Rec Field', times: ['6:00pm', '7:00pm', '8:00pm', '9:00pm'] },
            { name: 'Indoor Kaplan Court 1', times: ['7:00pm', '8:00pm'] },
            { name: 'Indoor Kaplan Court 2', times: ['6:00pm', '9:00pm'] }
        ]
    };

    const playerLimits = {
        'Basketball': [4, 6, 8, 10],
        'Soccer': [4, 6, 8, 10, 12, 14]
    };

    function updateLocations() {
        const sport = sportSelect.value;
        locationSelect.innerHTML = '';
        (locations[sport] || []).forEach(loc => {
            const opt = document.createElement('option');
            opt.value = loc.name;
            opt.textContent = loc.name;
            locationSelect.appendChild(opt);
        });
        updateTimes(); // Update times when locations change
    }

    function updatePlayerLimits() {
        const sport = sportSelect.value;
        playerLimitSelect.innerHTML = '';
        (playerLimits[sport] || []).forEach(num => {
            const opt = document.createElement('option');
            opt.value = num;
            opt.textContent = num + ' players';
            playerLimitSelect.appendChild(opt);
        });
    }

    function updateTimes() {
        const sport = sportSelect.value;
        const locationName = locationSelect.value;
        const locationData = (locations[sport] || []).find(loc => loc.name === locationName);
        
        timeSelect.innerHTML = '';
        if (locationData) {
            locationData.times.forEach(t => {
                const opt = document.createElement('option');
                opt.value = t;
                opt.textContent = t;
                timeSelect.appendChild(opt);
            });
        }
    }

    // Disable weekends in the date picker
    if (dateInput) {
        dateInput.addEventListener('input', function() {
            const date = new Date(this.value);
            const day = date.getUTCDay();
            if (day === 0 || day === 6) { // Sunday=0, Saturday=6
                alert('Please select a weekday (Monday-Friday).');
                this.value = '';
            }
        });
    }

    sportSelect.addEventListener('change', function() {
        updateLocations();
        updatePlayerLimits();
    });

    locationSelect.addEventListener('change', updateTimes);

    // Initial population
    updateLocations();
    updatePlayerLimits();
});
