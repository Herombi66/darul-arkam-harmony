"""
School Management System API Client
====================================

A Python client library for integrating with the School Management System API.
Supports OAuth2 authentication and provides methods for data synchronization.

Author: Kilo Code
Version: 1.0.0
"""

import requests
import json
import time
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Union
from urllib.parse import urljoin, urlencode
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class SchoolAPIError(Exception):
    """Custom exception for School API errors"""
    def __init__(self, message: str, status_code: int = None, response_data: dict = None):
        super().__init__(message)
        self.status_code = status_code
        self.response_data = response_data


class OAuth2Client:
    """OAuth2 client for handling authentication"""

    def __init__(self, base_url: str, client_id: str, client_secret: str):
        self.base_url = base_url.rstrip('/')
        self.client_id = client_id
        self.client_secret = client_secret
        self.token_url = urljoin(self.base_url, '/api/oauth/token')
        self.access_token: Optional[str] = None
        self.refresh_token: Optional[str] = None
        self.token_expires_at: Optional[datetime] = None

    def authenticate(self, username: str, password: str) -> dict:
        """Authenticate using username and password"""
        data = {
            'grant_type': 'password',
            'client_id': self.client_id,
            'client_secret': self.client_secret,
            'username': username,
            'password': password,
            'scope': 'read write'
        }

        response = requests.post(self.token_url, data=data)
        return self._handle_token_response(response)

    def refresh_access_token(self) -> dict:
        """Refresh access token using refresh token"""
        if not self.refresh_token:
            raise SchoolAPIError("No refresh token available")

        data = {
            'grant_type': 'refresh_token',
            'client_id': self.client_id,
            'client_secret': self.client_secret,
            'refresh_token': self.refresh_token
        }

        response = requests.post(self.token_url, data=data)
        return self._handle_token_response(response)

    def _handle_token_response(self, response: requests.Response) -> dict:
        """Handle OAuth2 token response"""
        if response.status_code != 200:
            raise SchoolAPIError(
                f"Authentication failed: {response.text}",
                response.status_code,
                response.json() if response.text else None
            )

        token_data = response.json()

        self.access_token = token_data.get('access_token')
        self.refresh_token = token_data.get('refresh_token')

        # Calculate token expiration time
        expires_in = token_data.get('expires_in', 3600)
        self.token_expires_at = datetime.now() + timedelta(seconds=expires_in)

        return token_data

    def is_token_expired(self) -> bool:
        """Check if access token is expired or will expire soon"""
        if not self.token_expires_at:
            return True
        # Consider token expired if it expires within next 5 minutes
        return datetime.now() + timedelta(minutes=5) >= self.token_expires_at

    def ensure_valid_token(self):
        """Ensure we have a valid access token"""
        if self.is_token_expired():
            if self.refresh_token:
                try:
                    self.refresh_access_token()
                except SchoolAPIError:
                    raise SchoolAPIError("Failed to refresh token. Please re-authenticate.")
            else:
                raise SchoolAPIError("Access token expired and no refresh token available")


class SchoolAPIClient:
    """Main API client for School Management System"""

    def __init__(self, base_url: str, client_id: str, client_secret: str):
        self.base_url = base_url.rstrip('/')
        self.oauth = OAuth2Client(base_url, client_id, client_secret)
        self.session = requests.Session()
        self.session.timeout = 30  # 30 second timeout

    def authenticate(self, username: str, password: str) -> dict:
        """Authenticate with the API"""
        return self.oauth.authenticate(username, password)

    def _make_request(self, method: str, endpoint: str, **kwargs) -> dict:
        """Make authenticated API request"""
        self.oauth.ensure_valid_token()

        url = urljoin(self.base_url, endpoint)
        headers = kwargs.get('headers', {})
        headers['Authorization'] = f'Bearer {self.oauth.access_token}'
        headers['Content-Type'] = 'application/json'
        kwargs['headers'] = headers

        # Convert data to JSON if it's a dict
        if 'data' in kwargs and isinstance(kwargs['data'], dict):
            kwargs['data'] = json.dumps(kwargs['data'])

        try:
            response = self.session.request(method, url, **kwargs)

            if response.status_code >= 400:
                error_data = response.json() if response.text else {}
                raise SchoolAPIError(
                    error_data.get('error', 'API request failed'),
                    response.status_code,
                    error_data
                )

            return response.json() if response.text else {}

        except requests.RequestException as e:
            raise SchoolAPIError(f"Request failed: {str(e)}")

    # Student Management Methods
    def get_students(self, page: int = 1, limit: int = 20) -> dict:
        """Get list of students"""
        params = {'page': page, 'limit': limit}
        return self._make_request('GET', '/api/students', params=params)

    def get_student(self, student_id: int) -> dict:
        """Get single student by ID"""
        return self._make_request('GET', f'/api/students/{student_id}')

    def create_student(self, student_data: dict) -> dict:
        """Create new student"""
        return self._make_request('POST', '/api/students', data=student_data)

    def update_student(self, student_id: int, student_data: dict) -> dict:
        """Update student"""
        return self._make_request('PUT', f'/api/students/{student_id}', data=student_data)

    def delete_student(self, student_id: int) -> dict:
        """Delete student"""
        return self._make_request('DELETE', f'/api/students/{student_id}')

    def get_student_subjects(self, student_id: int) -> dict:
        """Get student's subjects"""
        return self._make_request('GET', f'/api/students/{student_id}/subjects')

    def get_student_results(self, student_id: int) -> dict:
        """Get student's results"""
        return self._make_request('GET', f'/api/students/{student_id}/results')

    def get_student_attendance(self, student_id: int) -> dict:
        """Get student's attendance"""
        return self._make_request('GET', f'/api/students/{student_id}/attendance')

    def get_student_payments(self, student_id: int) -> dict:
        """Get student's payments"""
        return self._make_request('GET', f'/api/students/{student_id}/payments')

    # Attendance Management Methods
    def get_attendance(self, page: int = 1, limit: int = 20) -> dict:
        """Get attendance records"""
        params = {'page': page, 'limit': limit}
        return self._make_request('GET', '/api/attendance', params=params)

    def get_attendance_record(self, attendance_id: int) -> dict:
        """Get single attendance record"""
        return self._make_request('GET', f'/api/attendance/{attendance_id}')

    def create_attendance(self, attendance_data: dict) -> dict:
        """Create attendance record"""
        return self._make_request('POST', '/api/attendance', data=attendance_data)

    def update_attendance(self, attendance_id: int, attendance_data: dict) -> dict:
        """Update attendance record"""
        return self._make_request('PUT', f'/api/attendance/{attendance_id}', data=attendance_data)

    def delete_attendance(self, attendance_id: int) -> dict:
        """Delete attendance record"""
        return self._make_request('DELETE', f'/api/attendance/{attendance_id}')

    def get_attendance_by_date_range(self, start_date: str, end_date: str) -> dict:
        """Get attendance records by date range"""
        return self._make_request('GET', f'/api/attendance/date/{start_date}/{end_date}')

    # Notification Management Methods
    def get_notifications(self, page: int = 1, limit: int = 20) -> dict:
        """Get notifications"""
        params = {'page': page, 'limit': limit}
        return self._make_request('GET', '/api/notifications', params=params)

    def get_notification(self, notification_id: int) -> dict:
        """Get single notification"""
        return self._make_request('GET', f'/api/notifications/{notification_id}')

    def create_notification(self, notification_data: dict) -> dict:
        """Create notification"""
        return self._make_request('POST', '/api/notifications', data=notification_data)

    def mark_notification_as_read(self, notification_id: int) -> dict:
        """Mark notification as read"""
        return self._make_request('PUT', f'/api/notifications/{notification_id}/read')

    def mark_all_notifications_as_read(self) -> dict:
        """Mark all notifications as read"""
        return self._make_request('PUT', '/api/notifications/read-all')

    def delete_notification(self, notification_id: int) -> dict:
        """Delete notification"""
        return self._make_request('DELETE', f'/api/notifications/{notification_id}')

    def get_unread_notification_count(self) -> dict:
        """Get unread notification count"""
        return self._make_request('GET', '/api/notifications/unread-count')

    def send_bulk_notifications(self, notifications_data: dict) -> dict:
        """Send bulk notifications"""
        return self._make_request('POST', '/api/notifications/bulk', data=notifications_data)

    # Data Synchronization Methods
    def sync_students(self, students: List[dict], last_sync_timestamp: Optional[str] = None) -> dict:
        """Sync student records"""
        data = {
            'students': students,
            'lastSyncTimestamp': last_sync_timestamp
        }
        return self._make_request('POST', '/api/sync/students', data=data)

    def sync_attendance(self, attendance_records: List[dict], last_sync_timestamp: Optional[str] = None) -> dict:
        """Sync attendance records"""
        data = {
            'attendanceRecords': attendance_records,
            'lastSyncTimestamp': last_sync_timestamp
        }
        return self._make_request('POST', '/api/sync/attendance', data=data)

    def sync_notifications(self, notifications: List[dict], last_sync_timestamp: Optional[str] = None) -> dict:
        """Sync notifications"""
        data = {
            'notifications': notifications,
            'lastSyncTimestamp': last_sync_timestamp
        }
        return self._make_request('POST', '/api/sync/notifications', data=data)

    def get_sync_status(self) -> dict:
        """Get synchronization status"""
        return self._make_request('GET', '/api/sync/status')

    def cleanup_sync_data(self, entity_type: str, before_date: str) -> dict:
        """Cleanup old sync data"""
        data = {
            'entityType': entity_type,
            'beforeDate': before_date
        }
        return self._make_request('DELETE', '/api/sync/cleanup', data=data)


class BatchProcessor:
    """Helper class for batch processing operations"""

    def __init__(self, client: SchoolAPIClient, batch_size: int = 50):
        self.client = client
        self.batch_size = batch_size

    def process_students_batch(self, students: List[dict]) -> dict:
        """Process students in batches"""
        results = {'created': 0, 'updated': 0, 'errors': []}

        for i in range(0, len(students), self.batch_size):
            batch = students[i:i + self.batch_size]
            try:
                batch_result = self.client.sync_students(batch)
                results['created'] += batch_result.get('created', 0)
                results['updated'] += batch_result.get('updated', 0)
                results['errors'].extend(batch_result.get('errors', []))
            except SchoolAPIError as e:
                results['errors'].append(f"Batch {i//self.batch_size + 1}: {str(e)}")

        return results

    def process_attendance_batch(self, attendance_records: List[dict]) -> dict:
        """Process attendance records in batches"""
        results = {'created': 0, 'updated': 0, 'skipped': 0, 'errors': []}

        for i in range(0, len(attendance_records), self.batch_size):
            batch = attendance_records[i:i + self.batch_size]
            try:
                batch_result = self.client.sync_attendance(batch)
                results['created'] += batch_result.get('created', 0)
                results['updated'] += batch_result.get('updated', 0)
                results['skipped'] += batch_result.get('skipped', 0)
                results['errors'].extend(batch_result.get('errors', []))
            except SchoolAPIError as e:
                results['errors'].append(f"Batch {i//self.batch_size + 1}: {str(e)}")

        return results


# Example usage
if __name__ == "__main__":
    # Initialize client
    client = SchoolAPIClient(
        base_url="http://localhost:5000",
        client_id="your_client_id",
        client_secret="your_client_secret"
    )

    try:
        # Authenticate
        auth_result = client.authenticate("admin@example.com", "password")
        print("Authentication successful:", auth_result)

        # Get students
        students = client.get_students()
        print("Students:", students)

        # Sync example
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
        print("Sync result:", sync_result)

    except SchoolAPIError as e:
        print(f"API Error: {e}")
        if e.status_code:
            print(f"Status Code: {e.status_code}")
        if e.response_data:
            print(f"Response: {e.response_data}")