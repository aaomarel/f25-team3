document.addEventListener('DOMContentLoaded', function() {
    const sportSelect = document.getElementById('sport');
    const locationSelect = document.getElementById('location');
    const playerLimitSelect = document.getElementById('player-limit');
    const timeSelect = document.getElementById('time');
    const dateInput = document.querySelector('input[type="date"]');

    const locations = {
        'Basketball': [
            'Outdoor Courts 1',
            'Outdoor Courts 2',
            'Outdoor Courts 3',
            'Kaplan Upstairs Court 1',
            'Kaplan Upstairs Court 2',
            'Kaplan Upstairs Court 3',
            'Kaplan Downstairs Court 1'
        ],
        'Soccer': [
            'Rec Field',
            'Indoor Kaplan Court 1',
            'Indoor Kaplan Court 2'
        ]
    };

    const playerLimits = {
        'Basketball': [4,6,8,10],
        'Soccer': [4,6,8,10,12,14]
    };

    const times = ['6:00pm', '7:00pm', '8:00pm', '9:00pm'];

    function updateLocations() {
        const sport = sportSelect.value;
        locationSelect.innerHTML = '';
        (locations[sport] || []).forEach(loc => {
            const opt = document.createElement('option');
            opt.value = loc;
            opt.textContent = loc;
            locationSelect.appendChild(opt);
        });
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

    function populateTimes() {
        timeSelect.innerHTML = '';
        times.forEach(t => {
            const opt = document.createElement('option');
            opt.value = t;
            opt.textContent = t;
            timeSelect.appendChild(opt);
        });
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

    // Initial population
    updateLocations();
    updatePlayerLimits();
    populateTimes();
});
