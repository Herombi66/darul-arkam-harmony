# School Management System API Client

A comprehensive Python client library for integrating with the School Management System API. This library provides OAuth2 authentication and supports data synchronization for students, attendance records, and notifications.

## Features

- **OAuth2 Authentication**: Secure token-based authentication with automatic refresh
- **Student Management**: CRUD operations for student records
- **Attendance Tracking**: Manage attendance records with date range queries
- **Notification System**: Send and receive notifications
- **Data Synchronization**: Batch processing for large datasets
- **Error Handling**: Comprehensive error handling with detailed error messages
- **Logging**: Built-in logging for debugging and monitoring
- **Type Hints**: Full type annotations for better IDE support

## Installation

```bash
pip install school-api-client
```

Or install from source:

```bash
git clone https://github.com/kilocode/school-api-client.git
cd school-api-client
pip install -r requirements.txt
pip install .
```

## Quick Start

```python
from school_api_client import SchoolAPIClient

# Initialize the client
client = SchoolAPIClient(
    base_url="https://your-school-api.com",
    client_id="your_client_id",
    client_secret="your_client_secret"
)

# Authenticate
auth_result = client.authenticate("admin@example.com", "password")
print("Authentication successful!")

# Get students
students = client.get_students()
print(f"Found {students['count']} students")

# Sync student data
sample_students = [
    {
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com",
        "rollNumber": "SMS2024001",
        "dateOfBirth": "2005-05-15",
        "gender": "male",
        "phoneNumber": "+1234567890",
        "address": "123 Main St"
    }
]

sync_result = client.sync_students(sample_students)
print(f"Created: {sync_result['created']}, Updated: {sync_result['updated']}")
```

## API Reference

### Authentication

```python
# Authenticate with username/password
auth_result = client.authenticate(username, password)

# Check if token is expired
is_expired = client.oauth.is_token_expired()

# Refresh token manually
client.oauth.refresh_access_token()
```

### Student Management

```python
# Get all students
students = client.get_students(page=1, limit=20)

# Get single student
student = client.get_student(student_id=123)

# Create student
new_student = client.create_student({
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@example.com",
    "rollNumber": "SMS2024002",
    "dateOfBirth": "2005-08-20",
    "gender": "female"
})

# Update student
updated_student = client.update_student(123, {"phoneNumber": "+1987654321"})

# Delete student
client.delete_student(123)

# Get student's subjects/results/attendance
subjects = client.get_student_subjects(123)
results = client.get_student_results(123)
attendance = client.get_student_attendance(123)
```

### Attendance Management

```python
# Get attendance records
attendance = client.get_attendance(page=1, limit=20)

# Create attendance record
new_attendance = client.create_attendance({
    "studentId": 123,
    "date": "2024-01-15",
    "status": "present",
    "remarks": "On time"
})

# Get attendance by date range
attendance_range = client.get_attendance_by_date_range("2024-01-01", "2024-01-31")
```

### Notification Management

```python
# Get notifications
notifications = client.get_notifications(page=1, limit=20)

# Create notification
notification = client.create_notification({
    "title": "School Event",
    "message": "Parent-teacher meeting tomorrow",
    "type": "info",
    "priority": "medium",
    "recipientId": 123
})

# Mark as read
client.mark_notification_as_read(notification_id=456)

# Get unread count
unread_count = client.get_unread_notification_count()
```

### Data Synchronization

```python
# Sync students in batches
batch_processor = BatchProcessor(client, batch_size=50)
results = batch_processor.process_students_batch(large_student_list)

# Sync attendance records
attendance_results = client.sync_attendance(attendance_records)

# Sync notifications
notification_results = client.sync_notifications(notification_list)

# Get sync status
status = client.get_sync_status()
```

## Error Handling

The client provides comprehensive error handling:

```python
from school_api_client import SchoolAPIError

try:
    students = client.get_students()
except SchoolAPIError as e:
    print(f"API Error: {e}")
    print(f"Status Code: {e.status_code}")
    print(f"Response Data: {e.response_data}")
```

## Configuration

### Environment Variables

```bash
export SCHOOL_API_BASE_URL="https://your-school-api.com"
export SCHOOL_API_CLIENT_ID="your_client_id"
export SCHOOL_API_CLIENT_SECRET="your_client_secret"
```

### Logging

```python
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("school_api_client")
```

## Advanced Usage

### Custom Request Handling

```python
# Custom session configuration
client.session.headers.update({"X-Custom-Header": "value"})
client.session.timeout = 60  # 60 second timeout
```

### Batch Processing

```python
# Process large datasets efficiently
batch_processor = BatchProcessor(client, batch_size=100)

# Process students
student_results = batch_processor.process_students_batch(student_data)

# Process attendance
attendance_results = batch_processor.process_attendance_batch(attendance_data)
```

### Retry Logic

```python
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
def sync_with_retry():
    return client.sync_students(student_data)
```

## Security Considerations

- Store client credentials securely (environment variables, secret management)
- Use HTTPS in production
- Implement proper token refresh logic
- Monitor API usage and rate limits
- Validate data before sending to API

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions:
- GitHub Issues: https://github.com/kilocode/school-api-client/issues
- Email: support@kilocode.com
- Documentation: https://school-api-client.readthedocs.io/