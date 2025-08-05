// Profile Image State Control
document.addEventListener('DOMContentLoaded', () => {
    const profileContainer = document.querySelector('.profile-image-inner');
    let isFunMode = false;

    // Function to toggle between professional and fun modes
    function toggleProfileState() {
        isFunMode = !isFunMode;
        if (isFunMode) {
            profileContainer.classList.add('show-fun');
        } else {
            profileContainer.classList.remove('show-fun');
        }
    }

    // Add click handler to toggle states
    profileContainer.addEventListener('click', toggleProfileState);

    // Optional: Add hover effects
    profileContainer.addEventListener('mouseenter', () => {
        profileContainer.style.cursor = 'pointer';
    });

    // Add keyboard controls for accessibility
    document.addEventListener('keydown', (e) => {
        if (document.activeElement === profileContainer) {
            switch(e.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                    if (currentState === 'default') switchProfileState('fun');
                    else if (currentState === 'fun') switchProfileState('professional');
                    else switchProfileState('default');
                    break;
                case 'ArrowLeft':
                case 'ArrowUp':
                    if (currentState === 'professional') switchProfileState('fun');
                    else if (currentState === 'fun') switchProfileState('default');
                    else switchProfileState('professional');
                    break;
            }
        }
    });

    // Add focus management for accessibility
    profileContainer.setAttribute('tabindex', '0');
    profileContainer.setAttribute('role', 'button');
    profileContainer.setAttribute('aria-label', 'Switch profile image style');
});
