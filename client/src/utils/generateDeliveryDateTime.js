const generateDeliveryDateTime = (extraDay) => {
    const deliveryDate = new Date(); // Start with today's date
    deliveryDate.setDate(deliveryDate.getDate() + extraDay); // Example: Set delivery 2 days from now

    // Randomize time between 9:00 AM and 6:00 PM
    const minHour = 9;
    const maxHour = 18;

    const randomHour = Math.floor(Math.random() * (maxHour - minHour + 1)) + minHour;
    const randomMinute = Math.floor(Math.random() * 60);

    deliveryDate.setHours(randomHour, randomMinute, 0, 0);

    // Format the date and time (e.g., "dd/MM/yyyy HH:mm")
    const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, // 24-hour format
    };

    return deliveryDate.toLocaleDateString('vi-VN', options); // Format for Vietnam locale
};

export default generateDeliveryDateTime;
