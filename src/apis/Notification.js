// JavaScript Example: Reading Entities
// Filterable fields: type, title, message, severity, read, metadata, target_user
async function fetchNotificationEntities() {
    const response = await fetch(`https://app.base44.com/api/apps/691f73cbfb1c909e74c4628c/entities/Notification`, {
        headers: {
            'api_key': 'daf5fc78141c4d9aa25c50603a425791', // or use await User.me() to get the API key
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    console.log(data);
}

// JavaScript Example: Updating an Entity
// Filterable fields: type, title, message, severity, read, metadata, target_user
async function updateNotificationEntity(entityId, updateData) {
    const response = await fetch(`https://app.base44.com/api/apps/691f73cbfb1c909e74c4628c/entities/Notification/${entityId}`, {
        method: 'PUT',
        headers: {
            'api_key': 'daf5fc78141c4d9aa25c50603a425791', // or use await User.me() to get the API key
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
    });
    const data = await response.json();
    console.log(data);
}
export { fetchNotificationEntities, updateNotificationEntity };